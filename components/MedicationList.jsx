import React, { useState } from "react";
import { View, Image, ScrollView, StyleSheet } from "react-native";
import DaySelector from "./DaySelector";
import MedicineList from "./MedicineList";

const getWeekDays = () => {
  const today = new Date();
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    let day = new Date();
    day.setDate(today.getDate() - today.getDay() + i);
    weekDays.push({
      id: i.toString(),
      name: day.toLocaleDateString("en-US", { weekday: "short" }),
      date: day.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
    });
  }
  return weekDays;
};

const medicines = [
  { id: "1", name: "Paracetamol", dosage: "500mg", timing: ["Morning", "Night"], startDate: "23/02/2025", endDate: "25/02/2025" },
  { id: "2", name: "Cough Syrup", dosage: "10ml", timing: ["Afternoon"], startDate: "23/02/2025", endDate: "26/02/2025" },
  { id: "3", name: "Eye Drops", dosage: "2 drops", timing: ["Morning","Afternoon","Night"], startDate: "23/02/2025", endDate: "28/02/2025" },
];

// Function to convert date string to a Date object
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

// Function to get all the days between two dates
const getMedicineDays = (startDate, endDate) => {
  const days = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    days.push(currentDate.getDay().toString());
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return days;
};


medicines.forEach((medicine) => {
  medicine.days = getMedicineDays(parseDate(medicine.startDate), parseDate(medicine.endDate));
});

export default function MedicationList() {
  const weekDays = getWeekDays();
  const currentDayIndex = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(weekDays[currentDayIndex].id);

  const filteredMedicines = medicines.filter((medicine) => medicine.days.includes(selectedDay));

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={require("./../assets/images/drug.png")} style={styles.image} />
        </View>

        {/* Day Selector */}
        <DaySelector weekDays={weekDays} selectedDay={selectedDay} setSelectedDay={setSelectedDay} />

        {/* Medicine List */}
        <MedicineList filteredMedicines={filteredMedicines} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: "center",
  },
  imageContainer: {
    marginBottom: 30,
  },
  image: {
    width: 140,
    height: 140,
  },
});
