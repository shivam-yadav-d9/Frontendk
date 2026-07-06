import { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const NAVY = "#0B2540";
const GREEN = "#0F7A5C";
const GREEN_LIGHT = "#E7F6EF";
const ORANGE = "#EA7A1E";
const ORANGE_LIGHT = "#FDEEE0";
const RED = "#DC2626";
const RED_LIGHT = "#FEE2E2";
const BLUE = "#1565C0";
const BLUE_LIGHT = "#E8F0FE";

const FILTERS = ["All", "Pending", "In Progress", "Completed"];

const TASKS = [
    {
        id: "1",
        title: "Wardrobe Installation",
        customer: "Rohan Mehta",
        address: "Powai, Mumbai",
        time: "11:00 AM",
        priority: "High",
        status: "Pending",
    },
    {
        id: "2",
        title: "Kitchen Cabinet Fitting",
        customer: "Aisha Khan",
        address: "Andheri West, Mumbai",
        time: "01:30 PM",
        priority: "Medium",
        status: "In Progress",
    },
    {
        id: "3",
        title: "TV Unit Assembly",
        customer: "Suresh Nair",
        address: "Vikhroli, Mumbai",
        time: "09:00 AM",
        priority: "Low",
        status: "Completed",
    },
    {
        id: "4",
        title: "Modular Bed Setup",
        customer: "Priya Sharma",
        address: "Ghatkopar, Mumbai",
        time: "04:00 PM",
        priority: "High",
        status: "Pending",
    },
];

const PRIORITY_STYLES = {
    High: { bg: RED_LIGHT, color: RED },
    Medium: { bg: ORANGE_LIGHT, color: ORANGE },
    Low: { bg: GREEN_LIGHT, color: GREEN },
};

const STATUS_STYLES = {
    Pending: { bg: ORANGE_LIGHT, color: ORANGE, icon: "schedule" },
    "In Progress": { bg: BLUE_LIGHT, color: BLUE, icon: "autorenew" },
    Completed: { bg: GREEN_LIGHT, color: GREEN, icon: "check-circle" },
};

export default function AssignedTasks() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredTasks =
        activeFilter === "All"
            ? TASKS
            : TASKS.filter((t) => t.status === activeFilter);

    const pendingCount = TASKS.filter((t) => t.status === "Pending").length;
    const inProgressCount = TASKS.filter((t) => t.status === "In Progress").length;
    const completedCount = TASKS.filter((t) => t.status === "Completed").length;

    return (
        <SafeAreaView style={styles.safe} edges={["top"]}>
            <StatusBar barStyle="light-content" backgroundColor={NAVY} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.eyebrow}>FITTER WORKSPACE</Text>
                <Text style={styles.title}>Assigned Tasks</Text>
                <Text style={styles.subtitle}>
                    {TASKS.length} tasks scheduled for today
                </Text>
            </View>

            {/* Summary cards - overlapping header */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <MaterialIcons name="schedule" size={20} color={ORANGE} />
                    <Text style={styles.statValue}>{pendingCount}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statCard}>
                    <MaterialIcons name="autorenew" size={20} color={BLUE} />
                    <Text style={styles.statValue}>{inProgressCount}</Text>
                    <Text style={styles.statLabel}>In Progress</Text>
                </View>
                <View style={styles.statCard}>
                    <MaterialIcons name="check-circle" size={20} color={GREEN} />
                    <Text style={styles.statValue}>{completedCount}</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                </View>
            </View>

            {/* Filter chips */}
            <View style={styles.filterWrap}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterRow}
                >
                    {FILTERS.map((filter) => {
                        const active = activeFilter === filter;
                        return (
                            <TouchableOpacity
                                key={filter}
                                onPress={() => setActiveFilter(filter)}
                                style={[styles.filterChip, active && styles.filterChipActive]}
                            >
                                <Text
                                    style={[
                                        styles.filterChipText,
                                        active && styles.filterChipTextActive,
                                    ]}
                                >
                                    {filter}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Task list */}
            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <MaterialIcons name="task-alt" size={40} color="#D1D5DB" />
                        <Text style={styles.emptyText}>No tasks in this category</Text>
                    </View>
                }
                renderItem={({ item }) => {
                    const priorityStyle = PRIORITY_STYLES[item.priority];
                    const statusStyle = STATUS_STYLES[item.status];
                    return (
                        <View style={styles.taskCard}>
                            <View style={styles.taskTopRow}>
                                <Text style={styles.taskTitle}>{item.title}</Text>
                                <View
                                    style={[
                                        styles.priorityBadge,
                                        { backgroundColor: priorityStyle.bg },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.priorityBadgeText,
                                            { color: priorityStyle.color },
                                        ]}
                                    >
                                        {item.priority}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.taskMetaRow}>
                                <MaterialIcons name="person" size={15} color="#6B7280" />
                                <Text style={styles.taskMetaText}>{item.customer}</Text>
                            </View>
                            <View style={styles.taskMetaRow}>
                                <MaterialIcons name="place" size={15} color="#6B7280" />
                                <Text style={styles.taskMetaText}>{item.address}</Text>
                            </View>
                            <View style={styles.taskMetaRow}>
                                <MaterialIcons name="access-time" size={15} color="#6B7280" />
                                <Text style={styles.taskMetaText}>{item.time}</Text>
                            </View>

                            <View style={styles.taskBottomRow}>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        { backgroundColor: statusStyle.bg },
                                    ]}
                                >
                                    <MaterialIcons
                                        name={statusStyle.icon}
                                        size={14}
                                        color={statusStyle.color}
                                    />
                                    <Text
                                        style={[
                                            styles.statusBadgeText,
                                            { color: statusStyle.color },
                                        ]}
                                    >
                                        {item.status}
                                    </Text>
                                </View>

                                {item.status !== "Completed" && (
                                    <TouchableOpacity
                                        style={[
                                            styles.actionBtn,
                                            {
                                                backgroundColor:
                                                    item.status === "Pending" ? GREEN : BLUE,
                                            },
                                        ]}
                                    >
                                        <Text style={styles.actionBtnText}>
                                            {item.status === "Pending" ? "Start Task" : "Mark Done"}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    );
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: NAVY },
    header: {
        backgroundColor: NAVY,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 44,
    },
    eyebrow: {
        color: ORANGE,
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 1,
        marginBottom: 6,
    },
    title: { color: "#fff", fontSize: 28, fontWeight: "800", marginBottom: 6 },
    subtitle: { color: "#9CA9BB", fontSize: 13 },
    statsRow: {
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 16,
        marginTop: -32,
        marginBottom: 4,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    statValue: { fontSize: 18, fontWeight: "800", color: "#111827", marginTop: 4 },
    statLabel: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
    filterWrap: { backgroundColor: "#F3F4F6", paddingTop: 16, paddingBottom: 8 },
    filterRow: { paddingHorizontal: 16, gap: 8 },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    filterChipActive: { backgroundColor: GREEN, borderColor: GREEN },
    filterChipText: { fontSize: 13, fontWeight: "600", color: "#6B7280" },
    filterChipTextActive: { color: "#fff" },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
        backgroundColor: "#F3F4F6",
        flexGrow: 1,
    },
    taskCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    taskTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    taskTitle: { fontSize: 15, fontWeight: "800", color: "#111827", flex: 1, marginRight: 8 },
    priorityBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
    priorityBadgeText: { fontSize: 11, fontWeight: "700" },
    taskMetaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
    taskMetaText: { fontSize: 13, color: "#6B7280" },
    taskBottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    statusBadgeText: { fontSize: 11, fontWeight: "700" },
    actionBtn: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
    actionBtnText: { color: "#fff", fontSize: 12.5, fontWeight: "700" },
    emptyState: { alignItems: "center", justifyContent: "center", paddingTop: 60, gap: 10 },
    emptyText: { color: "#9CA3AF", fontSize: 13 },
});