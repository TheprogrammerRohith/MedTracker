import React, { useEffect,useCallback } from "react";
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function MedicineList({ Medicines, refreshMedicines, loading }) {
  useFocusEffect(
    useCallback(() => {
      refreshMedicines();
    }, [refreshMedicines])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Loading medicines...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ flex: 1, width: '100%', marginTop: -400 }}
      contentContainerStyle={{ paddingBottom: 80 }}
      data={Medicines}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <Text style={styles.noMedsText}>No medicines for this day</Text>
      }
      renderItem={({ item }) => {
        const { timeText, timeImage } = getTimeDetails(item.timings);

        return (
          <View style={styles.card}>
            <View style={styles.rowContainer}>
              {/* Medicine Details */}
              <View style={styles.detailsContainer}>
                <Text style={styles.diseaseName}>{item.disease_name}</Text>
                <Text style={styles.medicineName}>{item.medicine_name}</Text>
                <Text style={styles.detailText}>Dosage: {item.medicine_dosage}</Text>
                <Text style={styles.detailText}>Timing:</Text>
                <View style={{ flexDirection: 'row', gap: 15 }}>
                  {item.timings.includes('morning') && (
                    <View style={styles.iconLabel}>
                      <Image
                        source={require('./../assets/images/morning_icon.png')}
                        style={styles.image}
                      />
                      <Text style={styles.label}>Morning</Text>
                    </View>
                  )}
                  {item.timings.includes('afternoon') && (
                    <View style={styles.iconLabel}>
                      <Image
                        source={require('./../assets/images/afternoon.png')}
                        style={styles.image}
                      />
                      <Text style={styles.label}>Afternoon</Text>
                    </View>
                  )}
                  {item.timings.includes('night') && (
                    <View style={styles.iconLabel}>
                      <Image
                        source={require('./../assets/images/cloudy-night.png')}
                        style={styles.image}
                      />
                      <Text style={styles.label}>Night</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Time Image */}
              {timeImage && (
                <View style={styles.timeContainer}>
                  <Image source={timeImage} style={styles.timeImage} />
                  <Text style={styles.timeText}>{timeText}</Text>
                </View>
              )}
            </View>
          </View>
        );
      }}
    />
  );
}

// Function to determine the time text and image based on the current time
const getTimeDetails = (timings) => {
  const currentHour = new Date().getHours();
  let timeText = "";
  let timeImage = null;

  if (timings.includes("morning") && currentHour >= 6 && currentHour < 12) {
    timeText = "8 to 9 AM";
    timeImage = require("./../assets/images/time.png");
  } else if (timings.includes("afternoon") && currentHour >= 12 && currentHour < 18) {
    timeText = "1 to 2 PM";
    timeImage = require("./../assets/images/time.png");
  } else if (timings.includes("night") && (currentHour >= 18 || currentHour < 23)) {
    timeText = "8 to 9 PM";
    timeImage = require("./../assets/images/time.png");
  }

  return { timeText, timeImage };
};

const styles = StyleSheet.create({
  card: {
    width: "90%",
    backgroundColor: "white",
    padding: 15,
    gap: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 3 },
    marginVertical: 10,
    alignSelf: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsContainer: {
    flex: 1, // Takes available space
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  image: {
    width: 60,
    height: 60,
  },
  timeContainer: {
    alignItems: "center",
  },
  timeImage: {
    width: 50,
    height: 50,
    marginRight:20
  },
  timeText: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    fontWeight: "bold",
    marginRight:20
  },
  noMedsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  iconLabel: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: "#444",
  }
});
