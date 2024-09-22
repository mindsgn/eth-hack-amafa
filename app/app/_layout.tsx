import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { AssetProvider } from '@/context/assetContext';
import { AuthProvider } from '@/context/authContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const width = Dimensions.get("window").width
const height = Dimensions.get("window").height

export default function Layout() {
  const [loaded, error] = useFonts({
    'SF-Bold': require('../assets/fonts/SF-Bold.otf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      width,
      height
    }}>
      <AuthProvider>
        <AssetProvider>
          <Stack
            initialRouteName="index"
            screenOptions={{
              headerShown: false
            }}
          >
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }}/>
          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="camera"
            options={{
              presentation: 'modal',
            }}
          />
          </Stack>
        </AssetProvider>
      </AuthProvider>
    </SafeAreaView>
  );
}
