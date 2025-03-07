import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function AddMedicationHeader() {
    const router = useRouter();
  return (
    <View>
        <View
    style={{
        display:'flex',
        alignItems:'center',
        marginTop:5
    }}
    >
      <Image source={require("./../assets/images/prescription.png")} 
      style={{
        height:240,
        width:240,
        alignItems:'center'
      }}
      />
      </View>

      <TouchableOpacity
      style={{
        position:'absolute'
      }}
      onPress={() => router.back()}
      >
      <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
    
    </View>
    
      
  )
}

const styles = StyleSheet.create({})