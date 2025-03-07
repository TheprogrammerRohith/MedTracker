import { StyleSheet, Text, View,ScrollView } from 'react-native'
import React from 'react'
import AddMedicationHeader from '../../components/AddMedicationHeader'
import AddMedicaitonForm from '../../components/AddMedicaitonForm'


export default function index() {
  return (
    <ScrollView style={{paddingBottom: 20}}>
      <View
      style={{
          padding:25,
          height:'100%',
          backgroundColor:'white'
      }}>
        <AddMedicationHeader/>
        <AddMedicaitonForm />
    </View>
    </ScrollView>
    
  )
}

const styles = StyleSheet.create({})