import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/Colors';
import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { YoungSerif_400Regular } from '@expo-google-fonts/young-serif';
import { StoriesDatabaseProvider } from '../db/DatabaseProvider';
import { useSeedOnFirstLaunch } from '../hooks/useSeedOnFirstLaunch';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.text,
    border: Colors.surface,
    primary: Colors.primary,
  },
};

function RootLayoutInner() {
  const { isReady } = useSeedOnFirstLaunch();

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ThemeProvider value={MyDarkTheme}>
      <View style={{ flex: 1, backgroundColor: Colors.background }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" />
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: Inter_400Regular,
    InterSemiBold: Inter_600SemiBold,
    YoungSerif: YoungSerif_400Regular,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <StoriesDatabaseProvider>
      <RootLayoutInner />
    </StoriesDatabaseProvider>
  );
}