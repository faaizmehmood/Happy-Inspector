export default{
  "expo": {
    "name": "happy-inspector",
    "slug": "happy-inspector",
  "platforms": ["ios", "android", "web"],
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "version": "1.0.0",
    "newArchEnabled": true,
    "orientation": "portrait",
    "icon": "./assets/splash.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.bilalniazi281297.happyinspector"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png", 
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "android.permission.RECORD_AUDIO"
      ],
      "package": "com.bilalniazi281297.happyinspector",
      // "googleServicesFile": process.env.GOOGLE_SERVICE_JSON
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "@react-native-google-signin/google-signin",
      
      "expo-font",
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to let you share them with your friends."
        }
      ],
      "expo-secure-store"
    ],
    "extra": {
      "eas": {
        "projectId": "e025f278-1ce2-45b6-84d8-c4b2d87da0fc"
      }
    },
    "scheme": "happy-inspector",
    "owner": "bilalniazi281297"
  }
}
