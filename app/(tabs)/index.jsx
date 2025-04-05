import { StyleSheet, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import EmptyState from "../../components/EmptyState";
import MedicationList from "../../components/MedicationList";
import { account, database_id, databases, medicines_collection_id,users_collection_id } from "../../app/appwrite";
import { Query } from "react-native-appwrite";

export default function Home() {
  const [userId, setUserId] = useState(null);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName,setUserName] = useState(null);

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
      if (!userId) return; // Wait until userId is set

      try {
        const response = await databases.listDocuments(
          database_id,
          medicines_collection_id,
          [Query.equal("userId", userId)]
        );
        setMedications(response.documents);
        console.log(response.documents);
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
