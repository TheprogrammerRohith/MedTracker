import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { account } from '../appwrite'; // Import Appwrite account service

export default function SignIn() {
  const router = useRouter();

  // State for storing email & password input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Appwrite authentication
      await account.createEmailPasswordSession(email, password);

      Alert.alert('Success', 'Login successful!');
      router.replace("(tabs)"); // Navigate to main app screen
    } catch (error) {
      Alert.alert('Login Failed', error.message); // Show precise error message
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome Back to MedTracker</Text>
      <Text style={styles.subHeaderText}>Enter your email and password to sign in</Text>

      <View style={{ marginTop: 25 }}>
        <Text style={{ fontSize: 15 }}>Email</Text>
        <TextInput 
          placeholder="Enter your email" 
          style={styles.textInput} 
          value={email}
          onChangeText={setEmail} // Capture input
        />
      </View>
      <View style={{ marginTop: 25 }}>
        <Text style={{ fontSize: 15 }}>Password</Text>
        <TextInput 
          placeholder="Enter your password" 
          style={styles.textInput} 
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword} // Capture input
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={() => router.push('login/signUp')}>
        <Text style={styles.buttonText2}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    height: '100%',
    backgroundColor: 'white'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  subHeaderText: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: 'bold'
  },
  textInput: {
    padding: 10,
    borderWidth: 2,
    fontSize: 16,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: '#f5f5f5'
  },
  button: {
    marginTop: 20,
    backgroundColor: '#00B5E2',
    borderRadius: 10
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 15,
    color: 'white'
  },
  button2: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10
  },
  buttonText2: {
    fontSize: 16,
    textAlign: 'center',
    padding: 15,
    color: '#00B5E2'
  }
});
