import { Stack } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";
import locationService from "../services/location.service";

export default function Layout() {
  useEffect(() => {
    // Initialize location service when app starts
    const initLocationService = async () => {
      try {
        console.log("Initializing location service...");
        await locationService.startTracking();
        console.log("Location service initialized successfully");
      } catch (error) {
        console.error("Failed to initialize location service:", error);
      }
    };
    
    initLocationService();
    
    // Handle app state changes
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // App came to foreground, restart tracking if needed
        console.log("App came to foreground");
        locationService.startTracking().catch(console.error);
      } else if (nextAppState === 'background') {
        console.log("App went to background");
        // Tracking continues in background
      }
    });
    
    // Cleanup on unmount
    return () => {
      subscription.remove();
      locationService.stopTracking();
    };
  }, []);
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}