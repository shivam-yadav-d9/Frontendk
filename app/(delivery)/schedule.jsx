import {
    Alert,
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const BLUE = "#0B2540";
const BLUE_LIGHT = "#E8F0FE";

const STATUS_STYLES = {
  Completed: { bg: "#E6F7EC", color: "#16A34A", icon: "check-circle" },
  "In Progress": { bg: "#E8F0FE", color: "#1565C0", icon: "local-shipping" },
  Pending: { bg: "#FEF3E2", color: "#D97706", icon: "schedule" },
};

const DELIVERIES = [
  {
    id: "DLV0123",
    address: "123, MG Road, Bangalore",
    time: "10:00 AM",
    status: "Completed",
  },
  {
    id: "DLV0124",
    address: "45, Koramangala, Bangalore",
    time: "01:30 PM",
    status: "In Progress",
  },
  {
    id: "DLV0125",
    address: "78, Whitefield, Bangalore",
    time: "04:00 PM",
    status: "Pending",
  },
];

export default function Schedule() {
  const completedCount = DELIVERIES.filter(
    (d) => d.status === "Completed"
  ).length;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={BLUE} />

      <View style={styles.header}>
        <MaterialIcons name="menu" size={24} color="#fff" />
        <Text style={styles.headerTitle}>Schedule</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>Today's Deliveries</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: BLUE_LIGHT }]}>
              <MaterialIcons name="local-shipping" size={20} color={BLUE} />
            </View>
            <Text style={styles.statValue}>{DELIVERIES.length}</Text>
            <Text style={styles.statLabel}>Total Deliveries</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "#FEF3E2" }]}>
              <MaterialIcons name="inventory-2" size={20} color="#D97706" />
            </View>
            <Text style={styles.statValue}>{completedCount}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <View style={styles.card}>
          {DELIVERIES.map((item, idx) => {
            const statusStyle = STATUS_STYLES[item.status];
            return (
              <View
                key={item.id}
                style={[
                  styles.deliveryRow,
                  idx !== DELIVERIES.length - 1 && styles.rowBorder,
                ]}
              >
                <View
                  style={[
                    styles.deliveryIconWrap,
                    { backgroundColor: statusStyle.bg },
                  ]}
                >
                  <MaterialIcons
                    name={statusStyle.icon}
                    size={18}
                    color={statusStyle.color}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deliveryId}>{item.id}</Text>
                  <Text style={styles.deliveryAddress}>{item.address}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.deliveryTime}>{item.time}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusStyle.bg },
                    ]}
                  >
                    <Text
                      style={[styles.statusBadgeText, { color: statusStyle.color }]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BLUE },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: BLUE,
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
  body: { flex: 1, backgroundColor: "#F3F4F6" },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statValue: { fontSize: 20, fontWeight: "800", color: "#111827" },
  statLabel: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  deliveryIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  deliveryId: { fontSize: 13, fontWeight: "700", color: "#111827" },
  deliveryAddress: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  deliveryTime: { fontSize: 12, color: "#374151", marginBottom: 6 },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusBadgeText: { fontSize: 10, fontWeight: "700" },
});