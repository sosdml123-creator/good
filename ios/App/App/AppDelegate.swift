import UIKit
import Capacitor
import GoogleMobileAds
import WebKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        // Initialize Google Mobile Ads SDK as per official AdMob iOS guide
        GADMobileAds.sharedInstance().start(completionHandler: nil)

        DispatchQueue.main.async {
            if let bridgeVC = self.window?.rootViewController as? CAPBridgeViewController {
                bridgeVC.loadViewIfNeeded()
                if let webView = bridgeVC.webView {
                    GADMobileAds.sharedInstance().register(webView)
                    InlineAdManager.shared.attach(to: webView)
                }
            }
        }
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }

    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
        // Called when the app was launched with a url. Feel free to add additional processing here,
        // but if you want the App API to support tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        // Called when the app was launched with an activity, including Universal Links.
        // Feel free to add additional processing here, but if you want the App API to support
        // tracking app url opens, make sure to keep this call
        return ApplicationDelegateProxy.shared.application(application, continue: userActivity, restorationHandler: restorationHandler)
    }

    func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
        NotificationCenter.default.post(name: .capacitorDidRegisterForRemoteNotifications, object: deviceToken)
    }

    func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
        NotificationCenter.default.post(name: .capacitorDidFailToRegisterForRemoteNotifications, object: error)
    }

}

// MARK: - 인라인 배너 (웹 구좌 위치에 붙어 본문과 함께 스크롤되는 네이티브 AdMob 배너)
// JS(src/services/admobService.ts의 trackInlineBanner)가 window.webkit.messageHandlers.inlineAd 로
// 구좌 좌표를 보내면, 웹뷰 스크롤뷰 안의 같은 좌표에 배너를 배치한다.

/// 배너 바깥 영역의 터치는 웹뷰로 그대로 통과시키는 클리핑 컨테이너
private final class InlineAdContainerView: UIView {
    override func hitTest(_ point: CGPoint, with event: UIEvent?) -> UIView? {
        let hit = super.hitTest(point, with: event)
        return hit === self ? nil : hit
    }
}

final class InlineAdManager: NSObject, WKScriptMessageHandler, GADBannerViewDelegate {
    static let shared = InlineAdManager()
    private static let maxRetries = 5

    private final class Slot {
        let container = InlineAdContainerView()
        let banner = GADBannerView(adSize: GADAdSizeBanner)
        var retries = 0
    }

    private weak var webView: WKWebView?
    private var slots: [String: Slot] = [:]

    func attach(to webView: WKWebView) {
        guard self.webView == nil else { return }
        self.webView = webView
        webView.configuration.userContentController.add(self, name: "inlineAd")
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any],
              let action = body["action"] as? String else { return }

        if action == "reset" {
            Array(slots.keys).forEach(remove)
            return
        }

        guard let id = body["slot"] as? String else { return }
        switch action {
        case "update":
            guard let adId = body["adId"] as? String,
                  let frame = rect(body["frame"]),
                  let clip = rect(body["clip"]) else { return }
            update(id, adId: adId, frame: frame, clip: clip)
        case "hide":
            slots[id]?.container.isHidden = true
        case "remove":
            remove(id)
        default:
            break
        }
    }

    private func rect(_ value: Any?) -> CGRect? {
        guard let n = value as? [NSNumber], n.count == 4 else { return nil }
        return CGRect(x: n[0].doubleValue, y: n[1].doubleValue, width: n[2].doubleValue, height: n[3].doubleValue)
    }

    private func update(_ id: String, adId: String, frame: CGRect, clip: CGRect) {
        guard let webView = webView else { return }

        let slot: Slot
        if let existing = slots[id], existing.banner.adUnitID == adId {
            slot = existing
        } else {
            remove(id)
            slot = Slot()
            slot.container.clipsToBounds = true
            slot.container.addSubview(slot.banner)
            slot.banner.adUnitID = adId
            slot.banner.rootViewController = webView.window?.rootViewController
            slot.banner.delegate = self
            // 스크롤뷰 콘텐츠 좌표 = 웹 페이지 좌표이므로 Safe Area 보정이 따로 필요 없음
            webView.scrollView.addSubview(slot.container)
            slots[id] = slot
            slot.banner.load(GADRequest())
        }

        slot.container.frame = clip
        slot.banner.frame.origin = CGPoint(x: frame.minX - clip.minX, y: frame.minY - clip.minY)
        slot.container.isHidden = false
    }

    private func remove(_ id: String) {
        guard let slot = slots.removeValue(forKey: id) else { return }
        slot.banner.delegate = nil
        slot.container.removeFromSuperview()
    }

    private func entry(for bannerView: GADBannerView) -> (id: String, slot: Slot)? {
        guard let found = slots.first(where: { $0.value.banner === bannerView }) else { return nil }
        return (found.key, found.value)
    }

    private func notify(_ id: String, status: String, message: String? = nil) {
        var detail: [String: Any] = ["slot": id, "status": status]
        if let message = message { detail["message"] = message }
        guard let data = try? JSONSerialization.data(withJSONObject: detail),
              let json = String(data: data, encoding: .utf8) else { return }
        webView?.evaluateJavaScript("window.dispatchEvent(new CustomEvent('inlineAdStatus',{detail:\(json)}))", completionHandler: nil)
    }

    func bannerViewDidReceiveAd(_ bannerView: GADBannerView) {
        guard let found = entry(for: bannerView) else { return }
        found.slot.retries = 0
        notify(found.id, status: "loaded")
    }

    func bannerView(_ bannerView: GADBannerView, didFailToReceiveAdWithError error: Error) {
        NSLog("InlineAd: failed to load: \(error.localizedDescription)")
        guard let found = entry(for: bannerView) else { return }
        notify(found.id, status: "failed", message: error.localizedDescription)

        // 광고가 없을 때(no fill)를 대비해 간격을 늘려가며 제한적으로 재요청
        guard found.slot.retries < InlineAdManager.maxRetries else { return }
        found.slot.retries += 1
        let delay = 30.0 * Double(found.slot.retries)
        DispatchQueue.main.asyncAfter(deadline: .now() + delay) { [weak self, weak bannerView] in
            guard let self = self, let bannerView = bannerView, self.entry(for: bannerView) != nil else { return }
            bannerView.load(GADRequest())
        }
    }
}
