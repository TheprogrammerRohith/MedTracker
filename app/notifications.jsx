// utils/notifications.js

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIF_PERMISSION_KEY = 'notification_permission_granted';

export async function requestNotificationPermission() {
  const permissionGranted = await AsyncStorage.getItem(NOTIF_PERMISSION_KEY);

  if (permissionGranted === 'true') {
    // Permission already granted, no need to ask again
    return true;
  }

  const { status } = await Notifications.requestPermissionsAsync();

  if (status === 'granted') {
    await AsyncStorage.setItem(NOTIF_PERMISSION_KEY, 'true');
    return true;
  } else {
    alert('Notification permissions not granted!');
    return false;
  }
}

export async function scheduleMedicineAlert(medName, triggerDate) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Medicine Reminder",
      body: `Time to take your medicine: ${medName}`,
      data: {
        medicineName, // Add more if needed
      },
      sound: true,
    },
    trigger: {
      type: 'timestamp',
      timestamp: triggerDate.getTime(),
    },
  });
}


