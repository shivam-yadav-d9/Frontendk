// services/geofence.task.js
//
// MUST be imported at app root (_layout.jsx) before anything else.
// Runs in a SEPARATE JS context when app is closed.
// No React, no eventEmitter, no in-memory cache from attendanceService.

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as TaskManager from 'expo-task-manager';
import { MAX_DISTANCE, OFFICE_LOCATION, calculateDistance } from '../utils/location';
import attendanceService from './attendance.service';

export const BACKGROUND_LOCATION_TASK = 'BACKGROUND_LOCATION_TASK';

const BG_COOLDOWN_MS = 60_000; // 60s between check-in/out attempts

// ── Persist cooldown + last known inside state in AsyncStorage ───────────────
// Module-level vars reset every time bg task JS context restarts.
// AsyncStorage survives across firings.

async function getBgState() {
    try {
        const raw = await AsyncStorage.getItem('bgTaskState');
        if (!raw) return { lastCheckIn: 0, lastCheckOut: 0, wasInside: null };
        return JSON.parse(raw);
    } catch {
        return { lastCheckIn: 0, lastCheckOut: 0, wasInside: null };
    }
}

async function setBgState(state) {
    try {
        await AsyncStorage.setItem('bgTaskState', JSON.stringify(state));
    } catch { }
}

TaskManager.defineTask(BACKGROUND_LOCATION_TASK, async ({ data, error }) => {
    if (error) {
        console.error('[BgTask] Error:', error.message);
        return;
    }
    if (!data?.locations?.length) return;

    const location = data.locations[0];
    if (!location) return;

    const { latitude, longitude } = location.coords;
    const now = Date.now();

    // ── Guard: need a logged-in user ─────────────────────────────────────────
    let employeeNumber;
    try {
        const raw = await AsyncStorage.getItem('userData');
        if (!raw) { console.log('[BgTask] No user — skipping'); return; }
        employeeNumber = JSON.parse(raw).employeeNumber;
        if (!employeeNumber) return;
    } catch (e) {
        console.error('[BgTask] Could not read userData:', e);
        return;
    }

    // ── Geofence check ────────────────────────────────────────────────────────
    const distance = calculateDistance(
        latitude, longitude,
        OFFICE_LOCATION.latitude, OFFICE_LOCATION.longitude
    );
    const isInside = distance <= MAX_DISTANCE;

    console.log(`[BgTask] dist=${Math.round(distance)}m inside=${isInside}`);

    // ── Read persisted state ──────────────────────────────────────────────────
    const bgState = await getBgState();

    // ── Always update last known location for UI ──────────────────────────────
    try {
        await AsyncStorage.setItem('lastLocation', JSON.stringify({
            latitude,
            longitude,
            distance: Math.round(distance),
            isInside,
            timestamp: new Date().toISOString(),
        }));
    } catch { }

    // ── Fetch current status from API (cache is empty in bg context) ──────────
    let isCheckedIn = false;
    try {
        const history = await attendanceService.getAttendanceHistory(employeeNumber);

        // ── Stale session recovery ────────────────────────────────────────────
        // If today's open session has a checkIn from a previous day, close it.
        if (history.success && history.data?.length) {
            const today = new Date().toISOString().split('T')[0];
            const todayRecord = history.data.find(r => r.date === today);

            if (todayRecord?.oldestCheckIn && !todayRecord?.latestCheckOut) {
                const checkInDate = new Date(todayRecord.oldestCheckIn)
                    .toISOString().split('T')[0];

                if (checkInDate !== today) {
                    console.log('[BgTask] Stale session detected — recovering');
                    await attendanceService.checkOut(employeeNumber, latitude, longitude);

                    if (isInside) {
                        const checkin = await attendanceService.checkIn(
                            employeeNumber, latitude, longitude
                        );
                        console.log('[BgTask] Fresh check-in after recovery:', checkin.success);
                        await AsyncStorage.setItem('lastAutoAction', JSON.stringify({
                            action: 'CHECK_IN',
                            timestamp: new Date().toISOString(),
                            message: 'Auto checked in (session recovery)',
                        }));
                        await setBgState({ ...bgState, lastCheckIn: now, wasInside: true });
                    } else {
                        await setBgState({ ...bgState, wasInside: false });
                    }
                    return;
                }
            }
        }

        // ── Derive current check-in status directly from history ──────────────
        // Do NOT use attendanceService._deriveStatus() — it relies on
        // in-memory openSessionCheckIn which is always null in bg context.
        if (history.success && history.data?.length) {
            const today = new Date().toISOString().split('T')[0];
            const todayRecord = history.data.find(r => r.date === today);

            if (todayRecord) {
                if (todayRecord.status === 'OPEN') {
                    isCheckedIn = true;
                } else if (todayRecord.oldestCheckIn && !todayRecord.latestCheckOut) {
                    isCheckedIn = true;
                } else {
                    isCheckedIn = false;
                }
            }
        }

        console.log(`[BgTask] isCheckedIn=${isCheckedIn} wasInside=${bgState.wasInside}`);

    } catch (e) {
        console.error('[BgTask] Could not get status:', e);
        return;
    }

    // ── AUTO CHECK-IN ─────────────────────────────────────────────────────────
    // Trigger on: inside + not checked in + cooldown passed
    if (isInside && !isCheckedIn) {
        if ((now - bgState.lastCheckIn) < BG_COOLDOWN_MS) {
            const remaining = Math.round((BG_COOLDOWN_MS - (now - bgState.lastCheckIn)) / 1000);
            console.log(`[BgTask] Check-in cooldown — ${remaining}s left`);
            return;
        }

        console.log('[BgTask] AUTO CHECK-IN triggered');
        try {
            const result = await attendanceService.checkIn(employeeNumber, latitude, longitude);
            console.log('[BgTask] Check-in:', result.success, result.message);

            if (result.success || result.alreadyCheckedIn) {
                await AsyncStorage.setItem('lastAutoAction', JSON.stringify({
                    action: 'CHECK_IN',
                    timestamp: new Date().toISOString(),
                    message: result.message || 'Checked in automatically',
                }));
                await setBgState({ ...bgState, lastCheckIn: now, wasInside: true });
            }
        } catch (e) {
            console.error('[BgTask] Check-in error:', e);
        }
        return;
    }

    // ── AUTO CHECK-OUT ────────────────────────────────────────────────────────
    // Trigger on: outside + checked in + cooldown passed
    if (!isInside && isCheckedIn) {
        if ((now - bgState.lastCheckOut) < BG_COOLDOWN_MS) {
            const remaining = Math.round((BG_COOLDOWN_MS - (now - bgState.lastCheckOut)) / 1000);
            console.log(`[BgTask] Check-out cooldown — ${remaining}s left`);
            return;
        }

        console.log('[BgTask] AUTO CHECK-OUT triggered');
        try {
            const result = await attendanceService.checkOut(employeeNumber, latitude, longitude);
            console.log('[BgTask] Check-out:', result.success, result.message);

            if (result.success) {
                await AsyncStorage.setItem('lastAutoAction', JSON.stringify({
                    action: 'CHECK_OUT',
                    timestamp: new Date().toISOString(),
                    message: result.message || 'Checked out automatically',
                    duration: result.data?.attendance?.durationMinutes || 0,
                }));
                await setBgState({ ...bgState, lastCheckOut: now, wasInside: false });
            }
        } catch (e) {
            console.error('[BgTask] Check-out error:', e);
        }
        return;
    }

    // No action needed — update wasInside
    await setBgState({ ...bgState, wasInside: isInside });
    console.log(`[BgTask] No action (inside=${isInside}, checkedIn=${isCheckedIn})`);
});