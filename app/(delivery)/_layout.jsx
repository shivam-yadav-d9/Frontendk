import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import deliveryLocationService from "../../services/deliveryLocation.service";

export default function DeliveryLayout() {
    const startedRef = useRef(false);

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;
        deliveryLocationService.startTracking();

        return () => {
            deliveryLocationService.stopTracking();
        };
    }, []);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#1565C0",
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
                name="schedule"
                options={{
                    title: "Schedule",
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="local-shipping" color={color} size={size} />
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