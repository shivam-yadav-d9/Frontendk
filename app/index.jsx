import { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  StatusBar,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("staff");

  const login = () => {
    if (
      email === "shivam.yadav@hometown.in" &&
      password === "staff123"
    ) {
      Alert.alert("Success", "Login Successful");

      router.replace("/(tabs)/home");
    } else {
      Alert.alert("Login Failed", "Invalid Email or Password");
    }
  };

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
          Access attendance, learning, assignments and targets.
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
            <Text style={[styles.toggleText, role === "staff" && styles.toggleTextActive]}>
              Staff
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, role === "manager" && styles.toggleActive]}
            onPress={() => setRole("manager")}
          >
            <MaterialIcons
              name="work-outline"
              size={17}
              color={role === "manager" ? "#fff" : "#555"}
            />
            <Text style={[styles.toggleText, role === "manager" && styles.toggleTextActive]}>
              Manager
            </Text>
          </TouchableOpacity>
        </View>

        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={20} color="#D96A17" />
          <TextInput
            placeholder={role === "staff" ? "staff@hometown.com" : "manager@hometown.com"}
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

        {/* Login Button */}
        <TouchableOpacity style={styles.loginBtn} onPress={login}>
          <Text style={styles.loginText}>Open Staff Dashboard →</Text>
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
          <Text style={styles.policy}> Secure Login • Terms of Service • Privacy Policy</Text>
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

  loginBtn: {
    backgroundColor: "#D96A17",
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
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