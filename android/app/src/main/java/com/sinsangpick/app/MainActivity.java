package com.sinsangpick.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;
import com.google.android.gms.ads.MobileAds;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(InlineAdManager.class);
        super.onCreate(savedInstanceState);
        fitContentBetweenSystemBars();
        if (getBridge() != null && getBridge().getWebView() != null) {
            MobileAds.registerWebView(getBridge().getWebView());
        }
    }

    /**
     * Android 15+(targetSdk 35+)는 앱을 상태바·내비게이션바 밑까지 강제로 그리므로(edge-to-edge),
     * 모든 버전에서 같은 방식으로 웹뷰를 상태바 아래 ~ 내비게이션바(또는 키보드) 위에 배치합니다.
     * 광고 배너도 같은 컨테이너 안에 붙으므로 함께 내려갑니다.
     */
    private void fitContentBetweenSystemBars() {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        getWindow().setStatusBarColor(Color.TRANSPARENT);
        getWindow().setNavigationBarColor(Color.TRANSPARENT);
        getWindow().getDecorView().setBackgroundColor(Color.WHITE);

        WindowInsetsControllerCompat controller =
            WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controller.setAppearanceLightStatusBars(true);
        controller.setAppearanceLightNavigationBars(true);

        View content = findViewById(android.R.id.content);
        ViewCompat.setOnApplyWindowInsetsListener(content, (v, windowInsets) -> {
            Insets bars = windowInsets.getInsets(
                WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout());
            Insets ime = windowInsets.getInsets(WindowInsetsCompat.Type.ime());
            v.setPadding(bars.left, bars.top, bars.right, Math.max(bars.bottom, ime.bottom));
            return WindowInsetsCompat.CONSUMED;
        });
    }
}
