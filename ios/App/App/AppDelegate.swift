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

        // 구좌가 속한 웹 스크롤 영역의 네이티브 스크롤뷰 (스크롤 중 위치를 지연 없이 맞추기 위함)
        weak var scroller: UIScrollView?
        var observation: NSKeyValueObservation?
        var region = CGRect.zero
        var x: CGFloat = 0
        var contentY: CGFloat = 0
        var jsScrollTop: CGFloat = 0
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
            let scrollTop = CGFloat((body["scrollTop"] as? NSNumber)?.doubleValue ?? 0)
            let scrollHeight = CGFloat((body["scrollHeight"] as? NSNumber)?.doubleValue ?? 0)
            update(id, adId: adId, frame: frame, clip: clip,
                   scrollerRect: rect(body["scroller"]), scrollTop: scrollTop, scrollHeight: scrollHeight)
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

    private func update(_ id: String, adId: String, frame: CGRect, clip: CGRect,
                        scrollerRect: CGRect?, scrollTop: CGFloat, scrollHeight: CGFloat) {
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

        slot.region = clip
        slot.x = frame.minX
        slot.contentY = frame.minY + scrollTop
        slot.jsScrollTop = scrollTop
        bindScroller(slot, rect: scrollerRect, scrollHeight: scrollHeight, in: webView.scrollView)
        layout(slot)
        slot.container.isHidden = false
    }

    /// 배너 위치 = 구좌의 콘텐츠 내 위치 - 현재 스크롤 오프셋.
    /// 네이티브 스크롤뷰를 찾았으면 그 오프셋을 직접 읽고, 못 찾았으면 JS가 알려준 값을 사용한다.
    private func layout(_ slot: Slot) {
        let offsetY = slot.scroller?.contentOffset.y ?? slot.jsScrollTop
        slot.container.frame = slot.region
        slot.banner.frame.origin = CGPoint(x: slot.x - slot.region.minX,
                                           y: slot.contentY - offsetY - slot.region.minY)
    }

    private func bindScroller(_ slot: Slot, rect: CGRect?, scrollHeight: CGFloat, in root: UIScrollView) {
        guard let rect = rect else {
            slot.observation = nil
            slot.scroller = nil
            return
        }
        if let current = slot.scroller, current.window != nil, matches(current, rect, in: root) { return }

        slot.observation = nil
        var best: UIScrollView?
        findScroller(in: root, root: root, rect: rect, scrollHeight: scrollHeight, best: &best)
        slot.scroller = best
        slot.observation = best?.observe(\.contentOffset) { [weak self, weak slot] _, _ in
            guard let self = self, let slot = slot else { return }
            self.layout(slot)
        }
    }

    private func matches(_ scroller: UIScrollView, _ rect: CGRect, in root: UIScrollView) -> Bool {
        let visible = scroller.convert(scroller.bounds, to: root)
        return abs(visible.minX - rect.minX) < 2 && abs(visible.minY - rect.minY) < 2
            && abs(visible.width - rect.width) < 2 && abs(visible.height - rect.height) < 2
    }

    /// 웹의 overflow 스크롤 영역마다 WebKit이 만들어 두는 UIScrollView 중, 화면상 위치가 일치하는 것을 찾는다
    private func findScroller(in view: UIView, root: UIScrollView, rect: CGRect, scrollHeight: CGFloat, best: inout UIScrollView?) {
        for sub in view.subviews where !(sub is InlineAdContainerView) {
            if let candidate = sub as? UIScrollView, matches(candidate, rect, in: root) {
                if let current = best {
                    if abs(candidate.contentSize.height - scrollHeight) < abs(current.contentSize.height - scrollHeight) {
                        best = candidate
                    }
                } else {
                    best = candidate
                }
            }
            findScroller(in: sub, root: root, rect: rect, scrollHeight: scrollHeight, best: &best)
        }
    }

    private func remove(_ id: String) {
        guard let slot = slots.removeValue(forKey: id) else { return }
        slot.observation = nil
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
