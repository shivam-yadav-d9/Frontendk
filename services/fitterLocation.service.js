// services/fitterLocation.service.js
//
// Foreground geofence tracker for the Fitter role.
// Same geofence math as the staff app (OFFICE_LOCATION / MAX_DISTANCE /
// calculateDistance from utils/location) but drives fitterAttendance.service
// (local AsyncStorage) instead of the real API, and emits its OWN event
// names so it never collides with the staff location.service.

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { Alert, AppState } from "react-native";
import { MAX_DISTANCE, OFFICE_LOCATION, calculateDistance } from "../utils/location";
import eventEmitter from "./eventEmitter";
import fitterAttendanceService from "./fitterAttendance.service";

const LAST_LOCATION_KEY = "fitterLastLocation";

class FitterLocationService {
    constructor() {
        this.locationSubscription = null;
        this.appStateSubscription = null;
        this.isTracking = false;
        this.appState = AppState.currentState;
        this.isProcessing = false;
        this.lastCheckInTime = 0;
        this.lastCheckOutTime = 0;
        this.CHECK_IN_COOLDOWN = 30_000;
        this.CHECK_OUT_COOLDOWN = 30_000;
        this.wasInsideOffice = null;
    }

    async _requestPermissions() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission Required",
                "Please allow location access for attendance tracking."
            );
            return false;
        }
        return true;
    }

    // ── Start / stop ─────────────────────────────────────────────────────
    async startTracking() {
        if (this.isTracking) {
            console.log("[FitterLocation] Already tracking");
            return true;
        }

        const permOk = await this._requestPermissions();
        if (!permOk) return false;

        try {
            this.locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 3000,
                    distanceInterval: 5,
                },
                this.handleLocationUpdate.bind(this)
            );

            this.isTracking = true;
            this.appStateSubscription = AppState.addEventListener(
                "change",
                this.handleAppStateChange.bind(this)
            );

            await this.getCurrentLocation();
            console.log("[FitterLocation] Tracking started");
            return true;
        } catch (e) {
            console.error("[FitterLocation] Failed to start:", e);
            this.isTracking = false;
            return false;
        }
    }

    stopTracking() {
        if (this.locationSubscription) {
            this.locationSubscription.remove();
            this.locationSubscription = null;
        }
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = null;
        }
        this.isTracking = false;
        console.log("[FitterLocation] Tracking stopped");
    }

    // ── Foreground location handler ─────────────────────────────────────
    async handleLocationUpdate(location) {
        const distance = calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            OFFICE_LOCATION.latitude,
            OFFICE_LOCATION.longitude
        );
        const isInside = distance <= MAX_DISTANCE;

        eventEmitter.emit("FITTER_LOCATION_UPDATED", {
            distance: Math.round(distance),
            isInside,
            timestamp: new Date().toISOString(),
        });

        await AsyncStorage.setItem(
            LAST_LOCATION_KEY,
            JSON.stringify({
                distance: Math.round(distance),
                isInside,
                timestamp: new Date().toISOString(),
            })
        );

        if (this.isProcessing) return;
        this.isProcessing = true;

        try {
            const now = Date.now();
            const status = await fitterAttendanceService.getCurrentStatus();
            const isCheckedIn = status === "CHECKED_IN";

            console.log(
                `[FitterLocation] dist=${Math.round(distance)}m inside=${isInside} checkedIn=${isCheckedIn}`
            );

            if (
                isInside &&
                !isCheckedIn &&
                now - this.lastCheckInTime > this.CHECK_IN_COOLDOWN
            ) {
                this.lastCheckInTime = now;
                const result = await fitterAttendanceService.checkIn(
                    location.coords.latitude,
                    location.coords.longitude
                );
                if (result.success) {
                    if (AppState.currentState === "active" && !result.alreadyCheckedIn) {
                        Alert.alert(
                            "Auto Check-In ✓",
                            `Checked in at ${new Date().toLocaleTimeString()}`
                        );
                    }
                    eventEmitter.emit("FITTER_ATTENDANCE_UPDATED");
                }
            } else if (
                !isInside &&
                isCheckedIn &&
                now - this.lastCheckOutTime > this.CHECK_OUT_COOLDOWN
            ) {
                this.lastCheckOutTime = now;
                const result = await fitterAttendanceService.checkOut(
                    location.coords.latitude,
                    location.coords.longitude
                );
                if (result.success) {
                    if (AppState.currentState === "active") {
                        const mins = result.data?.attendance?.durationMinutes || 0;
                        Alert.alert(
                            "Auto Check-Out ✓",
                            `Checked out. Duration: ${Math.floor(mins / 60)}h ${mins % 60}m`
                        );
                    }
                    eventEmitter.emit("FITTER_ATTENDANCE_UPDATED");
                }
            }

            this.wasInsideOffice = isInside;
        } catch (e) {
            console.error("[FitterLocation] Error handling update:", e);
        } finally {
            this.isProcessing = false;
        }
    }

    handleAppStateChange(nextAppState) {
        if (
            this.appState.match(/inactive|background/) &&
            nextAppState === "active"
        ) {
            console.log("[FitterLocation] App foregrounded — refreshing");
            fitterAttendanceService.clearStatusCache();
            eventEmitter.emit("FITTER_ATTENDANCE_UPDATED");
            this.getCurrentLocation();
        }
        this.appState = nextAppState;
    }

    async getCurrentLocation() {
        try {
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status !== "granted") return null;

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const distance = calculateDistance(
                location.coords.latitude,
                location.coords.longitude,
                OFFICE_LOCATION.latitude,
                OFFICE_LOCATION.longitude
            );

            const result = {
                distance: Math.round(distance),
                isInside: distance <= MAX_DISTANCE,
                timestamp: new Date().toISOString(),
            };

            eventEmitter.emit("FITTER_LOCATION_UPDATED", result);
            await AsyncStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(result));

            return result;
        } catch (e) {
            console.error("[FitterLocation] getCurrentLocation error:", e);
            return null;
        }
    }
}

export default new FitterLocationService();