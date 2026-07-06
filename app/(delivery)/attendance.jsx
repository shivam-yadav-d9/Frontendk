import { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const BLUE = "#1565C0";
const BLUE_LIGHT = "#E8F0FE";
const ORANGE = "#EA7A1E";
const ORANGE_LIGHT = "#FDEEE0";

export default function Attendance() {
    const [checkedIn] = useState(true);
    const [checkInTime] = useState(new Date(new Date().setHours(10, 23, 0)));
    const [elapsed, setElapsed] = useState("00h 00m 00s");

    const today = new Date();
    const todayShort = today.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
    });
    const todayISO = today.toISOString().split("T")[0];
    const todayLong = today.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    useEffect(() => {
        if (!checkedIn) return;
        const tick = () => {
            const diffMs = Date.now() - checkInTime.getTime();
            const h = Math.floor(diffMs / 3600000);
            const m = Math.floor((diffMs % 3600000) / 60000);
            const s = Math.floor((diffMs % 60000) / 1000);
            setElapsed(
                `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(
                    s
                ).padStart(2, "0")}s`
            );
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [checkedIn, checkInTime]);

    const checkInTimeLabel = checkInTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const RECENT_HISTORY = [
        { date: "06 Jul 2026", status: "Present" },
        { date: "05 Jul 2026", status: "Present" },
        { date: "04 Jul 2026", status: "Absent" },
    ];

    return (
        <SafeAreaView style={styles.safe} edges={["top"]}>
            <StatusBar barStyle="light-content" backgroundColor="#0B2540" />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{ paddingBottom: 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.eyebrow}>ATTENDANCE HUB</Text>
                    <Text style={styles.title}>My Dashboard</Text>
                    <Text style={styles.subtitle}>
                        Track attendance and office status
                    </Text>
                </View>

                {/* Stat cards - overlapping header */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <MaterialIcons name="access-time" size={22} color={ORANGE} />
                        <Text style={styles.statLabel}>Status</Text>
                        <Text style={[styles.statValue, { color: BLUE }]}>
                            {checkedIn ? "Checked In" : "Checked Out"}
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <MaterialIcons name="calendar-today" size={22} color={ORANGE} />
                        <Text style={styles.statLabel}>Today</Text>
                        <Text style={styles.statValue}>{todayShort}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <MaterialIcons name="place" size={22} color={BLUE} />
                        <Text style={styles.statLabel}>Distance</Text>
                        <Text style={styles.statValue}>28m</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <Text style={styles.sectionTitle}>Today's Session</Text>

                    <View style={styles.sessionCard}>
                        <View style={styles.sessionTopRow}>
                            <Text style={styles.sessionDate}>{todayISO}</Text>
                            <View style={styles.badge}>
                                <View style={styles.badgeDot} />
                                <Text style={styles.badgeText}>
                                    {checkedIn ? "Checked In" : "Checked Out"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.timeBox}>
                            <MaterialIcons name="timer" size={20} color={ORANGE} />
                            <Text style={styles.timeBoxLabel}>Time in office</Text>
                            <Text style={styles.timeBoxValue}>{elapsed}</Text>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <View style={styles.detailLeft}>
                                <MaterialIcons name="login" size={18} color="#6B7280" />
                                <Text style={styles.detailLabel}>Check In</Text>
                            </View>
                            <Text style={styles.detailValue}>{checkInTimeLabel}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <View style={styles.detailLeft}>
                                <MaterialIcons name="logout" size={18} color="#D1D5DB" />
                                <Text style={styles.detailLabel}>Check Out</Text>
                            </View>
                            <Text style={styles.detailValueMuted}>
                                {checkedIn ? "Active session" : "--"}
                            </Text>
                        </View>
                        <View style={styles.detailRow}>
                            <View style={styles.detailLeft}>
                                <MaterialIcons name="repeat" size={18} color="#6B7280" />
                                <Text style={styles.detailLabel}>Sessions</Text>
                            </View>
                            <Text style={styles.detailValue}>1</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <View style={styles.detailLeft}>
                                <MaterialIcons name="event-available" size={18} color="#6B7280" />
                                <Text style={styles.detailLabel}>Day Status</Text>
                            </View>
                            <Text style={[styles.detailValue, { color: BLUE }]}>Present</Text>
                        </View>
                    </View>

                    {/* Auto-tracking banner */}
                    <View style={styles.infoBanner}>
                        <MaterialIcons name="gps-fixed" size={22} color={ORANGE} />
                        <Text style={styles.infoBannerText}>
                            Auto tracking active — checked in/out automatically as you
                            enter or leave the office. Re-entry triggers a new session.
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>Recent History</Text>
                    <View style={styles.historyCard}>
                        {RECENT_HISTORY.map((item, idx) => (
                            <View
                                key={item.date}
                                style={[
                                    styles.historyRow,
                                    idx !== RECENT_HISTORY.length - 1 && styles.historyRowBorder,
                                ]}
                            >
                                <Text style={styles.historyDate}>{item.date}</Text>
                                <View
                                    style={[
                                        styles.historyBadge,
                                        {
                                            backgroundColor:
                                                item.status === "Present" ? BLUE_LIGHT : "#FEE2E2",
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.historyBadgeText,
                                            {
                                                color: item.status === "Present" ? BLUE : "#DC2626",
                                            },
                                        ]}
                                    >
                                        {item.status}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: "#0B2540" },
    scroll: { flex: 1, backgroundColor: "#F3F4F6" },
    header: {
        backgroundColor: "#0B2540",
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
    title: { color: "#fff", fontSize: 30, fontWeight: "800", marginBottom: 6 },
    subtitle: { color: "#9CA9BB", fontSize: 13 },
    statsRow: {
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 16,
        marginTop: -32,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    statLabel: { color: "#9CA3AF", fontSize: 12, marginTop: 8 },
    statValue: { color: "#111827", fontSize: 14, fontWeight: "700", marginTop: 4 },
    body: { paddingHorizontal: 16 },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 12,
        marginTop: 4,
    },
    sessionCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 18,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    sessionTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    sessionDate: { fontSize: 16, fontWeight: "800", color: "#111827" },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: BLUE_LIGHT,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 6,
    },
    badgeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: BLUE },
    badgeText: { color: BLUE, fontWeight: "700", fontSize: 12 },
    timeBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: ORANGE_LIGHT,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 14,
        gap: 10,
        marginBottom: 14,
    },
    timeBoxLabel: { flex: 1, color: ORANGE, fontWeight: "700", fontSize: 13 },
    timeBoxValue: { color: ORANGE, fontWeight: "800", fontSize: 18 },
    divider: { height: 1, backgroundColor: "#F3F4F6", marginBottom: 6 },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },
    detailLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
    detailLabel: { color: "#6B7280", fontSize: 13 },
    detailValue: { color: "#111827", fontWeight: "700", fontSize: 13 },
    detailValueMuted: { color: "#9CA3AF", fontWeight: "600", fontSize: 13 },
    infoBanner: {
        flexDirection: "row",
        backgroundColor: ORANGE_LIGHT,
        borderRadius: 14,
        padding: 16,
        gap: 12,
        marginBottom: 20,
    },
    infoBannerText: { flex: 1, color: ORANGE, fontSize: 12.5, lineHeight: 18 },
    historyCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingHorizontal: 18,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    historyRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
    },
    historyRowBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    historyDate: { color: "#111827", fontWeight: "600", fontSize: 13 },
    historyBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
    historyBadgeText: { fontWeight: "700", fontSize: 12 },
});