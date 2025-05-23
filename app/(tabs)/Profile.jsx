import { StyleSheet, Text, View, Image, TouchableOpacity, Alert,TextInput, Button, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { account, databases, database_id, users_collection_id,medicines_collection_id } from "../appwrite";
import { Query } from "react-native-appwrite";
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [userId,setUserId] = useState();
  const [docId,setDocId] = useState();
  const [showContactForm, setShowContactForm] = useState(false);
  const [showMedications, setShowMedications] = useState(false);
  const [contactName, setContactName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Fetch logged-in user session
        const userSession = await account.get();
        const userId = userSession.$id;
        setUserId(userId);
        const response = await databases.listDocuments(database_id, users_collection_id, [
          Query.equal("userId", userId)
        ]);

        if (response.documents.length > 0) {
          setDocId(response.documents[0].$id)
          setUserData(response.documents[0]); // Store user data
        } else {
          Alert.alert("Error", "User data not found.");
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      }
    };

    fetchUserDetails();
  }, []);
  useEffect(() => {
    if (userData) {
      setContactName(userData.contact_person_name || '');
      setRelationship(userData.contact_relation || '');
      setContactPhone(userData.contact_phoneNumber || '');
    }
  }, [userData]);

  const fetchMedications = async () => {
    if (!userId) return;
  
    try {
      const response = await databases.listDocuments(
        database_id,
        medicines_collection_id,
        [Query.equal("userId", userId)]
      );
  
      const cleanedMeds = response.documents.map(
        ({$collectionId, $createdAt, $databaseId, $permissions, $updatedAt, ...medData }) => medData
      );
      setMedicines(cleanedMeds);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (userId) {
      fetchMedications(); // automatic on load
    }
  }, [userId]);


  const handleLogout = async () => {
    try {
      await account.deleteSession("current"); // Logs out the user
      Alert.alert("Logged Out", "You have been successfully logged out.");
      router.replace("login/signIn"); // Navigate to login page
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!docId || !contactName || !contactPhone || !relationship) {
        Alert.alert("Error", "Please fill in all required fields.");
        return;
      }

      await databases.updateDocument(database_id, users_collection_id, docId, {
        contact_person_name: contactName,
        contact_relation: relationship,
        contact_phoneNumber: contactPhone
      });

      Alert.alert("Success", "Contact details updated!");
      setShowContactForm(false); // Hide form after success
    } catch (error) {
      console.error("Update failed", error);
      Alert.alert("Error", "Failed to update contact details.");
    }
  };

  const handleDeleteMedication = async (medId) => {
    try {
      await databases.deleteDocument(database_id, medicines_collection_id, medId);
      // Refresh medications list
      setMedicines(prev => prev.filter(med => med.$id !== medId));
    } catch (error) {
      console.error("Error deleting medication:", error);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require("../../assets/images/profile.png")}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{userData ? userData.name : "Loading..."}</Text>
        <Text style={styles.userEmail}>{userData ? userData.username : "Loading..."}</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => setShowContactForm(true)}>
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setShowMedications(!showMedications)}>
          <Text style={styles.menuText}>View Medications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
          <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
      {showContactForm && (
        <View style={styles.contactFormContainer}>
        <TouchableOpacity onPress={() => setShowContactForm(false)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          <TouchableOpacity onPress={() => setIsEditing(prev => !prev)}>
            <Ionicons name={isEditing ? "close" : "create-outline"} size={22} color="#007BFF" />
          </TouchableOpacity>
        </View>
      
        <TextInput
          placeholder="Name of contact person"
          style={styles.input}
          value={contactName}
          editable={isEditing}
          onChangeText={setContactName}
        />
        <TextInput
          placeholder="Relationship"
          style={styles.input}
          value={relationship}
          editable={isEditing}
          onChangeText={setRelationship}
        />
        <TextInput
          placeholder="Phone number"
          keyboardType="phone-pad"
          style={styles.input}
          value={contactPhone}
          editable={isEditing}
          onChangeText={setContactPhone}
        />
      
        {isEditing && (
          <Button
            title="Save Contact Details"
            onPress={handleSubmit}
          />
        )}
      </View>
    )}
    {showMedications && (
      <View style={styles.medicationList}>
        <TouchableOpacity onPress={() => setShowMedications(false)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {medicines.length === 0 ? (
          <Text style={styles.emptyText}>No medications added yet.</Text>
        ) : (
          medicines.map((med, index) => (
            <View key={index} style={styles.medCard}>
              <Text style={styles.diseaseName}>{med.disease_name}</Text>
              <Text style={styles.medName}>{med.medicine_name}</Text>
              <Text>{med.medicine_type} - {med.medicine_dosage}</Text>
              <Text>Start: {med.start_date} | End: {med.end_date}</Text>
              <Text>Timings: {med.timings.join(", ")}</Text>
                <View style={styles.cardButtons}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteMedication(med.$id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    )}


    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "white",
    paddingBottom:100
  },  
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: 40,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  menuContainer: {
    width: "90%",
  },
  menuItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  menuText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
  },
  logoutText: {
    color: "white",
  },
  contactFormContainer: {
    width: "90%",
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  medicationList: {
    width: "90%",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  medCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  diseaseName: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 4,
  },
  medName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  emptyText: {
    fontStyle: "italic",
    color: "#888",
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#00b5e2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  
  
});
