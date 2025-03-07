import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import EmptyState from '../../components/EmptyState'
import MedicationList from '../../components/MedicationList'

export default function Home() {
  return (
    <View style={{
      backgroundColor: 'white',
      height:'100%',
      flex:1
    }}>
    <Header/>
    {/* <EmptyState/> */}
    <MedicationList />
    </View>
  )
}

const styles = StyleSheet.create({})