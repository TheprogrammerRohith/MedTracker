import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { account, databases, medicines_collection_id, database_id } from "../app/appwrite";
import { ID } from "react-native-appwrite";
import {
  requestNotificationPermission,
  scheduleMedicineAlert,
} from '../app/notifications';

export default function AddMedicationScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [diseaseName, setDiseaseName] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [selectedMedicineType, setSelectedMedicineType] = useState(null);
  const [medicineDosage, setMedicineDosage] = useState("");
  const [selectedTimes, setSelectedTimes] = useState({
    morning: false,
    afternoon: false,
    night: false,
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

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

  const medicineOptions = [
    { id: "1", name: "Tablet" },
    { id: "2", name: "Syrup" },
    { id: "3", name: "Injection" },
    { id: "4", name: "Drops" },
    { id: "5", name: "Others" },
  ];

  const toggleCheckbox = (time) => {
    setSelectedTimes((prev) => ({
      ...prev,
      [time]: !prev[time],
    }));
  };

  const onChangeStart = (event, selectedDate) => {
    if (selectedDate) {
      setStartDate(selectedDate);
    }
    setShowStartPicker(false);
  };

  const onChangeEnd = (event, selectedDate) => {
    if (selectedDate) {
      setEndDate(selectedDate);
    }
    setShowEndPicker(false);
  };

  function getRandomTimeInRange(startHour, startMin, endHour, endMin) {
    const start = new Date();
    start.setHours(startHour, startMin, 0, 0);
  
    const end = new Date();
    end.setHours(endHour, endMin, 0, 0);
  
    const randomTimestamp = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  
    return {
      hour: randomTimestamp.getHours(),
      minute: randomTimestamp.getMinutes(),
      repeats: true,
    };
  }

  const getDatesBetween = (start, end) => {
    const dates = [];
    const current = new Date(start);
    const endDate = new Date(end);
  
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  
    return dates;
  };

  
  const handleSubmit = async () => {
    const timings = Object.keys(selectedTimes).filter((key) => selectedTimes[key]);
  
    if (!diseaseName || !medicineName || !selectedMedicineType || !medicineDosage) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    
    const data = {
      userId,
      disease_name: diseaseName,
      medicine_name: medicineName,
      medicine_type: selectedMedicineType,
      medicine_dosage: medicineDosage,
      timings,
      start_date: startDate.toISOString().split("T")[0],
      end_date: endDate.toISOString().split("T")[0],
    }

    try {
      await databases.createDocument(
        database_id,
        medicines_collection_id,
        ID.unique(),
        data
      );
  
      await requestNotificationPermission();

      const dateList = getDatesBetween(startDate, endDate);

      dateList.forEach((date) => {
        timings.forEach((time) => {
          let timeConfig;

          switch (time) {
            case "morning":
              timeConfig = getRandomTimeInRange(7, 30, 9, 0);
              break;
            case "afternoon":
              timeConfig = getRandomTimeInRange(12, 0, 13, 30);
              break;
            case "night":
              timeConfig = getRandomTimeInRange(20, 0, 21, 30);
              break;
          }

          if (timeConfig) {
            const triggerDate = new Date(date);
            triggerDate.setHours(timeConfig.hour);
            triggerDate.setMinutes(timeConfig.minute);
            triggerDate.setSeconds(0);

            scheduleMedicineAlert(medicineName, triggerDate);
          }
        });
      });


      Alert.alert("Success", "Medication Added & Notifications Scheduled", [
        {
          text: "OK",
          onPress: () => router.push("(tabs)"),
        },
      ]);
      } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "Failed to add medication.");
    }
  };
  
  
  

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.header}>Add New Medication</Text>

      <Text style={styles.label}>Disease You are suffering from:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="e.g., Fever or Headache"
        value={diseaseName}
        onChangeText={setDiseaseName}
      />

      <Text style={styles.label}>Medicine Name</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Name"
        value={medicineName}
        onChangeText={setMedicineName}
      />

      <Text style={styles.label}>Type</Text>
      <View style={{ marginTop: 5 }}>
        <FlatList
          data={medicineOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedMedicineType === item.name && styles.selectedItem,
              ]}
              onPress={() => setSelectedMedicineType(item.name)} // Fixed: setting correct variable
            >
              <Text
                style={[
                  styles.itemText,
                  selectedMedicineType === item.name && styles.selectedText,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <Text style={styles.label}>Dosage</Text>
      <TextInput
        style={styles.textInput}
        placeholder="e.g., 2 drops or 15ml"
        value={medicineDosage}
        onChangeText={setMedicineDosage}
      />

      <Text style={styles.label}>Select Timings</Text>
      <View style={styles.checkboxRow}>
        {["morning", "afternoon", "night"].map((time) => (
          <TouchableOpacity
            key={time}
            style={styles.checkboxContainer}
            onPress={() => toggleCheckbox(time)}
          >
            <MaterialIcons
              name={selectedTimes[time] ? "check-box" : "check-box-outline-blank"}
              size={24}
              color={selectedTimes[time] ? "#00B5E2" : "#555"}
            />
            <Text style={styles.checkboxLabel}>
              {time.charAt(0).toUpperCase() + time.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.container}>
        <View style={styles.row}>
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
            <Text style={styles.dateText}>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <RNDateTimePicker minimumDate={new Date()} onChange={onChangeStart} value={startDate} />
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>End Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
            <Text style={styles.dateText}>{endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <RNDateTimePicker minimumDate={new Date()} onChange={onChangeEnd} value={endDate} />
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={{ fontSize: 18, textAlign: "center", padding: 15, color: "white" }}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor:'#f5f5f5'
  },
  listContainer: {
    flexDirection: "row",
    gap: 10,
  },
  item: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "black",
    marginHorizontal: 5,
  },
  selectedItem: {
    backgroundColor: "#00B5E2",
    borderColor: "#00B5E2",
  },
  itemText: {
    fontSize: 14,
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  checkboxRow: {
    flexDirection: "row",
    marginTop: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 5,
  },
  container: {
    flexDirection:'row',
    gap:40
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
  },
  dateText: {
    fontSize: 16,
  },
  button:{
    marginTop:20,
    backgroundColor: '#00B5E2',
    borderRadius:10,
    width:'100%'
},
});

