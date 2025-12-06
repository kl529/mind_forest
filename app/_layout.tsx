import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { SupabaseService } from '@/services/supabaseService';
import { ThemedText } from '@/components/ThemedText';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check auth immediately, don't wait for fonts on web
    checkAuth();
  }, []);

  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error);
    }
  }, [error]);

  // Handle navigation based on auth state
  useEffect(() => {
    if (isAuthenticated === null) return; // Still loading

    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      // Not authenticated and not on auth screen -> redirect to auth
      router.replace('/auth');
    } else if (isAuthenticated && inAuthGroup) {
      // Authenticated but on auth screen -> redirect to home
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  const checkAuth = async () => {
    const authed = await SupabaseService.isAuthenticated();
    setIsAuthenticated(authed);
  };

  // Only wait for auth check, not fonts (fonts can load in background)
  if (isAuthenticated === null) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#000' : '#fff' }}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
