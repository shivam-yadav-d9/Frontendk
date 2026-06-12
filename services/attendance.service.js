import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

class AttendanceService {
    constructor() {
        this.statusCache = null;       // 'CHECKED_IN' | 'CHECKED_OUT'
        this.statusCacheTime = 0;
        this.STATUS_CACHE_TTL = 20000; // 20 seconds
    }

    setStatusCache(status) {
        this.statusCache = status;
        this.statusCacheTime = Date.now();
        console.log(`[AttendanceService] Status cache set: ${status}`);
    }

    clearStatusCache() {
        this.statusCache = null;
        this.statusCacheTime = 0;
        console.log('[AttendanceService] Status cache cleared');
    }

    async getEmployeeId() {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                return user.employeeNumber || user._id;
            }
            return null;
        } catch (error) {
            console.error('[AttendanceService] Error getting employee ID:', error);
            return null;
        }
    }

    async checkIn(employeeNumber, lat, lng) {
        try {
            console.log(`[AttendanceService] Checking in ${employeeNumber} at (${lat}, ${lng})`);

            // FIX: API expects "lang" not "lng"
            const response = await api.post('/ontrack/attendance/check-in', {
                employeeId: employeeNumber,
                lat: lat.toString(),
                lang: lng.toString(),
            });

            console.log('[AttendanceService] Check-in response:', response);

            if (response.data?.action === 'ALREADY_CHECKED_IN') {
                console.log('[AttendanceService] Already checked in');
                this.setStatusCache('CHECKED_IN');
                return {
                    success: true,
                    data: response.data,
                    message: 'Already checked in',
                    alreadyCheckedIn: true,
                };
            }

            if (response.success) {
                this.setStatusCache('CHECKED_IN');
            }

            return {
                success: response.success,
                data: response.data,
                message: response.message,
            };
        } catch (error) {
            console.error('[AttendanceService] Check-in error:', error);
            return {
                success: false,
                message: error.message || 'Check-in failed',
            };
        }
    }

    async checkOut(employeeNumber, lat, lng) {
        try {
            console.log(`[AttendanceService] Checking out ${employeeNumber} at (${lat}, ${lng})`);

            // FIX: API expects "lang" not "lng"
            const response = await api.post('/ontrack/attendance/check-out', {
                employeeId: employeeNumber,
                lat: lat.toString(),
                lang: lng.toString(),
            });

            console.log('[AttendanceService] Check-out response:', response);

            if (response.success) {
                this.setStatusCache('CHECKED_OUT');
            }

            return {
                success: response.success,
                data: response.data,
                message: response.message,
            };
        } catch (error) {
            console.error('[AttendanceService] Check-out error:', error);
            return {
                success: false,
                message: error.message || 'Check-out failed',
            };
        }
    }

    async getAttendanceHistory(employeeNumber) {
        try {
            console.log(`[AttendanceService] Fetching history for ${employeeNumber}`);
            const response = await api.get(`/ontrack/attendance/${employeeNumber}`);
            return {
                success: response.success,
                data: response.data || [],
                message: response.message,
            };
        } catch (error) {
            console.error('[AttendanceService] Get attendance error:', error);
            return {
                success: false,
                data: [],
                message: error.message || 'Failed to fetch attendance',
            };
        }
    }

    async getTodayAttendance(employeeNumber) {
        try {
            const history = await this.getAttendanceHistory(employeeNumber);
            if (history.success && history.data.length > 0) {
                const today = new Date().toISOString().split('T')[0];
                return history.data.find(a => a.date === today) || null;
            }
            return null;
        } catch (error) {
            console.error('[AttendanceService] Get today attendance error:', error);
            return null;
        }
    }

    async getCurrentStatus(employeeNumber) {
        try {
            // Return cached status if still fresh
            if (
                this.statusCache !== null &&
                (Date.now() - this.statusCacheTime) < this.STATUS_CACHE_TTL
            ) {
                console.log(`[AttendanceService] Status: ${this.statusCache} (cached)`);
                return this.statusCache;
            }

            const history = await this.getAttendanceHistory(employeeNumber);

            if (!history.success || !history.data?.length) {
                console.log('[AttendanceService] Status: CHECKED_OUT (no data)');
                return 'CHECKED_OUT';
            }

            const today = new Date().toISOString().split('T')[0];
            const todayRecord = history.data.find(item => item.date === today);

            if (!todayRecord) {
                console.log('[AttendanceService] Status: CHECKED_OUT (no today record)');
                return 'CHECKED_OUT';
            }

            console.log('[AttendanceService] Today record:', JSON.stringify(todayRecord));

            // Session is explicitly open
            if (todayRecord.status === 'OPEN') {
                console.log('[AttendanceService] Status: CHECKED_IN (OPEN session)');
                return 'CHECKED_IN';
            }

            // Has check-in but no check-out in summary
            if (todayRecord.oldestCheckIn && !todayRecord.latestCheckOut) {
                console.log('[AttendanceService] Status: CHECKED_IN (no checkout yet)');
                return 'CHECKED_IN';
            }

            console.log('[AttendanceService] Status: CHECKED_OUT');
            return 'CHECKED_OUT';

        } catch (error) {
            console.error('[AttendanceService] Get current status error:', error);
            return 'UNKNOWN';
        }
    }

    async getLastSevenDaysAttendance(employeeNumber) {
        try {
            const history = await this.getAttendanceHistory(employeeNumber);
            if (history.success) {
                return history.data.slice(0, 7);
            }
            return [];
        } catch (error) {
            console.error('[AttendanceService] Get last 7 days error:', error);
            return [];
        }
    }

    async getMonthlySummary(employeeNumber, year, month) {
        try {
            const history = await this.getAttendanceHistory(employeeNumber);
            if (history.success) {
                const monthStr = `${year}-${String(month).padStart(2, '0')}`;
                const monthData = history.data.filter(a => a.date.startsWith(monthStr));
                const totalDays = monthData.length;
                const presentDays = monthData.filter(a => a.status === 'Present').length;
                const totalDuration = monthData.reduce((sum, a) => sum + (a.totalDurationMinutes || 0), 0);
                const totalHours = Math.floor(totalDuration / 60);
                const totalMinutes = totalDuration % 60;

                return {
                    totalDays,
                    presentDays,
                    absentDays: totalDays - presentDays,
                    attendancePercentage: totalDays > 0 ? (presentDays / totalDays) * 100 : 0,
                    totalDuration: `${totalHours}h ${totalMinutes}m`,
                    data: monthData,
                };
            }
            return null;
        } catch (error) {
            console.error('[AttendanceService] Get monthly summary error:', error);
            return null;
        }
    }
}

export default new AttendanceService();