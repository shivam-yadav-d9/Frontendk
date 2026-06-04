import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Profile() {
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>SY</Text>
        </View>

        <Text style={styles.name}>Shivam Yadav</Text>
        <Text style={styles.designation}>
          Sales Executive
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>92%</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>77%</Text>
          <Text style={styles.statLabel}>Targets</Text>
        </View>
      </View>

      {/* Personal Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Personal Information
        </Text>

        <InfoRow
          icon="person-outline"
          label="Employee ID"
          value="EMP001"
        />

        <InfoRow
          icon="mail-outline"
          label="Email"
          value="shivam@example.com"
        />

        <InfoRow
          icon="call-outline"
          label="Phone"
          value="+91 9876543210"
        />

        <InfoRow
          icon="location-outline"
          label="Location"
          value="Mumbai Office"
        />
      </View>

      {/* Performance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Performance Summary
        </Text>

        <InfoRow
          icon="trending-up-outline"
          label="Monthly Revenue"
          value="₹2.9L"
        />

        <InfoRow
          icon="trophy-outline"
          label="Target Achievement"
          value="77%"
        />

        <InfoRow
          icon="school-outline"
          label="Courses Completed"
          value="3 / 5"
        />
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.iconBox}>
        <Ionicons
          name={icon}
          size={20}
          color="#0F2D52"
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>

      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3EEE8",
  },

  header: {
    backgroundColor: "#0F2D52",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E67821",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },

  name: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 15,
  },

  designation: {
    color: "#D7DFEA",
    fontSize: 15,
    marginTop: 4,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 20,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 4,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    elevation: 3,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F2D52",
  },

  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#666",
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 18,
    padding: 16,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F2D52",
    marginBottom: 15,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EEF3F8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  infoLabel: {
    fontSize: 14,
    color: "#666",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
});