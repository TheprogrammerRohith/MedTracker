import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;

      if (data?.medicineName) {
        // Navigate to a confirm screen with medicineName
        router.push({
          pathname: '/confirm',
          params: { medicineName: data.medicineName },
        });
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(tabs)" />
      {/* Optionally register confirm screen if not in (tabs) */}
      <Stack.Screen name="confirm" />
    </Stack>
  );
}
