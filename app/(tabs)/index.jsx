import { StyleSheet, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import MedicationList from "../../components/MedicationList";
import { account, database_id, databases, medicines_collection_id,users_collection_id,medicines_history_id } from "../../app/appwrite";
import { Query,ID } from "react-native-appwrite";
import { useRouter } from "expo-router";

export default function Home() {
  const [userId, setUserId] = useState(null);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName,setUserName] = useState(null);
  const router = useRouter();

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
        
    
        setMedications(activeMeds);
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
