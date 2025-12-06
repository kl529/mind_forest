import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityEntry, StressLevel } from '@/types';
import { StressCalculator } from './stressCalculator';

const STORAGE_KEYS = {
  ACTIVITIES: 'mind_forest_activities',
  STRESS_LEVELS: 'mind_forest_stress_levels',
  USER_PREFERENCES: 'mind_forest_preferences'
};

export class DataStorage {

  /**
   * Save a new activity entry
   */
  static async saveActivity(activity: ActivityEntry): Promise<void> {
    try {
      const activities = await this.getActivities();
      activities.push(activity);
      
      // Keep only last 1000 activities to prevent storage overflow
      if (activities.length > 1000) {
        activities.splice(0, activities.length - 1000);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
      
      // Update stress levels for the day
      await this.updateDailyStressLevel(activity.date);
    } catch (error) {
      console.error('Error saving activity:', error);
      throw error;
    }
  }

  /**
   * Get all activities
   */
  static async getActivities(): Promise<ActivityEntry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (!data) return [];
      
      const activities = JSON.parse(data);
      // Convert date strings back to Date objects
      return activities.map((activity: any) => ({
        ...activity,
        date: new Date(activity.date)
      }));
    } catch (error) {
      console.error('Error loading activities:', error);
      return [];
    }
  }

  /**
   * Get activities for a specific date
   */
  static async getActivitiesForDate(date: Date): Promise<ActivityEntry[]> {
    const activities = await this.getActivities();
    const dateString = date.toISOString().split('T')[0];
    
    return activities.filter(activity => {
      const activityDateString = activity.date.toISOString().split('T')[0];
      return activityDateString === dateString;
    });
  }

  /**
   * Get activities for a date range
   */
  static async getActivitiesForDateRange(startDate: Date, endDate: Date): Promise<ActivityEntry[]> {
    const activities = await this.getActivities();
    
    return activities.filter(activity => {
      return activity.date >= startDate && activity.date <= endDate;
    });
  }

  /**
   * Update daily stress level calculation
   */
  private static async updateDailyStressLevel(date: Date): Promise<void> {
    try {
      const dayActivities = await this.getActivitiesForDate(date);
      const stressLevel = StressCalculator.calculateDailyStressLevel(dayActivities);
      
      const stressLevels = await this.getStressLevels();
      const existingIndex = stressLevels.findIndex(level => level.date === stressLevel.date);
      
      if (existingIndex >= 0) {
        stressLevels[existingIndex] = stressLevel;
      } else {
        stressLevels.push(stressLevel);
      }
      
      // Sort by date
      stressLevels.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Keep only last 365 days
      if (stressLevels.length > 365) {
        stressLevels.splice(0, stressLevels.length - 365);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.STRESS_LEVELS, JSON.stringify(stressLevels));
    } catch (error) {
      console.error('Error updating stress level:', error);
      throw error;
    }
  }

  /**
   * Get all stress levels
   */
  static async getStressLevels(): Promise<StressLevel[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STRESS_LEVELS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading stress levels:', error);
      return [];
    }
  }

  /**
   * Get stress levels for a specific month
   */
  static async getStressLevelsForMonth(year: number, month: number): Promise<StressLevel[]> {
    const stressLevels = await this.getStressLevels();
    const monthString = `${year}-${String(month).padStart(2, '0')}`;
    
    return stressLevels.filter(level => level.date.startsWith(monthString));
  }

  /**
   * Get recent stress levels (last N days)
   */
  static async getRecentStressLevels(days: number = 7): Promise<StressLevel[]> {
    const stressLevels = await this.getStressLevels();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffString = cutoffDate.toISOString().split('T')[0];
    
    return stressLevels
      .filter(level => level.date >= cutoffString)
      .slice(-days);
  }

  /**
   * Get current stress level (today's or most recent)
   */
  static async getCurrentStressLevel(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const stressLevels = await this.getStressLevels();
    
    const todayLevel = stressLevels.find(level => level.date === today);
    if (todayLevel) {
      return todayLevel.netStressLevel;
    }
    
    // If no data for today, calculate from today's activities
    const todayActivities = await this.getActivitiesForDate(new Date());
    if (todayActivities.length > 0) {
      const stressLevel = StressCalculator.calculateDailyStressLevel(todayActivities);
      return stressLevel.netStressLevel;
    }
    
    // Default to neutral if no data
    return 5;
  }

  /**
   * Get monthly statistics
   */
  static async getMonthlyStats(year: number, month: number) {
    const monthlyStressLevels = await this.getStressLevelsForMonth(year, month);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const monthlyActivities = await this.getActivitiesForDateRange(startDate, endDate);
    
    if (monthlyStressLevels.length === 0) {
      return {
        averageStress: 5,
        averageRelief: 0,
        totalEntries: 0,
        mostCommonStressor: null,
        mostCommonRelief: null,
        stressLevels: []
      };
    }

    const averageStress = monthlyStressLevels.reduce((sum, level) => sum + level.netStressLevel, 0) / monthlyStressLevels.length;
    const averageRelief = monthlyStressLevels.reduce((sum, level) => sum + level.totalReliefScore, 0) / monthlyStressLevels.length;
    
    const stressors = monthlyActivities.filter(a => a.category === 'stress');
    const reliefActivities = monthlyActivities.filter(a => a.category === 'stress-relief');
    
    const mostCommonStressor = this.getMostCommonActivity(stressors);
    const mostCommonRelief = this.getMostCommonActivity(reliefActivities);

    return {
      averageStress: Math.round(averageStress * 10) / 10,
      averageRelief: Math.round(averageRelief * 10) / 10,
      totalEntries: monthlyActivities.length,
      mostCommonStressor,
      mostCommonRelief,
      stressLevels: monthlyStressLevels
    };
  }

  /**
   * Helper method to find most common activity
   */
  private static getMostCommonActivity(activities: ActivityEntry[]): string | null {
    if (activities.length === 0) return null;
    
    const activityCounts = activities.reduce((counts, activity) => {
      counts[activity.activity] = (counts[activity.activity] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    return Object.entries(activityCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null;
  }

  /**
   * Clear all data (for testing or reset)
   */
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  /**
   * Export data as JSON string
   */
  static async exportData(): Promise<string> {
    try {
      const activities = await this.getActivities();
      const stressLevels = await this.getStressLevels();
      
      return JSON.stringify({
        activities,
        stressLevels,
        exportDate: new Date().toISOString()
      }, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  /**
   * Import data from JSON string
   */
  static async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.activities) {
        // Convert date strings back to Date objects
        const activities = data.activities.map((activity: any) => ({
          ...activity,
          date: new Date(activity.date)
        }));
        await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
      }
      
      if (data.stressLevels) {
        await AsyncStorage.setItem(STORAGE_KEYS.STRESS_LEVELS, JSON.stringify(data.stressLevels));
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}