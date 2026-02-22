# 💊 MedTracker -- Smart Medicine Tracking App

MedTracker is a React Native-based medicine tracking application that
helps users manage their medications efficiently.\
The app provides intelligent reminders, tracks medicine duration, and
improves adherence through notifications and caretaker alerts.

------------------------------------------------------------------------

## 🚀 Features

### ✅ 1. Medicine Management

-   Add, edit, and delete medicines
-   Track:
    -   Disease name
    -   Medicine name
    -   Dosage
    -   Medicine type (Tablet, Syrup, etc.)
    -   Start date & End date
    -   Timings (Morning / Afternoon / Night)

### 🔔 2. Smart Notifications

-   Local push notifications using `expo-notifications`
-   Scheduled from `start_date` to `end_date`
-   Triggered based on selected time slots
-   Alerts users at the correct dosage times

### 📊 3. Duration Monitoring

-   Tracks long-term medicine usage
-   Warns users if medication duration exceeds typical limits
-   Encourages safe usage awareness

### 👨‍👩‍👧 4. Caretaker Notification System

-   Users can add caretaker details
-   Sends updates about medicine confirmation status
-   Improves accountability and safety

### 🗂 5. Organized Medicine History

Stores: - Current medications - Past medications

Each medicine entry includes: - Disease name - Dosage - Type -
Duration - Timings - User ID

------------------------------------------------------------------------

## 🛠 Tech Stack

### 📱 Frontend

-   React Native (Expo)
-   JavaScript 
-   `expo-notifications`

### ☁ Backend

-   Appwrite (Database & Authentication)

------------------------------------------------------------------------

## 🧠 Application Flow

1.  User adds a new medicine.
2.  Notification is scheduled based on:
    -   Selected time (Morning/Afternoon/Night)
    -   Start and End date.
3.  User receives reminder.
4.  User confirms medicine intake.
5.  Status is recorded in the system.
6.  (Optional) Caretaker is notified.

## ⚙ Installation & Setup

### 1️⃣ Clone Repository

``` bash
git clone https://github.com/your-username/medtracker.git
cd medtracker
```

### 2️⃣ Install Dependencies

``` bash
npm install
```

### 3️⃣ Start Expo

``` bash
npx expo start
```

------------------------------------------------------------------------

## 📸 Screens Overview

-   🏠 Home Screen -- Displays active medicines and upcoming reminders.
-   ➕ Add Medicine Screen -- Input medicine details and schedule
    reminders.
-   📜 History Screen -- View past medication records.
-   👤 Profile Screen -- Manage user and caretaker details.

------------------------------------------------------------------------

## 🎯 Future Enhancements

-   AI-based health insights
-   IoT-based smart pill box integration
-   Cloud push notifications
-   Medicine adherence analytics dashboard
-   Multi-device sync support

------------------------------------------------------------------------
