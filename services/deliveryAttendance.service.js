// services/deliveryAttendance.service.js
//
// Local-only "attendance backend" for the Delivery role.
// Mirrors the shape of the real attendanceService (checkIn/checkOut/
// getCurrentStatus/getAttendanceHistory) but never calls an API —
// everything is persisted in AsyncStorage on-device.

import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "deliveryAttendanceHistory";
export const STATUS_CACHE_TTL = 5000;

class DeliveryAttendanceService {
    constructor() {
        this.statusCache = null;
        this.statusCacheTime = 0;
        this.openSessionCheckIn = null;
        this.STATUS_CACHE_TTL = STATUS_CACHE_TTL;
    }

    _todayStr() {
        return new Date().toISOString().split("T")[0];
    }

    async _readHistory() {
        try {
            const raw = await AsyncStorage.getItem(HISTORY_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error("[DeliveryAttendance] read error:", e);
            return [];
        }
    }

    async _writeHistory(history) {
        try {
            await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            console.error("[DeliveryAttendance] write error:", e);
        }
    }

    // ── Status ────────────────────────────────────────────────────────────
    async getCurrentStatus() {
        const history = await this._readHistory();
        const today = this._todayStr();
        const todayRecord = history.find((r) => r.date === today);

        const isOpen =
            !!todayRecord && !!todayRecord.oldestCheckIn && !todayRecord.latestCheckOut;

        const status = isOpen ? "CHECKED_IN" : "CHECKED_OUT";

        this.statusCache = status;
        this.statusCacheTime = Date.now();
        this.openSessionCheckIn = isOpen ? todayRecord.oldestCheckIn : null;

        return status;
    }

    clearStatusCache() {
        this.statusCache = null;
        this.statusCacheTime = 0;
    }

    async clearAll() {
        this.clearStatusCache();
        this.openSessionCheckIn = null;
    }

    isOpenSessionStale() {
        if (!this.openSessionCheckIn) return false;
        const checkInDate = new Date(this.openSessionCheckIn)
            .toISOString()
            .split("T")[0];
        return checkInDate !== this._todayStr();
    }

    // ── History ──────────────────────────────────────────────────────────
    async getAttendanceHistory() {
        const history = await this._readHistory();
        return { success: true, data: history };
    }

    // ── Check-in ─────────────────────────────────────────────────────────
    async checkIn(latitude, longitude) {
        const history = await this._readHistory();
        const today = this._todayStr();
        let record = history.find((r) => r.date === today);

        if (record && record.oldestCheckIn && !record.latestCheckOut) {
            return {
                success: true,
                message: "Already checked in",
                alreadyCheckedIn: true,
            };
        }

        const nowISO = new Date().toISOString();

        if (!record) {
            record = {
                date: today,
                oldestCheckIn: nowISO,
                latestCheckOut: null,
                totalDurationMinutes: 0,
                totalSessions: 1,
                totalDurationFormatted: "0h 0m",
                status: "OPEN",
                lastLat: latitude,
                lastLng: longitude,
            };
            history.push(record);
        } else {
            record.oldestCheckIn = nowISO;
            record.latestCheckOut = null;
            record.totalSessions = (record.totalSessions || 0) + 1;
            record.lastLat = latitude;
            record.lastLng = longitude;
        }

        await this._writeHistory(history);

        this.statusCache = "CHECKED_IN";
        this.statusCacheTime = Date.now();
        this.openSessionCheckIn = nowISO;

        return { success: true, message: "Checked in successfully" };
    }

    // ── Check-out ────────────────────────────────────────────────────────
    async checkOut(latitude, longitude) {
        const history = await this._readHistory();
        const today = this._todayStr();
        const record = history.find((r) => r.date === today);

        if (!record || !record.oldestCheckIn || record.latestCheckOut) {
            return { success: false, message: "No active session to check out" };
        }

        const nowISO = new Date().toISOString();
        const durationMs =
            new Date(nowISO).getTime() - new Date(record.oldestCheckIn).getTime();
        const sessionMinutes = Math.max(0, Math.round(durationMs / 60000));

        record.latestCheckOut = nowISO;
        record.totalDurationMinutes =
            (record.totalDurationMinutes || 0) + sessionMinutes;
        record.totalDurationFormatted = `${Math.floor(
            record.totalDurationMinutes / 60
        )}h ${record.totalDurationMinutes % 60}m`;
        record.status = "CLOSED";

        await this._writeHistory(history);

        this.statusCache = "CHECKED_OUT";
        this.statusCacheTime = Date.now();
        this.openSessionCheckIn = null;

        return {
            success: true,
            message: "Checked out successfully",
            data: { attendance: { durationMinutes: sessionMinutes } },
        };
    }
}

export default new DeliveryAttendanceService();