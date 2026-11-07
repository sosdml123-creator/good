# Capacitor 코어·플러그인은 JS 호출 시 리플렉션으로 연결됩니다. R8이 이 내부 연결을 바꾸면
# 앱 시작 직후 PushNotifications.checkPermissions 에서 NPE(bridge=null)로 앱이 종료됩니다 (1.0.12~1.0.13 크래시).
# 그래서 Capacitor 패키지는 축소·난독화에서 제외합니다. 앱 자체 코드는 그대로 난독화됩니다.
-keepattributes *Annotation*
-keep class com.getcapacitor.** { *; }
-keep class com.capacitorjs.** { *; }
-keep class com.getcapacitor.community.** { *; }

# 크래시 스택 트레이스 줄 번호 유지 (원본 파일명은 숨김)
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# WebView JS 브리지 (Capacitor MessageHandler 등)
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# 앱 커스텀 플러그인 (JS에서 이름으로 호출)
-keep class com.sinsangpick.app.InlineAdManager { *; }
