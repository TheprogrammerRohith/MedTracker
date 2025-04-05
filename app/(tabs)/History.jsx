import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function History() {
  return (
    <View style={{
      backgroundColor: 'white',
      padding:20,
      height:'100%',
      alignItems:'center',
      flex:1
    }}
    >
      <Text style={{fontSize:20,
        marginTop:20,
        fontWeight:'bold',}}>Your Previous Medication</Text>
      <Image source={require('../../assets/images/history.png')} 
      style={{
        marginTop:20,
        width:120,
        height:120,
        marginLeft:20,
      }}/>      
        <Text style={{
          fontSize:16,
          marginTop:24,
          textAlign:'center',
          }}>
          Once your medication is completed, you can view the details in your history.</Text>
    </View>
  )
}

const styles = StyleSheet.create({})