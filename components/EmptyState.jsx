import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

export default function EmptyState() {
    const router = new useRouter();
  return (
    <View
    style={{
        marginTop:5,
        padding:25,
        display:'flex',
        alignItems:'center'
    }}
    >
      <Image source={require("./../assets/images/pills.png")} 
      style={{
        width:120,
        height:120
      }}
      />
      <Text
      style={{
        fontSize:30,
        marginTop:20,
        fontWeight:'bold',
      }}>No Medications!</Text>
      <Text style={{fontSize:16}}>Kindly setup your medications, to keep posted</Text>

      <TouchableOpacity style={styles.button}
      onPress={() => router.push('/add-new-medication')}>
        <Text style={{
            fontSize:18,
            textAlign:'center',
            padding:15,
            color:'white'
        }}>+ Add new Medication</Text>
    </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
    button:{
        marginTop:20,
        backgroundColor: '#00B5E2',
        borderRadius:10,
        width:'100%'
    },
})