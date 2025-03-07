import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";


export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MedTracker</Text>
    
        <Text style={styles.label}>Stay on Track, Stay Healthy – Your Personal Medicine Reminder</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('login/signIn')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

    </View>
  );
};

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
  label:{
    fontSize: 20,
    marginBottom: 10,
    textAlign:'center'
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

