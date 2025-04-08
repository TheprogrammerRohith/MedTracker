import { StyleSheet, View, ActivityIndicator,Text, Modal, Button, Alert } from "react-native";
import React, { act, useEffect, useState } from "react";
import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import MedicationList from "../../components/MedicationList";
import { account, database_id, databases, medicines_collection_id,users_collection_id,medicines_history_id } from "../../app/appwrite";
import { Query,ID } from "react-native-appwrite";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

export default function Home() {
  const [userId, setUserId] = useState(null);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName,setUserName] = useState(null);
  const router = useRouter();
  const { medicineName } = useLocalSearchParams();
  const [visible, setVisible] = useState(!!medicineName);

  useEffect(() => {
    if (medicineName) setVisible(true);
  }, [medicineName]);

  const handleConfirm = async () => {
    if(medicineName){
      const key = `confirmed_${medicineName}_${new Date().toISOString().split('T')[0]}`;
      await AsyncStorage.setItem(key, 'true');
      Alert.alert("✅ Confirmed", `You marked "${medicineName}" as taken today.`);
      setVisible(false);

      fetchConfirmationStatus(key);
    }
    
  };

  const fetchConfirmationStatus = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      console.log(`📦 Fetched confirmation status for ${key}:`, value); // should log 'true'
    } catch (error) {
      console.error("❌ Error fetching confirmation status:", error);
    }
  };


  // Fetch user ID first
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get(); // Get authenticated user
        setUserId(user.$id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // Fetch medications only after userId is available
  useEffect(() => {
    const fetchMedications = async () => {
      if (!userId) return;
    
      try {
        const response = await databases.listDocuments(
          database_id,
          medicines_collection_id,
          [Query.equal("userId", userId)]
        );
    
        const allMeds = response.documents;
        const currentDate = new Date();
    
        const activeMeds = [];
        const expiredMeds = [];
    
        for (const med of allMeds) {
          const medEndDate = new Date(med.end_date);
          if (medEndDate < currentDate) {
            expiredMeds.push(med);
        
            // Create a clean object without system fields
            const {
              $id, $collectionId, $createdAt, $databaseId,
              $permissions, $updatedAt, ...medData
            } = med;
        
            try {
              // Add to history
              await databases.createDocument(
                database_id,
                medicines_history_id,
                ID.unique(),
                medData 
              );
        
              // Delete from original collection
              await databases.deleteDocument(
                database_id,
                medicines_collection_id,
                $id
              );
            } catch (err) {
              console.error("Error moving to history:", err);
            }
          } else {
            activeMeds.push(med);
          }
        }
        setMedications(activeMeds)
      } catch (error) {
        console.error("Error fetching medications:", error);
      } finally {
        setLoading(false);
        }      
    };
    fetchMedications();
  }, [userId]); // Run when userId is updated

  useEffect(() => {
    const fetchUserName = async () => {
      if (!userId) return; // Wait until userId is set

      try {
        const response = await databases.listDocuments(
          database_id,
          users_collection_id,
          [Query.equal("userId", userId)]
        );
        setUserName(response.documents[0].name)
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, [userId]);
  
  
  return (
    <View style={styles.container}>
      <Header userName={userName} />
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00B5E2" />
        </View>
      ) : (
        medications.length > 0 ? <MedicationList /> : <EmptyState />
      )}      

      <Modal visible={visible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#00000088', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 12, width: '80%' }}>
            <Text style={{ fontSize: 18 }}>Did you take your medicine?</Text>
            <Text style={{ fontSize: 22, marginVertical: 10 }}>{medicineName}</Text>
            <View style={{ marginTop: 15 }}>
              <View style={{ marginBottom: 10 }}>
                <Button title="✅ Yes, I took it" onPress={handleConfirm} />
              </View>
              <Button title="Dismiss" color="grey" onPress={() => setVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>

    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
