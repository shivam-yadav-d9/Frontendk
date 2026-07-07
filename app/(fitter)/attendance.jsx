// app/(fitter)/attendance.jsx
//
// ⚠️  This screen does NOT own tracking — (fitter)/_layout.jsx does.
//     attendance.jsx only LISTENS to events and reads local data.
//     Never call fitterLocationService.startTracking()/stopTracking() here.

import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import eventEmitter from "../../services/eventEmitter";
import fitterAttendanceService from "../../services/fitterAttendance.service";
import fitterLocationService from "../../services/fitterLocation.service";

const NAVY = "#0B2540";
const GREEN = "#0F7A5C";
const GREEN_LIGHT = "#E7F6EF";
const ORANGE = "#EA7A1E";
const ORANGE_LIGHT = "#FDEEE0";
const RED = "#DC2626";
const RED_LIGHT = "#FEE2E2";

// ─── helpers ────────────────────────────────────────────────────────────────

const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const formatDate = (dateString) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const computeLiveDuration = (todayRecord, isCheckedIn, activeCheckIn) => {
    if (!isCheckedIn) {
        if (!todayRecord) return "0h 0m";
        const mins = todayRecord.totalDurationMinutes || 0;
        return `${Math.floor(mins / 60)}h ${mins % 60}m`;
    }
    const checkInISO = activeCheckIn || todayRecord?.oldestCheckIn;
    if (!checkInISO) return "0h 0m 0s";

    const elapsedSec = Math.floor(
        (Date.now() - new Date(checkInISO).getTime()) / 1000
    );
    const closedMins = todayRecord?.totalDurationMinutes || 0;
    const totalSec = closedMins * 60 + elapsedSec;

    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}h ${m}m ${s}s`;
};

// ─── component ──────────────────────────────────────────────────────────────

export default function FitterAttendance() {
    const [distance, setDistance] = useState(0);
    const [isInsideOffice, setIsInsideOffice] = useState(false);
    const [currentStatus, setCurrentStatus] = useState("CHECKED_OUT");
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const [refreshing, setRefreshing] = useState(false);
    const [todayAttendance, setTodayAttendance] = useState(null);
    const [activeCheckIn, setActiveCheckIn] = useState(null);
    const [liveDuration, setLiveDuration] = useState("0h 0m 0s");

    const timerRef = useRef(null);
    const todayRef = useRef(null);
    const activeCheckInRef = useRef(null);

    // ── timer ────────────────────────────────────────────────────────────
    const startTimer = useCallback(() => {
        if (timerRef.current) return;
        timerRef.current = setInterval(() => {
            setLiveDuration(
                computeLiveDuration(todayRef.current, true, activeCheckInRef.current)
            );
        }, 1000);
    }, []);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    useEffect(() => {
        todayRef.current = todayAttendance;
        activeCheckInRef.current = activeCheckIn;

        if (
            currentStatus === "CHECKED_IN" &&
            (activeCheckIn || todayAttendance?.oldestCheckIn)
        ) {
            setLiveDuration(computeLiveDuration(todayAttendance, true, activeCheckIn));
            startTimer();
        } else {
            stopTimer();
            setLiveDuration(computeLiveDuration(todayAttendance, false, null));
        }
    }, [currentStatus, todayAttendance, activeCheckIn, startTimer, stopTimer]);

    useEffect(() => () => stopTimer(), [stopTimer]);

    // ── refresh from local storage ─────────────────────────────────────
    const refreshAttendanceData = useCallback(async () => {
        try {
            const status = await fitterAttendanceService.getCurrentStatus();
            const history = await fitterAttendanceService.getAttendanceHistory();

            const today = new Date().toISOString().split("T")[0];
            const todayRecord = history.success
                ? history.data.find((r) => r.date === today) || null
                : null;

            setCurrentStatus(status);
            setTodayAttendance(todayRecord);
            setActiveCheckIn(
                status === "CHECKED_IN" ? fitterAttendanceService.openSessionCheckIn : null
            );
            if (history.success) setAttendanceHistory(history.data);

            const loc = await fitterLocationService.getCurrentLocation();
            if (loc) {
                setDistance(loc.distance);
                setIsInsideOffice(loc.isInside);
            }
        } catch (e) {
            console.error("[FitterAttendance] refresh error:", e);
        }
    }, []);

    useEffect(() => {
        const handleAttendanceUpdate = () => refreshAttendanceData();
        const handleLocationUpdate = (data) => {
            setDistance(data.distance);
            setIsInsideOffice(data.isInside);
        };

        eventEmitter.on("FITTER_ATTENDANCE_UPDATED", handleAttendanceUpdate);
        eventEmitter.on("FITTER_LOCATION_UPDATED", handleLocationUpdate);

        refreshAttendanceData();

        return () => {
            eventEmitter.off("FITTER_ATTENDANCE_UPDATED", handleAttendanceUpdate);
            eventEmitter.off("FITTER_LOCATION_UPDATED", handleLocationUpdate);
        };
    }, [refreshAttendanceData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        fitterAttendanceService.clearStatusCache();
        await refreshAttendanceData();
        setRefreshing(false);
    }, [refreshAttendanceData]);

    // ── derived ──────────────────────────────────────────────────────────
    const isCheckedIn = currentStatus === "CHECKED_IN";
    const statusColor = isCheckedIn ? GREEN : RED;
    const statusLabel = isCheckedIn ? "Checked In" : "Not In";

    const todayDisplayStatus = isCheckedIn
        ? "Present"
        : todayAttendance?.oldestCheckIn
            ? "Present"
            : "Absent";

    const sortedHistory = [...attendanceHistory].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    return (
        <SafeAreaView style={styles.safe} edges={["top"]}>
            <StatusBar barStyle="light-content" backgroundColor={NAVY} />
            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.eyebrow}>ATTENDANCE HUB</Text>
                    <Text style={styles.title}>My Dashboard</Text>
                    <Text style={styles.subtitle}>
                        Track attendance and office status
                    </Text>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <MaterialIcons name="access-time" size={22} color={ORANGE} />
                        <Text style={styles.statLabel}>Status</Text>
                        <Text style={[styles.statValue, { color: statusColor }]}>
                            {statusLabel}
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <MaterialIcons name="calendar-today" size={22} color={ORANGE} />
                        <Text style={styles.statLabel}>Today</Text>
                        <Text style={styles.statValue}>
                            {new Date().toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                            })}
                        </Text>
                    </View>
                    <View style={styles.statCard}>
                        <MaterialIcons
                            name={isInsideOffice ? "location-on" : "location-off"}
                            size={22}
                            color={isInsideOffice ? GREEN : ORANGE}
                        />
                        <Text style={styles.statLabel}>Distance</Text>
                        <Text style={styles.statValue}>{Math.round(distance)}m</Text>
                    </View>
                </View>

                <View style={styles.body}>
                    <Text style={styles.sectionTitle}>Today's Session</Text>

                    {todayAttendance ? (
                        <View style={styles.sessionCard}>
                            <View style={styles.sessionTopRow}>
                                <Text style={styles.sessionDate}>
                                    {todayAttendance.date}
                                </Text>
                                <View
                                    style={[
                                        styles.badge,
                                        { backgroundColor: isCheckedIn ? GREEN_LIGHT : RED_LIGHT },
                                    ]}
                                >
                                    <View
                                        style={[styles.badgeDot, { backgroundColor: statusColor }]}
                                    />
                                    <Text style={[styles.badgeText, { color: statusColor }]}>
                                        {statusLabel}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.timeBox}>
                                <MaterialIcons name="timer" size={20} color={ORANGE} />
                                <Text style={styles.timeBoxLabel}>
                                    {isCheckedIn ? "Time in office" : "Total duration"}
                                </Text>
                                <Text style={styles.timeBoxValue}>{liveDuration}</Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.detailRow}>
                                <View style={styles.detailLeft}>
                                    <MaterialIcons name="login" size={18} color="#6B7280" />
                                    <Text style={styles.detailLabel}>Check In</Text>
                                </View>
                                <Text style={styles.detailValue}>
                                    {isCheckedIn && activeCheckIn
                                        ? formatTime(activeCheckIn)
                                        : formatTime(todayAttendance.oldestCheckIn)}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <View style={styles.detailLeft}>
                                    <MaterialIcons
                                        name="logout"
                                        size={18}
                                        color={isCheckedIn ? "#D1D5DB" : "#6B7280"}
                                    />
                                    <Text style={styles.detailLabel}>Check Out</Text>
                                </View>
                                <Text
                                    style={[
                                        styles.detailValue,
                                        isCheckedIn && styles.detailValueMuted,
                                    ]}
                                >
                                    {isCheckedIn
                                        ? "Active session"
                                        : todayAttendance.latestCheckOut
                                            ? formatTime(todayAttendance.latestCheckOut)
                                            : "—"}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <View style={styles.detailLeft}>
                                    <MaterialIcons name="repeat" size={18} color="#6B7280" />
                                    <Text style={styles.detailLabel}>Sessions</Text>
                                </View>
                                <Text style={styles.detailValue}>
                                    {todayAttendance.totalSessions || 1}
                                </Text>
                            </View>
                            <View style={styles.detailRow}>
                                <View style={styles.detailLeft}>
                                    <MaterialIcons
                                        name="event-available"
                                        size={18}
                                        color="#6B7280"
                                    />
                                    <Text style={styles.detailLabel}>Day Status</Text>
                                </View>
                                <Text
                                    style={[
                                        styles.detailValue,
                                        {
                                            color:
                                                todayDisplayStatus === "Present" ? GREEN : RED,
                                        },
                                    ]}
                                >
                                    {todayDisplayStatus}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.emptyCard}>
                            <MaterialIcons name="event-busy" size={32} color="#D1D5DB" />
                            <Text style={styles.emptyText}>
                                No attendance recorded today
                            </Text>
                            <Text style={styles.emptySubText}>
                                Auto check-in activates when you enter the office
                            </Text>
                        </View>
                    )}

                    <View style={styles.infoBanner}>
                        <MaterialIcons name="gps-fixed" size={22} color={ORANGE} />
                        <Text style={styles.infoBannerText}>
                            Auto tracking active — checked in/out automatically as you
                            enter or leave the office. Re-entry triggers a new session.
                            Stored on this device only.
                        </Text>
                    </View>

                    {attendanceHistory.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Recent History</Text>
                            {sortedHistory.slice(0, visibleCount).map((record, idx) => {
                                const displayStatus = record.oldestCheckIn
                                    ? "Present"
                                    : record.status;
                                const isPresent = displayStatus === "Present";
                                return (
                                    <View key={idx} style={styles.historyRowCard}>
                                        <View style={styles.historyLeft}>
                                            <Text style={styles.historyDate}>
                                                {formatDate(record.date)}
                                            </Text>
                                            <Text style={styles.historyMeta}>
                                                {record.totalSessions || 1} session
                                                {(record.totalSessions || 1) !== 1 ? "s" : ""}
                                                {" · "}
                                                {formatTime(record.oldestCheckIn)}
                                                {record.latestCheckOut
                                                    ? ` – ${formatTime(record.latestCheckOut)}`
                                                    : " – ongoing"}
                                            </Text>
                                        </View>
                                        <View style={styles.historyRight}>
                                            <View
                                                style={[
                                                    styles.historyBadge,
                                                    {
                                                        backgroundColor: isPresent
                                                            ? GREEN_LIGHT
                                                            : RED_LIGHT,
                                                    },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.historyBadgeText,
                                                        { color: isPresent ? GREEN : RED },
                                                    ]}
                                                >
                                                    {displayStatus}
                                                </Text>
                                            </View>
                                            <Text style={styles.historyDuration}>
                                                {record.totalDurationFormatted || "0h 0m"}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}

                            {sortedHistory.length > visibleCount && (
                                <Text
                                    onPress={() => setVisibleCount((prev) => prev + 10)}
                                    style={styles.loadMoreText}
                                >
                                    Show More
                                </Text>
                            )}
                        </>
                    )}
                </View>

                <View style={{ height: 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: NAVY },
    scroll: { flex: 1, backgroundColor: "#F3F4F6" },
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
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        gap: 6,
    },
    badgeDot: { width: 7, height: 7, borderRadius: 4 },
    badgeText: { fontWeight: "700", fontSize: 12 },
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
    detailValueMuted: { color: "#9CA3AF" },
    emptyCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 28,
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    emptyText: { fontSize: 15, fontWeight: "600", color: "#6B7280", marginTop: 12 },
    emptySubText: { fontSize: 13, color: "#9CA3AF", marginTop: 6, textAlign: "center" },
    infoBanner: {
        flexDirection: "row",
        backgroundColor: ORANGE_LIGHT,
        borderRadius: 14,
        padding: 16,
        gap: 12,
        marginBottom: 20,
    },
    infoBannerText: { flex: 1, color: ORANGE, fontSize: 12.5, lineHeight: 18 },
    historyRowCard: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
    },
    historyLeft: { flex: 1, gap: 4 },
    historyDate: { fontSize: 14, fontWeight: "600", color: "#111827" },
    historyMeta: { fontSize: 12, color: "#9CA3AF" },
    historyRight: { alignItems: "flex-end", gap: 6 },
    historyBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
    historyBadgeText: { fontSize: 12, fontWeight: "600" },
    historyDuration: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
    loadMoreText: {
        color: ORANGE,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 4,
        marginBottom: 20,
    },
});