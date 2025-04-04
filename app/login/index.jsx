import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";
import { account } from "../appwrite"; // Import Appwrite account service

export default function LandingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await account.get("current"); // Check if user session exists
        console.log("User Signed-in:");
        router.replace("(tabs)"); // Redirect to main app if logged in
      } catch (error) {
        console.log("User not logged in:", error.message);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00B5E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/icon.png")} 
            style={{
              height:240,
              width:240,
              alignItems:'center'
            }}
            />
      <Text style={styles.title}>Welcome to MedTracker</Text>
      <Text style={styles.label}>Stay on Track, Stay Healthy – Your Personal Medicine Reminder</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("login/signIn")}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#00B5E2",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
