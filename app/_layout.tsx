import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [showLoading, setShowLoading] = React.useState(true);

  useEffect(() => {
    // Show loading screen for at least 2 seconds for the animation to be seen
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);
  const [loaded] = useFonts({
    Ionicons: Platform.OS === 'web' 
      ? new URL('/Planned-Eat-Web/fonts/Ionicons.ttf', 'https://senior-project-2026.github.io').toString()
      : require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    MaterialCommunityIcons: Platform.OS === 'web'
      ? new URL('/Planned-Eat-Web/fonts/MaterialCommunityIcons.ttf', 'https://senior-project-2026.github.io').toString()
      : require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
    MaterialIcons: Platform.OS === 'web'
      ? new URL('/Planned-Eat-Web/fonts/MaterialIcons.ttf', 'https://senior-project-2026.github.io').toString()
      : require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Fallback: Force hide splash screen after 2 seconds to prevent hanging
  useEffect(() => {
    const timeout = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  // Removed blocking check to allow app to render even if fonts fail
  // if (!loaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Show Loading Screen until timeout */}
      {showLoading && <LoadingScreen />}
      
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
