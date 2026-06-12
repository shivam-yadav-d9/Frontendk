import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import targetService from "../../services/target.service";

export default function Targets() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [monthlyTarget, setMonthlyTarget] = useState(null);
  const [dailyTargets, setDailyTargets] = useState([]);
  const [achievedTotal, setAchievedTotal] = useState(0);
  const [targetTotal, setTargetTotal] = useState(0);
  const [achievementPercentage, setAchievementPercentage] = useState(0);

  useEffect(() => {
    loadUserAndData();
  }, []);

  const loadUserAndData = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        await fetchTargetData();
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTargetData = async () => {
    try {
      // Fetch monthly target
      const monthlyResult = await targetService.getMonthlyTarget();
      if (monthlyResult.success && monthlyResult.data) {
        setMonthlyTarget(monthlyResult.data);
        setTargetTotal(monthlyResult.data.salesTargetAmount);
        setAchievedTotal(monthlyResult.data.targetAchieved || 0);
        
        if (monthlyResult.data.salesTargetAmount > 0) {
          const percentage = ((monthlyResult.data.targetAchieved || 0) / monthlyResult.data.salesTargetAmount) * 100;
          setAchievementPercentage(Math.min(Math.round(percentage), 100));
        }
      }

      // Fetch daily targets
      const dailyResult = await targetService.getDailyTargets();
      if (dailyResult.success && dailyResult.data) {
        setDailyTargets(dailyResult.data);
      }
    } catch (error) {
      console.error("Error fetching target data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTargetData();
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "₹0";
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusFromProgress = (percentage) => {
    if (percentage >= 100) return "EXCEEDED";
    if (percentage >= 75) return "ACHIEVED";
    if (percentage >= 50) return "ON TRACK";
    if (percentage > 0) return "IN PROGRESS";
    return "NOT STARTED";
  };

  const getStatusColorFromProgress = (percentage) => {
    if (percentage >= 100) return "#1E9E63";
    if (percentage >= 75) return "#123B73";
    if (percentage >= 50) return "#F5A300";
    if (percentage > 0) return "#D96A17";
    return "#9CA3AF";
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D96A17" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>

          <View>
            <Text style={styles.headerTitle}>My Targets</Text>
            <Text style={styles.headerSub}>
              {user?.name || "Employee"} • {user?.employeeNumber || "RC000447"}
            </Text>
          </View>

          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push("/(tabs)/home")}>
            <Ionicons name="home-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Monthly Target Card */}
        {monthlyTarget && (
          <View style={styles.monthlyCard}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="calendar" size={24} color="#D96A17" />
                <Text style={styles.cardTitle}>Monthly Target</Text>
              </View>
              <Text style={styles.monthYear}>
                {monthlyTarget.month}/{monthlyTarget.year}
              </Text>
            </View>

            <View style={styles.amountRow}>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Target</Text>
                <Text style={styles.amountValue}>{formatCurrency(targetTotal)}</Text>
              </View>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Achieved</Text>
                <Text style={[styles.amountValue, { color: achievementPercentage >= 100 ? "#1E9E63" : "#D96A17" }]}>
                  {formatCurrency(achievedTotal)}
                </Text>
              </View>
              <View style={styles.amountItem}>
                <Text style={styles.amountLabel}>Remaining</Text>
                <Text style={styles.amountValue}>
                  {formatCurrency(targetTotal - achievedTotal)}
                </Text>
              </View>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressPercent}>{achievementPercentage}%</Text>
              </View>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${achievementPercentage}%`, backgroundColor: "#F5A300" },
                  ]}
                />
              </View>
            </View>

            <View style={styles.statusRow}>
              <Ionicons name="trending-up" size={16} color={getStatusColorFromProgress(achievementPercentage)} />
              <Text style={[styles.statusText, { color: getStatusColorFromProgress(achievementPercentage) }]}>
                {getStatusFromProgress(achievementPercentage)}
              </Text>
            </View>
          </View>
        )}

        {/* Daily Targets Section */}
        <View style={styles.dailySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="today" size={22} color="#0F2D52" />
            <Text style={styles.sectionTitle}>Daily Targets</Text>
          </View>

          {dailyTargets.length > 0 ? (
            dailyTargets.map((target) => {
              const progress = target.salesTargetAmount > 0 
                ? Math.min(Math.round(((target.targetAchieved || 0) / target.salesTargetAmount) * 100), 100)
                : 0;
              const statusColor = getStatusColorFromProgress(progress);
              
              return (
                <View key={target._id} style={styles.dailyCard}>
                  <View style={styles.dailyCardHeader}>
                    <View>
                      <Text style={styles.dailyDate}>
                        {formatDate(target.targetDate)}
                      </Text>
                      <Text style={styles.dailyAmount}>
                        {formatCurrency(target.targetAchieved || 0)} / {formatCurrency(target.salesTargetAmount)}
                      </Text>
                    </View>
                    <View style={[styles.dailyBadge, { backgroundColor: statusColor }]}>
                      <Text style={styles.dailyBadgeText}>{progress}%</Text>
                    </View>
                  </View>

                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${progress}%`,
                          backgroundColor: statusColor,
                        },
                      ]}
                    />
                  </View>

                  <Text style={[styles.dailyStatus, { color: statusColor }]}>
                    {getStatusFromProgress(progress)}
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyText}>No daily targets found</Text>
              <Text style={styles.emptySubText}>
                Daily targets will appear here once assigned
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3EEE8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 11,
    marginTop: 2,
  },
  // Monthly Target Card
  monthlyCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F2D52",
  },
  monthYear: {
    fontSize: 14,
    fontWeight: "600",
    color: "#D96A17",
    backgroundColor: "#FFF4EC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  amountItem: {
    flex: 1,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  progressSection: {
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: "700",
    color: "#F5A300",
  },
  progressBg: {
    height: 8,
    backgroundColor: "#ECECEC",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
  },
  // Daily Targets Section
  dailySection: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F2D52",
  },
  dailyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dailyCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  dailyDate: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  dailyAmount: {
    fontSize: 13,
    color: "#666",
  },
  dailyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    minWidth: 50,
    alignItems: "center",
  },
  dailyBadgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  dailyStatus: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
  },
  emptyCard: {
    backgroundColor: "#fff",
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    gap: 10,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500",
  },
  emptySubText: {
    color: "#D1D5DB",
    fontSize: 12,
    textAlign: "center",
  },
});