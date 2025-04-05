import React, { useEffect, useState } from "react";
import { View, Image, FlatList, StyleSheet, Text } from "react-native";
import DaySelector from "./DaySelector";
import MedicineList from "./MedicineList";
import { account, databases, database_id, medicines_collection_id } from "../app/appwrite";
import { Query } from "react-native-appwrite";

export default function MedicationList() {
  const [medicines, setMedicines] = useState([]);
  const [userId, setUserId] = useState();
  const [loading, setLoading] = useState(true);

  const currentDayIndex = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(currentDayIndex.toString());

  const getWeekDays = () => {
    const today = new Date();
    const weekDays = [];
  
    for (let i = 0; i < 7; i++) {
      let day = new Date();
      day.setDate(today.getDate() + i); // today + next 6 days
  
      weekDays.push({
        id: day.getDay().toString(), // still use weekday id (0-6)
        name: day.toLocaleDateString("en-US", { weekday: "short" }),
        date: day.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
        fullDate: day.toISOString().split("T")[0],
      });
    }
  
    return weekDays;
  };
  

  const weekDays = getWeekDays();

  const parseDate = (dateString) => {
    // Expected format: YYYY-MM-DD
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const getMedicineDays = (startDate, endDate) => {
    const days = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      days.push(currentDate.getDay().toString());
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const fetchMedications = async () => {
    if (!userId) return;
  
    try {
      const response = await databases.listDocuments(
        database_id,
        medicines_collection_id,
        [Query.equal("userId", userId)]
      );
  
      const cleanedMeds = response.documents.map(({ 
        $id,$collectionId, $createdAt, $databaseId, 
        $permissions, $updatedAt, ...medData 
      }) => {
        const { start_date, end_date } = medData;
  
        if (start_date && end_date) {
          const start = parseDate(start_date);
          const end = parseDate(end_date);
          const days = getMedicineDays(start, end);
          return {
            ...medData,
            id: $id,
            days,
          };
        }
  
        return {
          ...medData,
          days: [], // fallback to empty array to avoid crashing
        };
      });
      console.log(cleanedMeds)
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

  const selectedDateObj = parseDate(
    weekDays.find((d) => d.id === selectedDay)?.fullDate
  );
  
  const filteredMedicines = medicines.filter((medicine) => {
    const isRightDay = medicine.days.includes(selectedDay);
  
    const medStart = parseDate(medicine.start_date);
    const medEnd = parseDate(medicine.end_date);
  
    const isInDateRange =
      selectedDateObj >= medStart && selectedDateObj <= medEnd;
  
    return isRightDay && isInDateRange;
  });
  
  
  return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={require("./../assets/images/drug.png")} style={styles.image} />
        </View>

        <DaySelector weekDays={weekDays} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
        <MedicineList Medicines={filteredMedicines} />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    marginTop: 10,
    paddingBottom: 20,
  },
  imageContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  image: {
    width: 140,
    height: 140,
  },
});
