import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { account, databases, users_collection_id,database_id } from '../appwrite';
import { ID } from 'react-native-appwrite';

export default function SignUp() {
  const router = useRouter();

  // State for form inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle signup
  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    try {
      // Creating a new user account in Appwrite
      const response = await account.create(ID.unique(), email, password);
      const userId = response.$id;
      const userData = {
        name: fullName,
        username: email,
        password: password,
        userId: userId // Fixed syntax error (comma instead of period)
      };
  
      // Store user details in the database (optional)
      await databases.createDocument(database_id, users_collection_id, ID.unique(), userData);
      await account.createEmailPasswordSession(email, password);
      console.log("User logged in");
      Alert.alert('Success', 'Successfully signed up!'); // Updated success message
      router.replace("(tabs)"); // Navigate after successful signup
    } catch (error) {
      Alert.alert('Signup Failed', error.message); // Display precise error message
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome to MedTracker</Text>
      <Text style={styles.subHeaderText}>Enter the below details to create an account</Text>

      <View style={{ marginTop: 25 }}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          placeholder='Enter your full name'
          style={styles.textInput}
          value={fullName}
          onChangeText={setFullName}
        />
      </View>
      <View style={{ marginTop: 25 }}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder='Enter your email'
          style={styles.textInput}
          keyboardType='email-address'
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={{ marginTop: 25 }}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder='Enter your password'
          style={styles.textInput}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={() => router.push('login/signIn')}>
        <Text style={styles.buttonText2}>Existing User? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 25,
    height: '100%',
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 15,
  },
  textInput: {
    padding: 10,
    borderWidth: 2,
    fontSize: 16,
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: '#f5f5f5',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#00B5E2',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 15,
    color: 'white',
  },
  button2: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  buttonText2: {
    fontSize: 16,
    textAlign: 'center',
    padding: 15,
    color: '#00B5E2',
  },
});

