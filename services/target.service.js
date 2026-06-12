import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

class TargetService {
  async getEmployeeNumber() {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const user = JSON.parse(userData);
        return user.employeeNumber || "RC000447";
      }
      return "RC000447";
    } catch (error) {
      console.error('Error getting employee number:', error);
      return "RC000447";
    }
  }

  async getMonthlyTarget() {
    try {
      const employeeNumber = await this.getEmployeeNumber();
      console.log(`Fetching monthly target for employee ${employeeNumber}`);
      const response = await api.get(`/ontrack/target/staff/monthly/${employeeNumber}`);
      
      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error('Get monthly target error:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Failed to fetch monthly target',
      };
    }
  }
  
  async getDailyTargets() {
    try {
      const employeeNumber = await this.getEmployeeNumber();
      console.log(`Fetching daily targets for employee ${employeeNumber}`);
      const response = await api.get(`/ontrack/target/staff/daily/${employeeNumber}`);
      
      return {
        success: response.success,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      console.error('Get daily targets error:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch daily targets',
      };
    }
  }
}

export default new TargetService();