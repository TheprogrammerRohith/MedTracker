import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { setMedicineName } from './setMedicineName';
import AsyncStorage from '@react-native-async-storage/async-storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();
      const data = response?.notification?.request?.content?.data;

      if (data?.medicineName) {
        await setMedicineName(data.medicineName);
        await AsyncStorage.setItem("showConfirmationDialog", "true"); // 👈 Flag set
        
      }
    };

    checkInitialNotification();

    const receiveSub = Notifications.addNotificationReceivedListener(async (notification) => {
      const data = notification.request.content.data;
      if (data?.medicineName) {
        await setMedicineName(data.medicineName); // Only stores name
        // ❌ Do not set dialog flag here
      }
    });

    const responseSub = Notifications.addNotificationResponseReceivedListener(async (response) => {
      const data = response.notification.request.content.data;
      if (data?.medicineName) {
        await setMedicineName(data.medicineName); // optional: save again
        await AsyncStorage.setItem("showConfirmationDialog", "true"); // set flag
        router.push('/(tabs)');
      }
    });

    return () => {
      receiveSub.remove();
      responseSub.remove();
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
