import { View, Text, Button, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfirmMedicine() {
  const { medicineName } = useLocalSearchParams();

  const handleConfirm = async () => {
    try {
      const key = `confirmed_${medicineName}_${new Date().toISOString().split('T')[0]}`; // unique per day
      await AsyncStorage.setItem(key, 'true');

      Alert.alert("✅ Confirmed", `You marked "${medicineName}" as taken today.`);
    } catch (error) {
      console.error("Error saving confirmation:", error);
      Alert.alert("Error", "Failed to save your confirmation.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18 }}>Did you take your medicine?</Text>
      <Text style={{ fontSize: 22, marginVertical: 10 }}>{medicineName}</Text>
      <Button title="Yes, I took it ✅" onPress={handleConfirm} />
    </View>
  );
}
