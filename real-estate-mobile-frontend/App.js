import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontProvider } from "./src/lib/FontContext";
import { AuthProvider } from "./src/lib/AuthContext";
import { UserDataProvider } from "./src/lib/userContext";
import { LoaderProvider } from "./src/lib/loaderContext";
import MainNavigator from "./src/screens/navigation/MainNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RoomProvider } from "./src/lib/RoomImageContext";
import { ToastProvider } from "react-native-toast-notifications";

export default function App() {
  return (
    <ToastProvider>
      <GestureHandlerRootView>
        <RoomProvider>
          <FontProvider>
            <PaperProvider>
              <SafeAreaProvider>
                <StatusBar style="auto" backgroundColor="white" />
                <SafeAreaView style={{ flex: 1 }}>
                  <AuthProvider>
                    <UserDataProvider>
                      <LoaderProvider>
                        <MainNavigator />
                      </LoaderProvider>
                    </UserDataProvider>
                  </AuthProvider>
                </SafeAreaView>
              </SafeAreaProvider>
            </PaperProvider>
          </FontProvider>
        </RoomProvider>
      </GestureHandlerRootView>
    </ToastProvider>
  );
}
