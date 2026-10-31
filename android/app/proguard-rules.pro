# Capacitor 플러그인 keep 규칙은 capacitor-android의 consumerProguardFiles로 자동 적용됩니다.

# 크래시 스택 트레이스 줄 번호 유지 (원본 파일명은 숨김)
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# WebView JS 브리지 (Capacitor MessageHandler 등)
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# 앱 커스텀 플러그인 (JS에서 이름으로 호출)
-keep class com.sinsangpick.app.InlineAdManager { *; }
