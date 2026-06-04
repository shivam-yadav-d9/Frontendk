import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Targets() {
  const [activeTab, setActiveTab] = useState("Monthly");

  const targets = [
    {
      category: "Revenue",
      title: "Overall Revenue",
      current: "₹2.9L",
      target: "₹4.5L",
      progress: 63,
      status: "IN PROGRESS",
      color: "#F5A300",
    },
    {
      category: "Sales",
      title: "Beds & Wardrobes",
      current: "₹1.2L",
      target: "₹1.2L",
      progress: 100,
      status: "ACHIEVED",
      color: "#1E9E63",
    },
    {
      category: "Sales",
      title: "Sofas",
      current: "₹1.1L",
      target: "₹1.8L",
      progress: 58,
      status: "IN PROGRESS",
      color: "#F5A300",
    },
    {
      category: "Sales",
      title: "Mattresses",
      current: "₹82K",
      target: "₹80K",
      progress: 102,
      status: "EXCEEDED",
      color: "#123B73",
    },
    {
      category: "Training",
      title: "Course Completion",
      current: "3",
      target: "5",
      progress: 60,
      status: "IN PROGRESS",
      color: "#F5A300",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>My Targets</Text>
            <Text style={styles.headerSub}>
              Performance Overview
            </Text>
          </View>

          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="home-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.segment}>
          {["Weekly", "Monthly", "Yearly"].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setActiveTab(item)}
              style={[
                styles.segmentBtn,
                activeTab === item && styles.activeSegment,
              ]}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeTab === item && styles.activeText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Achievement Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryIcon}>
              <Ionicons
                name="trending-up-outline"
                size={30}
                color="#E67821"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.summaryTitle}>
                Overall Achievement
              </Text>
              <Text style={styles.summarySub}>
                Monthly · 5 Targets
              </Text>
            </View>

            <Text style={styles.summaryPercent}>77%</Text>
          </View>

          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: "77%", backgroundColor: "#F5A300" },
              ]}
            />
          </View>

          <Text style={styles.percentLabel}>77%</Text>
        </View>

        <Text style={styles.sectionTitle}>Targets</Text>

        {/* Cards */}
        {targets.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.category}>
                  {item.category}
                </Text>

                <Text style={styles.title}>
                  {item.title}
                </Text>

                <Text style={styles.amount}>
                  {item.current} / {item.target}
                </Text>
              </View>

              <View
                style={[
                  styles.badge,
                  { backgroundColor: item.color },
                ]}
              >
                <Text style={styles.badgeText}>
                  {item.progress}%
                </Text>
              </View>
            </View>

            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(item.progress, 100)}%`,
                    backgroundColor:
                      item.progress >= 100
                        ? "#1E9E63"
                        : item.color,
                  },
                ]}
              />
            </View>

            <Text
              style={[
                styles.status,
                {
                  color:
                    item.status === "ACHIEVED"
                      ? "#1E9E63"
                      : item.status === "EXCEEDED"
                      ? "#123B73"
                      : "#D89A17",
                },
              ]}
            >
              {item.status}
            </Text>

            <Text style={styles.date}>
              2026-05-01 → 2026-05-31
            </Text>

            <TouchableOpacity style={styles.updateBtn}>
              <Text style={styles.updateText}>
                Update Progress
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
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
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  iconBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },

  headerSub: {
    color: "#D7DFEA",
    fontSize: 13,
    marginTop: 2,
  },

  segment: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: -15,
    borderRadius: 25,
    padding: 5,
    elevation: 3,
  },

  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },

  activeSegment: {
    backgroundColor: "#E67821",
  },

  segmentText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#666",
  },

  activeText: {
    color: "#fff",
  },

  summaryCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 18,
    padding: 16,
    elevation: 4,
  },

  summaryTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 55,
    height: 55,
    borderRadius: 14,
    backgroundColor: "#F7EADF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  summaryTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#153A6B",
  },

  summarySub: {
    color: "#666",
    fontSize: 13,
    marginTop: 2,
  },

  summaryPercent: {
    fontSize: 32,
    fontWeight: "900",
    color: "#F5A300",
  },

  progressBg: {
    height: 10,
    backgroundColor: "#ECECEC",
    borderRadius: 10,
    marginTop: 12,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 10,
  },

  percentLabel: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "700",
    color: "#666",
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#153A6B",
    marginHorizontal: 16,
    marginBottom: 8,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 18,
    padding: 16,
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  category: {
    fontSize: 15,
    color: "#153A6B",
    fontWeight: "800",
  },

  title: {
    fontSize: 19,
    fontWeight: "700",
    marginTop: 2,
    color: "#333",
  },

  amount: {
    marginTop: 4,
    fontSize: 15,
    color: "#666",
  },

  badge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    alignSelf: "flex-start",
  },

  badgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  status: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "800",
  },

  date: {
    marginTop: 6,
    color: "#777",
    fontSize: 13,
  },

  updateBtn: {
    marginTop: 14,
    backgroundColor: "#E67821",
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: "center",
  },

  updateText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});