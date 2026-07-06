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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const GREEN = "#0B2540";
const GREEN_LIGHT = "#E7F6EF";

const EMPLOYEE_INFO = [
    { label: "Employee ID", value: "FT12345" },
    { label: "Phone", value: "+91 98765 43210" },
    { label: "Email", value: "fitter@example.com" },
    { label: "Joined On", value: "01 Jan 2024" },
];

const SETTINGS = [
    { icon: "lock", label: "Change Password" },
    { icon: "settings", label: "App Settings" },
];

export default function Profile() {
    const handleLogout = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    try {
                        try {
                            const locationService =
                                require("../../services/location.service").default;

                            locationService?.stopTracking?.();
                        } catch (e) { }

                        await AsyncStorage.clear();

                        router.dismissAll();
                        router.replace("/");

                    } catch (error) {
                        console.log(error);
                    }
                }
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={GREEN} />

            <View style={styles.header}>
                <MaterialIcons name="menu" size={24} color="#fff" />
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.body} contentContainerStyle={{ padding: 16 }}>
                <View style={styles.card}>
                    <View style={styles.avatarCircle}>
                        <MaterialIcons name="person" size={36} color={GREEN} />
                    </View>
                    <Text style={styles.name}>Fitter User</Text>
                    <Text style={styles.role}>Fitter</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>FITTER</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Employee Information</Text>
                <View style={styles.card}>
                    {EMPLOYEE_INFO.map((item, idx) => (
                        <View
                            key={item.label}
                            style={[
                                styles.infoRow,
                                idx !== EMPLOYEE_INFO.length - 1 && styles.rowBorder,
                            ]}
                        >
                            <Text style={styles.infoLabel}>{item.label}</Text>
                            <Text style={styles.infoValue}>{item.value}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Settings</Text>
                <View style={styles.card}>
                    {SETTINGS.map((item, idx) => (
                        <TouchableOpacity
                            key={item.label}
                            style={[
                                styles.settingsRow,
                                idx !== SETTINGS.length - 1 && styles.rowBorder,
                            ]}
                        >
                            <MaterialIcons name={item.icon} size={20} color={GREEN} />
                            <Text style={styles.settingsLabel}>{item.label}</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <MaterialIcons name="logout" size={18} color="#DC2626" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: GREEN },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: GREEN,
    },
    headerTitle: { color: "#fff", fontSize: 18, fontWeight: "700" },
    body: { flex: 1, backgroundColor: "#F3F4F6" },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    avatarCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: GREEN_LIGHT,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 10,
    },
    name: { fontSize: 17, fontWeight: "700", color: "#111827", textAlign: "center" },
    role: { fontSize: 13, color: "#9CA3AF", textAlign: "center", marginTop: 2 },
    badge: {
        alignSelf: "center",
        backgroundColor: GREEN_LIGHT,
        borderRadius: 20,
        paddingHorizontal: 14,
        paddingVertical: 4,
        marginTop: 10,
    },
    badgeText: { color: GREEN, fontSize: 11, fontWeight: "700" },
    sectionTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
    },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
    infoLabel: { fontSize: 13, color: "#9CA3AF" },
    infoValue: { fontSize: 13, color: "#111827", fontWeight: "600" },
    settingsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 14,
    },
    settingsLabel: { flex: 1, fontSize: 13, color: "#374151" },
    logoutButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderWidth: 1.5,
        borderColor: "#DC2626",
        borderRadius: 12,
        paddingVertical: 14,
        marginBottom: 24,
    },
    logoutText: { color: "#DC2626", fontWeight: "700", fontSize: 14 },
});