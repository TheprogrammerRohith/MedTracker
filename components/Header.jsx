import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Header() {
  const router = useRouter()
  return (
    <View style={{marginTop:5,padding:25}}>
        <View
        style={{
            display:'flex',
            flexDirection:'row',
            gap:15,
            alignItems:'center'
        }}
        >
            <Text style={{fontSize:25,fontWeight:'bold'}}>Hello User Name</Text>
            <Image source={require('./../assets/images/wave.png')}
            style={{
                width:40,
                height:40
            }}
            />
            <TouchableOpacity
            onPress={() => router.push('/add-new-medication')}
            >
              <Ionicons name="medkit-outline" size={32} color="black" style={{marginLeft:50}}/>
              
            </TouchableOpacity>
            
        </View>
    </View>
    
  )
}

const styles = StyleSheet.create({})