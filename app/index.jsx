import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  MAX_DISTANCE,
  OFFICE_LOCATION,
  calculateDistance,
} from "../utils/location";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("staff");
  const [checking, setChecking] = useState(false);
  useEffect(() => {
  checkExistingLogin();
}, []);

const checkExistingLogin = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");

    if (token) {
      router.replace("/(tabs)/home");
    }
  } catch (error) {
    console.log(error);
  }
};

  // ─── Auto-login when user re-enters office range ───────────────────────────
  useEffect(() => {
    let subscription;

    const startWatching = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") return;

      const saved = await AsyncStorage.getItem("savedCredentials");
      if (!saved) return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 5,
        },
        async (location) => {
          const dist = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            OFFICE_LOCATION.latitude,
            OFFICE_LOCATION.longitude
          );

          if (dist <= MAX_DISTANCE) {
            try {
              const { email: savedEmail, password: savedPassword } =
                JSON.parse(saved);

              // Validate saved credentials (update these to match your real staff credentials)
              if (
                savedEmail !== "shivam.yadav@hometown.in" ||
                savedPassword !== "staff123"
              ) {
                return;
              }

              await AsyncStorage.setItem("userToken", "logged_in");
              if (subscription) subscription.remove();
              router.replace("/(tabs)/home");
            } catch (e) {
              console.log("Auto login error:", e);
            }
          }
        }
      );
    };

    startWatching();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  // ─── Manual Login ──────────────────────────────────────────────────────────
  const login = async () => {
    // 1. Validate credentials
    const validEmail =
      role === "staff"
        ? "shivam.yadav@hometown.in"
        : "manager@hometown.in";
    const validPassword = role === "staff" ? "staff123" : "manager123";

    if (email !== validEmail || password !== validPassword) {
      Alert.alert("Login Failed", "Invalid Email or Password");
      return;
    }

    // 2. Request foreground location permission
    const { status: fgStatus } =
      await Location.requestForegroundPermissionsAsync();
    if (fgStatus !== "granted") {
      Alert.alert("Permission Required", "Please allow location access.");
      return;
    }

    // 3. Request background location permission
    const { status: bgStatus } =
      await Location.requestBackgroundPermissionsAsync();
    if (bgStatus !== "granted") {
      Alert.alert(
        "Background Location Required",
        "Please select 'Always Allow' for location to enable auto login/logout."
      );
      return;
    }

    // 4. Get current location and verify office range
    try {
      setChecking(true);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        OFFICE_LOCATION.latitude,
        OFFICE_LOCATION.longitude
      );

      console.log("Distance from office:", distance, "m");

      if (distance > MAX_DISTANCE) {
        Alert.alert(
          "Access Denied",
          `You are ${Math.round(distance)} meters away from the office. Please be on-site to log in.`
        );
        setChecking(false);
        return;
      }

      // 5. Save credentials & token, then navigate
      await AsyncStorage.setItem(
        "savedCredentials",
        JSON.stringify({ email, password })
      );
      await AsyncStorage.setItem("userToken", "logged_in");

      Alert.alert("Success", "Login Successful");
      router.replace("/(tabs)/home");
    } catch (error) {
      console.log(error);
      Alert.alert("Location Error", "Unable to get current location.");
    } finally {
      setChecking(false);
    }
  };

  // ─── UI ────────────────────────────────────────────────────────────────────
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle="light-content" />

      {/* Logo + Brand */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.brand}>
          <Text style={styles.brandHome}>Home</Text>
          <Text style={styles.brandTown}>Town</Text>
          <Text style={styles.brandOnTrack}> OnTrack</Text>
        </Text>

        <View style={styles.tagPill}>
          <MaterialIcons name="auto-awesome" size={13} color="#fff" />
          <Text style={styles.tag}> Smart Retail Workforce Platform</Text>
        </View>
      </View>

      {/* Card */}
      <View style={styles.card}>

        {/* Person icon top-right */}
        <View style={styles.personIconWrapper}>
          <MaterialIcons name="person-outline" size={24} color="#D96A17" />
        </View>

        <Text style={styles.portal}>TEAM PORTAL</Text>
        <Text style={styles.heading}>Staff Login</Text>
        <Text style={styles.subHeading}>
          {checking
            ? "Verifying your location…"
            : "Access attendance, learning, assignments and targets."}
        </Text>

        {/* Role Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, role === "staff" && styles.toggleActive]}
            onPress={() => setRole("staff")}
          >
            <MaterialIcons
              name="person"
              size={17}
              color={role === "staff" ? "#fff" : "#555"}
            />
            <Text
              style={[
                styles.toggleText,
                role === "staff" && styles.toggleTextActive,
              ]}
            >
              Staff
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toggleBtn,
              role === "manager" && styles.toggleActive,
            ]}
            onPress={() => setRole("manager")}
          >
            <MaterialIcons
              name="work-outline"
              size={17}
              color={role === "manager" ? "#fff" : "#555"}
            />
            <Text
              style={[
                styles.toggleText,
                role === "manager" && styles.toggleTextActive,
              ]}
            >
              Manager
            </Text>
          </TouchableOpacity>
        </View>

        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#D96A17" />
          <TextInput
            placeholder={
              role === "staff"
                ? "staff@hometown.com"
                : "manager@hometown.com"
            }
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="lock-outline" size={20} color="#D96A17" />
          <TextInput
            placeholder="Enter Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={20}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        {/* Location notice */}
        <View style={styles.locationNote}>
          <MaterialIcons name="location-on" size={14} color="#D96A17" />
          <Text style={styles.locationText}>
            Location verification required at office premises
          </Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginBtn, checking && styles.loginBtnDisabled]}
          onPress={login}
          disabled={checking}
        >
          <Text style={styles.loginText}>
            {checking ? "Verifying Location…" : "Open Staff Dashboard →"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Use your assigned HomeTown staff account.
        </Text>
      </View>

      {/* Bottom */}
      <View style={styles.bottom}>
        <Text style={styles.bottomTitle}>
          <Text style={styles.brandHome}>Home</Text>
          <Text style={styles.brandTown}>Town</Text>
          <Text style={{ color: "#fff" }}> OnTrack Workforce App</Text>
        </Text>

        <Text style={styles.website}>Visit hometown.in</Text>

        <View style={styles.policyRow}>
          <MaterialIcons name="security" size={12} color="#D96A17" />
          <Text style={styles.policy}>
            {" "}
            Secure Login • Terms of Service • Privacy Policy
          </Text>
        </View>

        <Text style={styles.quote}>
          "Empowering every store team to learn, perform and grow."
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#5C2D0C",
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: "center",
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 14,
  },

  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },

  brand: {
    fontSize: 28,
    fontWeight: "900",
    marginTop: 8,
  },
  brandHome: { color: "#fff" },
  brandTown: { color: "#D96A17" },
  brandOnTrack: { color: "#F5C87A" },

  tagPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6D3B16",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 7,
  },

  tag: {
    color: "#fff",
    fontSize: 11,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 18,
  },

  personIconWrapper: {
    position: "absolute",
    top: 18,
    right: 18,
    backgroundColor: "#FFF0E6",
    borderRadius: 12,
    padding: 9,
  },

  portal: {
    color: "#D96A17",
    fontWeight: "700",
    fontSize: 10,
    letterSpacing: 1.5,
  },

  heading: {
    fontSize: 28,
    fontWeight: "900",
    color: "#3A2415",
    marginTop: 3,
  },

  subHeading: {
    color: "#777",
    marginTop: 2,
    marginBottom: 10,
    fontSize: 12,
  },

  toggleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 2,
  },

  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#F5EDE5",
  },

  toggleActive: {
    backgroundColor: "#D96A17",
    borderColor: "#D96A17",
  },

  toggleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
  },

  toggleTextActive: {
    color: "#fff",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
    color: "#3A2415",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: "#FAFAFA",
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },

  locationNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4EC",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginTop: 12,
    gap: 6,
  },

  locationText: {
    fontSize: 11,
    color: "#D96A17",
    fontWeight: "500",
    flex: 1,
  },

  loginBtn: {
    backgroundColor: "#D96A17",
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },

  loginBtnDisabled: {
    backgroundColor: "#E8A97A",
  },

  loginText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  footerText: {
    textAlign: "center",
    color: "#888",
    marginTop: 10,
    fontSize: 11,
  },

  bottom: {
    marginTop: 14,
    alignItems: "center",
    gap: 4,
  },

  bottomTitle: {
    fontSize: 13,
    fontWeight: "700",
  },

  website: {
    color: "#fff",
    textDecorationLine: "underline",
    fontSize: 12,
  },

  policyRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  policy: {
    color: "#ddd",
    fontSize: 10,
  },

  quote: {
    color: "#bbb",
    fontSize: 10,
    fontStyle: "italic",
    textAlign: "center",
  },
});