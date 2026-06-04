import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  MAX_DISTANCE,
  OFFICE_LOCATION,
  calculateDistance,
} from ".././../utils/location";

export default function Attend() {
  const [distance, setDistance] = useState(0);
  const [isInsideOffice, setIsInsideOffice] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  const isInsideRef = useRef(false);

  useEffect(() => {
    let subscription;

    const startTracking = async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow location access"
        );
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        async (location) => {
          const distanceInMeters = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            OFFICE_LOCATION.latitude,
            OFFICE_LOCATION.longitude
          );

          setDistance(distanceInMeters.toFixed(2));

          if (distanceInMeters <= MAX_DISTANCE) {
            if (!isInsideRef.current) {
              isInsideRef.current = true;
              setIsInsideOffice(true);
            }
          } else {
            if (isInsideRef.current) {
              isInsideRef.current = false;
              setIsInsideOffice(false);

              try {
                await AsyncStorage.removeItem("userToken");

                Alert.alert(
                  "Logged Out",
                  "You left the office area"
                );

                router.replace("/");
              } catch (error) {
                console.log(error);
              }
            }
          }
        }
      );
    };

    startTracking();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const handleCheckIn = () => {
    if (!isInsideOffice) {
      Alert.alert(
        "Access Denied",
        "You must be inside office premises."
      );
      return;
    }

    setCheckedIn(true);

    Alert.alert(
      "Success",
      "Attendance Marked Successfully"
    );
  };

  const attendanceData = [
    {
      date: "03 Jun 2026",
      time: "09:02 AM",
      status: "Present",
    },
    {
      date: "02 Jun 2026",
      time: "08:58 AM",
      status: "Present",
    },
    {
      date: "01 Jun 2026",
      time: "09:05 AM",
      status: "Present",
    },
    {
      date: "31 May 2026",
      time: "08:55 AM",
      status: "Present",
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}

      <View style={styles.header}>
        <Text style={styles.headerTag}>
          ATTENDANCE HUB
        </Text>

        <Text style={styles.headerTitle}>
          Attendance
        </Text>

        <Text style={styles.headerSubtitle}>
          Mark attendance only inside office.
        </Text>
      </View>

      {/* Check In Button */}

      <TouchableOpacity
        style={[
          styles.checkButton,
          {
            backgroundColor: isInsideOffice
              ? "#10B981"
              : "#9CA3AF",
          },
        ]}
        onPress={handleCheckIn}
      >
        <Text style={styles.checkText}>
          {checkedIn
            ? "✓ Attendance Marked"
            : "Check In"}
        </Text>
      </TouchableOpacity>

      {/* Status */}

      <View style={styles.card}>
        <Text style={styles.cardLabel}>
          Current Status
        </Text>

        <Text
          style={[
            styles.statusText,
            {
              color: isInsideOffice
                ? "#10B981"
                : "#EF4444",
            },
          ]}
        >
          {isInsideOffice
            ? "● Inside Office"
            : "● Outside Office"}
        </Text>
      </View>

      {/* Distance */}

      <View style={styles.card}>
        <Text style={styles.cardLabel}>
          Distance From Office
        </Text>

        <Text style={styles.distanceText}>
          {distance} m
        </Text>
      </View>

      {/* Office Info */}

      {/* <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Office Information
        </Text>

        <Text style={styles.infoText}>
          Allowed Radius: {MAX_DISTANCE}m
        </Text>

        <Text style={styles.infoText}>
          Latitude: {OFFICE_LOCATION.latitude}
        </Text>

        <Text style={styles.infoText}>
          Longitude: {OFFICE_LOCATION.longitude}
        </Text>
      </View> */}

      {/* History */}

      <Text style={styles.sectionTitle}>
        Attendance History
      </Text>

      {attendanceData.map((item, index) => (
        <View
          key={index}
          style={styles.attendanceCard}
        >
          <View>
            <Text style={styles.attendanceDate}>
              {item.date}
            </Text>

            <Text style={styles.attendanceTime}>
              Check In: {item.time}
            </Text>
          </View>

          <Text style={styles.present}>
            ✓ {item.status}
          </Text>
        </View>
      ))}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    backgroundColor: "#0B2D52",
    paddingTop: 70,
    paddingHorizontal: 25,
    paddingBottom: 70,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },

  headerTag: {
    color: "#F59E0B",
    fontWeight: "700",
    letterSpacing: 1,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 8,
  },

  headerSubtitle: {
    color: "#D1D5DB",
    fontSize: 16,
    marginTop: 8,
  },

  checkButton: {
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
    elevation: 6,
  },

  checkText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 18,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
  },

  cardLabel: {
    color: "#6B7280",
    fontSize: 14,
  },

  statusText: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },

  distanceText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 10,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 10,
  },

  infoText: {
    color: "#6B7280",
    marginBottom: 5,
  },

  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },

  attendanceCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  attendanceDate: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  attendanceTime: {
    color: "#6B7280",
    marginTop: 4,
  },

  present: {
    color: "#10B981",
    fontWeight: "bold",
  },
});