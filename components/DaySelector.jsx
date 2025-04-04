import React from "react";
import { FlatList, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function DaySelector({ weekDays, selectedDay, setSelectedDay }) {
  return (
    <FlatList
      data={weekDays}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.dayItem, selectedDay === item.id && styles.selectedDay]}
          onPress={() => setSelectedDay(item.id)}
        >
          <Text style={[styles.dayText, selectedDay === item.id && styles.selectedText]}>
            {item.name}
          </Text>
          <Text style={[styles.dateText, selectedDay === item.id && styles.selectedText]}>
            {item.date}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
  },     
  dayItem: {
    width: 70,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "white",
  },
  selectedDay: {
    backgroundColor: "skyblue",
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  dateText: {
    fontSize: 14,
    color: "#555",
  },
  selectedText: {
    color: "white",
  },
});
