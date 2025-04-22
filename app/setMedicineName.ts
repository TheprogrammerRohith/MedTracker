import AsyncStorage from '@react-native-async-storage/async-storage';

const key = 'medicineName_key';

export async function setMedicineName(name: string) {
  console.log("Medicine stored in Async Storage :",name)
  await AsyncStorage.setItem(key, name);
}

export async function getMedicineName(): Promise<string | null> {
  return await AsyncStorage.getItem(key);
}

export async function clearMedicineName() {
  console.log("Medicine is removed from Async Storage")
  await AsyncStorage.removeItem(key);
}
