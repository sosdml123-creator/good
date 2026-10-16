package com.sinsangpick.app;

import android.app.Activity;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.FrameLayout;
import androidx.annotation.NonNull;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.LoadAdError;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * 안드로이드 인라인 배너 (iOS AppDelegate.swift의 InlineAdManager와 같은 역할)
 * - 웹(admobService.ts의 trackInlineBanner)이 구좌 위치·허용 영역을 매 프레임 알려주면
 *   네이티브 AdView를 그 위치에 붙여 본문과 함께 움직이게 한다. 화면에 떠 있는 오버레이가 아님.
 * - 허용 영역(clip) 밖으로 나간 부분은 잘라내고, 모달 등에 가려지면 웹이 hide를 보낸다.
 * - 웹 좌표는 CSS px(= dp)이므로 density를 곱해 픽셀로 바꾼다.
 */
@CapacitorPlugin(name = "InlineAd")
public class InlineAdManager extends Plugin {
    private static final String TAG = "InlineAd";
    private static final int MAX_RETRIES = 3;

    private static final class Slot {
        final FrameLayout container;
        final AdView banner;
        int retries = 0;

        Slot(FrameLayout container, AdView banner) {
            this.container = container;
            this.banner = banner;
        }
    }

    private Activity activity;
    private WebView webView;
    private ViewGroup host;
    private final Map<String, Slot> slots = new HashMap<>();

    @Override
    public void load() {
        activity = getActivity();
        webView = getBridge().getWebView();
    }

    @PluginMethod
    public void postMessage(PluginCall call) {
        JSONObject msg = call.getData();
        activity.runOnUiThread(() -> {
            try {
                if (host == null) host = (ViewGroup) webView.getParent();
                if (host != null) handle(msg);
            } catch (Exception e) {
                Log.w(TAG, "bad message: " + e.getMessage());
            }
        });
        call.resolve();
    }

    private void handle(JSONObject msg) throws Exception {
        String action = msg.optString("action");
        switch (action) {
            case "update":
                update(msg);
                break;
            case "hide": {
                Slot slot = slots.get(msg.optString("slot"));
                if (slot != null) slot.container.setVisibility(View.GONE);
                break;
            }
            case "remove":
                remove(msg.optString("slot"));
                break;
            case "reset":
                for (String id : slots.keySet().toArray(new String[0])) remove(id);
                break;
            default:
                break;
        }
    }

    private void update(JSONObject msg) throws Exception {
        String id = msg.getString("slot");
        String adId = msg.getString("adId");
        JSONArray frame = msg.getJSONArray("frame");
        JSONArray clip = msg.getJSONArray("clip");

        Slot slot = slots.get(id);
        if (slot != null && !adId.equals(slot.banner.getAdUnitId())) {
            remove(id);
            slot = null;
        }
        if (slot == null) slot = create(id, adId);

        float density = activity.getResources().getDisplayMetrics().density;
        int scrollX = webView.getScrollX();
        int scrollY = webView.getScrollY();
        int originX = webView.getLeft();
        int originY = webView.getTop();

        // 허용 영역 = 컨테이너 (그 밖은 잘림)
        int clipLeft = Math.round((float) clip.getDouble(0) * density) - scrollX + originX;
        int clipTop = Math.round((float) clip.getDouble(1) * density) - scrollY + originY;
        int clipWidth = Math.round((float) clip.getDouble(2) * density);
        int clipHeight = Math.round((float) clip.getDouble(3) * density);

        FrameLayout.LayoutParams containerParams = new FrameLayout.LayoutParams(clipWidth, clipHeight);
        containerParams.leftMargin = clipLeft;
        containerParams.topMargin = clipTop;
        slot.container.setLayoutParams(containerParams);

        // 배너 위치 = 구좌 위치를 컨테이너 기준으로
        int bannerLeft = Math.round((float) frame.getDouble(0) * density) - scrollX + originX - clipLeft;
        int bannerTop = Math.round((float) frame.getDouble(1) * density) - scrollY + originY - clipTop;
        slot.banner.setTranslationX(bannerLeft);
        slot.banner.setTranslationY(bannerTop);

        slot.container.setVisibility(View.VISIBLE);
    }

    private Slot create(String id, String adId) {
        FrameLayout container = new FrameLayout(activity);
        container.setClipChildren(true);
        container.setClipToPadding(true);

        AdView banner = new AdView(activity);
        banner.setAdSize(AdSize.BANNER);
        banner.setAdUnitId(adId);
        container.addView(banner, new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT));

        // 웹뷰와 같은 부모에 웹뷰 바로 위로 추가 (웹뷰 부모는 Capacitor의 레이아웃)
        FrameLayout wrapper = new FrameLayout(activity);
        wrapper.setClipChildren(true);
        wrapper.addView(container);
        host.addView(wrapper, host.indexOfChild(webView) + 1, new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));

        Slot slot = new Slot(container, banner);
        slots.put(id, slot);
        banner.setAdListener(new AdListener() {
            @Override
            public void onAdLoaded() {
                slot.retries = 0;
                notifyWeb(id, "loaded", null);
            }

            @Override
            public void onAdFailedToLoad(@NonNull LoadAdError error) {
                Log.w(TAG, "failed to load: " + error.getMessage());
                notifyWeb(id, "failed", error.getMessage());
                // 광고가 없을 때(no fill)를 대비해 간격을 늘려가며 제한적으로 재요청
                if (slot.retries >= MAX_RETRIES) return;
                slot.retries++;
                banner.postDelayed(() -> {
                    if (slots.get(id) == slot) banner.loadAd(new AdRequest.Builder().build());
                }, 30000L * slot.retries);
            }
        });
        banner.loadAd(new AdRequest.Builder().build());
        return slot;
    }

    private void remove(String id) {
        Slot slot = slots.remove(id);
        if (slot == null) return;
        slot.banner.destroy();
        View wrapper = (View) slot.container.getParent();
        if (wrapper != null) host.removeView(wrapper);
    }

    private void notifyWeb(String id, String status, String message) {
        try {
            JSONObject detail = new JSONObject();
            detail.put("slot", id);
            detail.put("status", status);
            if (message != null) detail.put("message", message);
            webView.evaluateJavascript(
                "window.dispatchEvent(new CustomEvent('inlineAdStatus',{detail:" + detail + "}))", null);
        } catch (Exception ignored) {
        }
    }
}
