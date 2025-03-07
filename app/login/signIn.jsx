import { StyleSheet, Text, View,TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'


export default function signIn() {
  const router = useRouter();
  return (
    <View style={{
        padding:25,
        height:'100%',
        backgroundColor:'white'
    }}>
      <Text style={styles.headerText}>Welcome Back to MedTracker</Text>
      <Text style={styles.subHeaderText}>Enter Your user name and password to SignIn</Text>

      <View style={{marginTop:25}}>
        <Text style={{fontSize:15}}>Email</Text>
        <TextInput placeholder='Enter your email' style={styles.textInput}/>
      </View>
      <View style={{marginTop:25}}>
        <Text style={{fontSize:15}}>Password</Text>
        <TextInput placeholder='Enter your password' style={styles.textInput} secureTextEntry={true}/>
      </View>

      <TouchableOpacity style={styles.button}
      onPress={() => router.replace("(tabs)")}>
        <Text style={{
            fontSize:16,
            textAlign:'center',
            padding:15,
            color:'white'
        }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2}
      onPress={() => router.push('login/signUp')}
      >
        <Text style={{
            fontSize:16,
            textAlign:'center',
            padding:15,
            color:'#00B5E2'
        }}>Create an account</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
    headerText:{
        fontSize:24,
        fontWeight:'bold'
    },
    subHeaderText:{
        fontSize:18,
        marginTop:5,
        fontWeight:'bold'
    },
    textInput:{
        padding:10,
        borderWidth:2,
        fontSize:16,
        borderRadius:10,
        marginTop:5,
        backgroundColor:'#f5f5f5'
    },
    button:{
        marginTop:20,
        backgroundColor: '#00B5E2',
        borderRadius:10
    },
    button2:{
        marginTop:20,
        backgroundColor: '#fff',
        borderRadius:10
    }
})