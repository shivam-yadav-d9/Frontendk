import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function WeeklyBar({ day, value, isOrange }) {
  const maxHeight = 50;
  const barHeight = value * maxHeight;
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <View style={{ height: maxHeight, justifyContent: "flex-end", marginBottom: 4 }}>
        <View
          style={{
            width: 22,
            height: barHeight,
            backgroundColor: isOrange ? "#D86A16" : "#1A5C3A",
            borderRadius: 6,
          }}
        />
      </View>
      <Text style={{ fontSize: 12, color: "#444" }}>{day}</Text>
    </View>
  );
}

function DonutChart({ percent }) {
  return (
    <View style={styles.donutWrapper}>
      <View style={styles.donutOuter}>
        <View style={styles.donutInner}>
          <Text style={styles.donutPercent}>{percent}%</Text>
          <Text style={styles.donutLabel}>Done</Text>
        </View>
      </View>
    </View>
  );
}

export default function Home() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.blobRight} />
        <View style={styles.blobLeft} />

        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={28} color="#fff" />
            <View style={styles.avatarBadge}>
              <Ionicons name="sparkles" size={8} color="#fff" />
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Good Afternoon,</Text>
            <Text style={styles.name}>shivam yadav</Text>
            <View style={styles.badgeRow}>
              <View style={styles.staffBadge}>
                <Text style={styles.staffText}>STORE STAFF</Text>
              </View>
              <View style={styles.locationBadge}>
                <Ionicons name="location-outline" size={12} color="#fff" />
                <Text style={styles.locationText}>HomeTown Mumba...</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.notification}>
            <Ionicons name="notifications-outline" size={20} color="#fff" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>58%</Text>
            <Text style={styles.statLabel}>Learning</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>68%</Text>
            <Text style={styles.statLabel}>Targets</Text>
          </View>
        </View>
      </View>

      {/* ACTIVITY CARD */}
      <View style={styles.activityCard}>
        <View style={styles.blobActivityRight} />
        <View style={styles.activityInner}>
          <View style={styles.activityIconWrap}>
            <Ionicons name="pulse-outline" size={22} color="#fff" />
            <View style={styles.activityDot} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.smallTitle}>TODAY'S QUICK VIEW</Text>
            <Text style={styles.activityTitle}>My Activity</Text>
            <Text style={styles.activitySub}>
              Track your work timeline, pending tasks, updates, alerts and daily pro...
            </Text>
            <View style={styles.activityRow}>
              <View style={styles.pill}><Text style={styles.pillText}>1 Tasks</Text></View>
              <View style={styles.pill}><Text style={styles.pillText}>0 To-Do</Text></View>
              <View style={styles.pill}><Text style={styles.pillText}>2 Alerts</Text></View>
            </View>
          </View>
          <TouchableOpacity style={styles.arrowBtn}>
            <Ionicons name="chevron-forward" size={16} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      {/* MY STORE CARD */}
      <View style={styles.whiteCard}>
        <View style={styles.storeIconWrap}>
          <Ionicons name="storefront-outline" size={22} color="#4A6FA5" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.storeTitle}>MY STORE</Text>
          <Text style={styles.storeName}>HomeTown Mumbai Thane</Text>
          <Text style={styles.storeInfo}>HT-MUM-001 · West · Mumbai</Text>
        </View>
      </View>

      {/* ATTENDANCE CENTER */}
      <View style={[styles.sectionCard, { marginTop: 0 }]}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: "#FFF0E6" }]}>
            <Ionicons name="calendar-outline" size={20} color="#D86A16" />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.sectionTitle}>Attendance Center</Text>
            <Text style={styles.sectionSub}>Attendance, weekly pattern, leave and correction</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.subCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#EAF4EA", width: 40, height: 40 }]}>
            <Ionicons name="calendar-number-outline" size={18} color="#1A7A3A" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.subCardLabel}>TODAY'S ATTENDANCE</Text>
            <Text style={styles.subCardTitle}>Mark attendance</Text>
            <Text style={styles.subCardSub}>Tap to check in or check out for today</Text>
          </View>
          <View style={styles.arrowBtnSm}>
            <Ionicons name="chevron-forward" size={14} color="#888" />
          </View>
        </TouchableOpacity>

        <View style={styles.weeklyCard}>
          <Text style={styles.weeklyTitle}>Weekly Attendance</Text>
          <Text style={styles.weeklySub}>Present, late and absent pattern</Text>
          <View style={styles.chartRow}>
            <View style={styles.chartYAxis}>
              <Text style={styles.axisLabel}>1.0</Text>
              <Text style={[styles.axisLabel, { marginTop: 18 }]}>0.5</Text>
              <Text style={[styles.axisLabel, { marginTop: 18 }]}>0.0</Text>
            </View>
            <View style={styles.barsRow}>
              <WeeklyBar day="M" value={0.9} />
              <WeeklyBar day="T" value={0.75} />
              <WeeklyBar day="W" value={0.85} isOrange />
              <WeeklyBar day="T" value={0.9} />
              <WeeklyBar day="F" value={0.8} />
              <WeeklyBar day="S" value={0.7} />
            </View>
          </View>
        </View>

        <View style={styles.twoColRow}>
          <TouchableOpacity style={styles.halfCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#EEF2FF" }]}>
              <Ionicons name="calendar-outline" size={18} color="#4A6FA5" />
            </View>
            <Text style={styles.halfCardTitle}>Leave Apply</Text>
            <Text style={styles.halfCardSub}>Apply and track leave</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.halfCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#FFF5E6" }]}>
              <Ionicons name="time-outline" size={18} color="#D86A16" />
            </View>
            <Text style={styles.halfCardTitle}>Correction</Text>
            <Text style={styles.halfCardSub}>Fix missed or late punch</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* LEARNING HUB */}
      <View style={[styles.sectionCard, { backgroundColor: "#EEF2FF" }]}>
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: "#D6E0FF" }]}>
            <Ionicons name="book-outline" size={20} color="#3355CC" />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.sectionTitle}>Learning Hub</Text>
            <Text style={styles.sectionSub}>Courses, completion, assignments and coaching</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.subCard, { backgroundColor: "#fff" }]}>
          <View style={[styles.iconCircle, { backgroundColor: "#EEF2FF", width: 40, height: 40 }]}>
            <Ionicons name="school-outline" size={18} color="#3355CC" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.subCardLabel}>COURSES</Text>
            <Text style={styles.subCardTitle}>4 / 8 completed</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: "50%" }]} />
            </View>
            <Text style={styles.subCardSub}>Certificates unlock after completion</Text>
          </View>
          <View style={styles.arrowBtnSm}>
            <Ionicons name="chevron-forward" size={14} color="#888" />
          </View>
        </TouchableOpacity>

        <View style={[styles.weeklyCard, { backgroundColor: "#fff" }]}>
          <Text style={styles.weeklyTitle}>Learning Completion</Text>
          <Text style={styles.weeklySub}>Completed vs pending training</Text>
          <View style={styles.donutRow}>
            <DonutChart percent={58} />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.trainingTitle}>Training Status</Text>
              <Text style={styles.trainingHighlight}>4 completed out of 8</Text>
              <Text style={styles.trainingSub}>
                Complete courses and quizzes to unlock certificates.
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.subCard, { backgroundColor: "#fff" }]}>
          <View style={[styles.iconCircle, { backgroundColor: "#FFE8E8", width: 40, height: 40 }]}>
            <Ionicons name="clipboard-outline" size={18} color="#CC3333" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.subCardLabel}>ASSIGNMENTS</Text>
            <Text style={[styles.subCardTitle, { color: "#CC3333" }]}>1 pending</Text>
            <Text style={styles.subCardSub}>1 overdue · submit soon</Text>
          </View>
          <View style={styles.arrowBtnSm}>
            <Ionicons name="chevron-forward" size={14} color="#888" />
          </View>
        </TouchableOpacity>

        <View style={styles.twoColRow}>
          <TouchableOpacity style={styles.halfCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#E6F7E6" }]}>
              <Ionicons name="help-circle-outline" size={18} color="#1A7A3A" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.halfCard}>
            <View style={[styles.iconCircle, { backgroundColor: "#FFF0E6" }]}>
              <Ionicons name="briefcase-outline" size={18} color="#D86A16" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5EFE6",
  },

  // HEADER
  header: {
    backgroundColor: "#0F2D52",
    paddingTop: 55,
    paddingHorizontal: 18,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
  },
  blobRight: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(100,60,20,0.45)",
    top: -20,
    right: -25,
  },
  blobLeft: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(80,40,10,0.3)",
    top: 55,
    right: 35,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarBadge: {
    position: "absolute",
    bottom: -3,
    right: -3,
    backgroundColor: "#D86A16",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0F2D52",
  },
  greeting: {
    color: "#D5DCE5",
    fontSize: 13,
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 1,
  },
  badgeRow: {
    flexDirection: "row",
    marginTop: 6,
    flexWrap: "wrap",
    gap: 6,
  },
  staffBadge: {
    backgroundColor: "#D86A16",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  staffText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 11,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  locationText: {
    color: "#fff",
    fontSize: 11,
    marginLeft: 3,
  },
  notification: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  notifDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#D86A16",
    borderWidth: 1.5,
    borderColor: "#0F2D52",
  },
  statsCard: {
    marginTop: 18,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 18,
    flexDirection: "row",
    paddingVertical: 14,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  statValue: {
    color: "#FFF4E2",
    fontSize: 22,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#D5DCE5",
    marginTop: 3,
    fontSize: 12,
  },

  // ACTIVITY CARD
  activityCard: {
    backgroundColor: "#0F2D52",
    marginHorizontal: 14,
    marginTop: 14,
    marginBottom: 10,
    borderRadius: 22,
    padding: 14,
    overflow: "hidden",
  },
  blobActivityRight: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(90,40,10,0.5)",
    top: -15,
    right: -15,
  },
  activityInner: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  activityIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#D86A16",
    justifyContent: "center",
    alignItems: "center",
  },
  activityDot: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD700",
  },
  smallTitle: {
    color: "#F6C88B",
    fontWeight: "700",
    letterSpacing: 1.5,
    fontSize: 10,
  },
  activityTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 2,
  },
  activitySub: {
    color: "#D5DCE5",
    marginTop: 4,
    fontSize: 12,
    lineHeight: 17,
  },
  activityRow: {
    flexDirection: "row",
    marginTop: 12,
    flexWrap: "wrap",
    gap: 6,
  },
  pill: {
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pillText: {
    color: "#fff",
    fontSize: 12,
  },
  arrowBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginLeft: 6,
  },

  // WHITE ROW CARD (store)
  whiteCard: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  storeIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  storeTitle: {
    color: "#888",
    fontWeight: "700",
    letterSpacing: 2,
    fontSize: 10,
  },
  storeName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#0F2D52",
    marginTop: 2,
  },
  storeInfo: {
    marginTop: 2,
    color: "#888",
    fontSize: 13,
  },

  // SECTION CARDS (attendance, learning)
  sectionCard: {
    backgroundColor: "#fff",
    marginHorizontal: 14,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  sectionSub: {
    fontSize: 11,
    color: "#888",
    marginTop: 1,
  },
  subCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F9FC",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  subCardLabel: {
    fontSize: 10,
    color: "#888",
    fontWeight: "700",
    letterSpacing: 1,
  },
  subCardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 1,
  },
  subCardSub: {
    fontSize: 11,
    color: "#888",
    marginTop: 1,
  },
  arrowBtnSm: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EAEAEA",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBarBg: {
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    marginTop: 5,
    marginBottom: 3,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: "#0F2D52",
    borderRadius: 2,
  },
  weeklyCard: {
    backgroundColor: "#F7F9FC",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  weeklyTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  weeklySub: {
    fontSize: 11,
    color: "#888",
    marginTop: 1,
    marginBottom: 10,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  chartYAxis: {
    marginRight: 6,
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 75,
  },
  axisLabel: {
    fontSize: 10,
    color: "#888",
  },
  barsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    height: 75,
  },
  twoColRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 2,
  },
  halfCard: {
    flex: 1,
    backgroundColor: "#F7F9FC",
    borderRadius: 14,
    padding: 12,
  },
  halfCardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 8,
  },
  halfCardSub: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },

  // DONUT
  donutRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  donutWrapper: {
    width: 78,
    height: 78,
    justifyContent: "center",
    alignItems: "center",
  },
  donutOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 10,
    borderColor: "#0F2D52",
    borderTopColor: "#E8DDD0",
    borderRightColor: "#E8DDD0",
    justifyContent: "center",
    alignItems: "center",
  },
  donutInner: {
    justifyContent: "center",
    alignItems: "center",
  },
  donutPercent: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  donutLabel: {
    fontSize: 10,
    color: "#888",
  },
  trainingTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  trainingHighlight: {
    fontSize: 12,
    fontWeight: "700",
    color: "#D86A16",
    marginTop: 3,
  },
  trainingSub: {
    fontSize: 11,
    color: "#888",
    marginTop: 3,
    lineHeight: 15,
  },
});