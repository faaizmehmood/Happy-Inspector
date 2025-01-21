import React, { createContext, useContext, useState, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Font from 'expo-font';
import { Entypo } from '@expo/vector-icons'; // Import Entypo for icon fonts
import {
  useFonts,
  PlusJakartaSans_200ExtraLight,
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";

const FontContext = createContext();

export function FontProvider({ children }) {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_200ExtraLight,
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const [entypoLoaded, setEntypoLoaded] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {

        await Font.loadAsync(Entypo.font);
        setEntypoLoaded(true);

        if (fontsLoaded && entypoLoaded) {
          setAppIsReady(true);
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fontsLoaded, entypoLoaded]);

  return (
    <FontContext.Provider value={{ fontsLoaded, entypoLoaded, appIsReady }}>
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  return useContext(FontContext);
}
