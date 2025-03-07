import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

export default function MedicineList({ filteredMedicines }) {
  return (
    <ScrollView style={{ width: "100%", marginTop: 20 }}
    contentContainerStyle={{ paddingBottom: 80 }}>
      {filteredMedicines.length > 0 ? (
        filteredMedicines.map((item) => {
          const { timeText, timeImage } = getTimeDetails(item.timing);

          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.rowContainer}>
                {/* Medicine Details */}
                <View style={styles.detailsContainer}>
                  <Text style={styles.medicineName}>{item.name}</Text>
                  <Text style={styles.detailText}>Dosage: {item.dosage}</Text>
                  <Text style={styles.detailText}>Timing:</Text>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    {item.timing.includes("Morning") && (
                      <Image source={require("./../assets/images/morning_icon.png")} style={styles.image} />
                    )}
                    {item.timing.includes("Afternoon") && (
                      <Image source={require("./../assets/images/afternoon.png")} style={styles.image} />
                    )}
                    {item.timing.includes("Night") && (
                      <Image source={require("./../assets/images/cloudy-night.png")} style={styles.image} />
                    )}
                  </View>
                </View>

                {/* Time Image with Text Based on Current Time */}
                {timeImage && (
                  <View style={styles.timeContainer}>
                    <Image source={timeImage} style={styles.timeImage} />
                    <Text style={styles.timeText}>{timeText}</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })
      ) : (
        <Text style={styles.noMedsText}>No medicines for this day</Text>
      )}
    </ScrollView>
  );
}

// Function to determine the time text and image based on the current time
const getTimeDetails = (timing) => {
  const currentHour = new Date().getHours();
  let timeText = "";
  let timeImage = null;

  if (timing.includes("Morning") && currentHour >= 6 && currentHour < 12) {
    timeText = "8 to 9 AM";
    timeImage = require("./../assets/images/time.png");
  } else if (timing.includes("Afternoon") && currentHour >= 12 && currentHour < 18) {
    timeText = "1 to 2 PM";
    timeImage = require("./../assets/images/time.png");
  } else if (timing.includes("Night") && (currentHour >= 18 || currentHour < 23)) {
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
  medicineName: {
    fontSize: 18,
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
});
