import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import fitterLocationService from "../../services/fitterLocation.service";

export default function FitterLayout() {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    fitterLocationService.startTracking();

    return () => {
      fitterLocationService.stopTracking();
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0F7A5C",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="attendance"
        options={{
          title: "Attendance",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="how-to-reg" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="assignment" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}