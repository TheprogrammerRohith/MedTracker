import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Header({userName}) {
  const router = useRouter()
  return (
    <View style={{ marginTop: 5, padding: 25 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between', // evenly space elements
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold' }}>
            Hello {userName || 'UserName'}
          </Text>
          <Image
            source={require('./../assets/images/wave.png')}
            style={{ width: 40, height: 40 }}
          />
        </View>

        <TouchableOpacity onPress={() => router.push('/add-new-medication')}>
          <Ionicons name="medkit-outline" size={32} color="black" />
        </TouchableOpacity>
      </View>
    </View>  
  )
}

const styles = StyleSheet.create({})