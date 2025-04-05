import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";
import { account } from "../appwrite";

export default function LandingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await account.get(); // Check current session
        setIsLoggedIn(true);
        router.replace("(tabs)"); // Redirect if logged in
      } catch (error) {
        console.log("User not logged in:", error.message);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/icon.png")}
        style={{ height: 240, width: 240 }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#00B5E2" style={{ marginTop: 20 }} />
      ) : !isLoggedIn ? (
        <>
          <Text style={styles.title}>Welcome to MedTracker</Text>
          <Text style={styles.label}>
            Stay on Track, Stay Healthy – Your Personal Medicine Reminder
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push("login/signIn")}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#444",
  },
  button: {
    backgroundColor: "#00B5E2",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
