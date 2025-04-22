import { StyleSheet, View, ActivityIndicator,Text, Modal, Button, Alert,TouchableOpacity } from "react-native";
import React, { act, useCallback, useEffect, useState } from "react";
import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import MedicationList from "../../components/MedicationList";
import { account, database_id, databases, medicines_collection_id,users_collection_id,medicines_history_id } from "../../app/appwrite";
import { Query,ID, Messaging,Functions } from "react-native-appwrite";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { getMedicineName,clearMedicineName } from '../setMedicineName'
import ChatBotModal from "../../components/ChatBotModal";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const [userId, setUserId] = useState(null);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName,setUserName] = useState(null);
  const [contactName,setContactName] = useState(null)
  const [contactPhoneNumber,setContactPhoneNumber] = useState(null)
  const router = useRouter();
  const [medicineName,setMedicineName] = useState(null);
  const [visible, setVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  
  useEffect(() => {
    const checkAndShowDialog = async () => {
      const flag = await AsyncStorage.getItem("showConfirmationDialog");
      const medName = await getMedicineName();
  
      if (flag === "true" && medName) {
        setMedicineName(medName);   // show name on modal
        setVisible(true);           // show modal
        await AsyncStorage.removeItem("showConfirmationDialog"); // clear flag
        await clearMedicineName(); // optional: clear name after use
      }
    };
  
    checkAndShowDialog();
  }, []);
  
  

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
      console.log(`Fetched confirmation status for ${key}:`, value);
  
      if (value === 'true') {
        if (!contactPhoneNumber) {
          Alert.alert("No Contact Found", "Please fill in contact details in your profile.");
          return;
        }
        const formattedPhone = `+91${contactPhoneNumber}`;
        console.log(formattedPhone)
        const date = key.split("_").pop(); // Extract date from key
        const messagePayload = {
          contact_name: contactName,
          contact_phone: formattedPhone,
          medicine_name: medicineName,
          user_name: userName,
          date: date,
        };
  
        // 🔥 POST to your local Express server
        const response = await fetch("http://192.168.242.252:4000/sms-webhook", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ payload: messagePayload })
        });
  
        if (!response.ok) {
          throw new Error(`SMS webhook failed: ${response.status}`);
        }
  
        console.log("✅ SMS webhook triggered successfully.");
      }
    } catch (error) {
      console.error("❌ Error in confirmation check or SMS send:", error);
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
    const fetchUserDetails = async () => {
      if (!userId) return; // Wait until userId is set

      try {
        const response = await databases.listDocuments(
          database_id,
          users_collection_id,
          [Query.equal("userId", userId)]
        );
        setUserName(response.documents[0].name)
        setContactName(response.documents[0].contact_person_name)
        setContactPhoneNumber(response.documents[0].contact_phoneNumber)
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
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

      {/* Floating Chat Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setChatVisible(true)}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color="white" />
      </TouchableOpacity>

      {/* Chat Modal */}
      <ChatBotModal visible={chatVisible} onClose={() => setChatVisible(false)} />

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
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 25,
    backgroundColor: '#3e8ef7',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  
});
