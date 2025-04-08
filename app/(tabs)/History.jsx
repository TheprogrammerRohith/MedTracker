import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { database_id,medicines_history_id,account,databases } from '../appwrite'
import { Query } from 'react-native-appwrite';

export default function History() {
  const [userId, setUserId] = useState(null);
  const [medications,setMedications] = useState([]);
  const [loading,setLoading] = useState(true);

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

  useEffect(() => {
    const fetchMedications = async () => {
      if (!userId) return;
  
      try {
        const response = await databases.listDocuments(
          database_id,
          medicines_history_id,
          [Query.equal("userId", userId)]
        );
        const cleanedMeds = response.documents.map(({ 
          $id, $collectionId, $createdAt, $databaseId, 
          $permissions, $updatedAt, ...medData 
        }) => medData);
  
        setMedications(cleanedMeds);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMedications();
  }, [userId]);
  
  const getMedicineImage = (type) => {
    switch (type.toLowerCase()) {
      case 'tablet':
        return require('../../assets/images/medicine.png');
      case 'syrup':
        return require('../../assets/images/cough-syrup.png');
      case 'drops':
        return require('../../assets/images/eye-drops.png');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Previous Medication</Text>  
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 40 }} />
      ) : medications.length === 0 ? (
        <>
          <Image
            source={require('../../assets/images/history.png')}
            style={styles.image}
          />
          <Text style={styles.subtext}>
            Once your medication is completed, you can view the details in your history.
          </Text>
        </>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Image
                  source={getMedicineImage(item.medicine_type)}
                  style={styles.icon}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.medName}>
                    {item.medicine_name} <Text style={styles.type}>({item.medicine_type})</Text>
                  </Text>
                  <Text style={styles.detail}>
                    🦠 Disease: <Text style={styles.info}>{item.disease_name}</Text>
                  </Text>
                  <View style={styles.detailRow}>
                    <Image
                      source={require('../../assets/images/schedule.png')}
                      style={styles.iconSmall}
                    />
                    <Text style={styles.detail}>
                      Duration: <Text style={styles.info}>{item.start_date} → {item.end_date}</Text>
                    </Text>
                  </View>
                  <Text style={styles.detail}>
                    💡 Dosage: <Text style={styles.info}>{item.medicine_dosage}</Text>
                  </Text>
                  <Text style={styles.detail}>
                    ⏰ Timings: <Text style={styles.info}>{item.timings.join(', ')}</Text>
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
  
  
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    flex: 1,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
    alignSelf: 'center',
  },
  image: {
    marginTop: 30,
    width: 140,
    height: 140,
    alignSelf: 'center',
  },
  subtext: {
    fontSize: 16,
    marginTop: 24,
    textAlign: 'center',
    color: '#666',
  },
  card: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  medName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  type: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
  detail: {
    fontSize: 16,
    color: '#374151',
    marginVertical: 2,
  },
  info: {
    fontWeight: '500',
    color: '#2563EB',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    width: 48,
    height: 48,
    marginRight: 12,
    resizeMode: 'contain',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  iconSmall: {
    width: 18,
    height: 20,
    marginRight: 6,
    resizeMode: 'contain',
  },
  
});

