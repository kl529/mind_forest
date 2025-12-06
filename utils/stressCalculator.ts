import { ActivityEntry, StressLevel, TerrariumState } from '@/types';

export class StressCalculator {
  
  /**
   * Calculate stress level based on activities for a specific date
   * @param activities - Array of activities for the day
   * @returns StressLevel object with calculated scores
   */
  static calculateDailyStressLevel(activities: ActivityEntry[]): StressLevel {
    let totalStressScore = 0;
    let totalReliefScore = 0;
    
    activities.forEach(activity => {
      if (activity.category === 'stress') {
        totalStressScore += activity.intensity;
      } else {
        totalReliefScore += activity.intensity;
      }
    });

    // Calculate net stress level (1-10 scale)
    // Higher relief scores reduce overall stress
    const rawStressScore = totalStressScore - (totalReliefScore * 0.8);
    const netStressLevel = Math.max(1, Math.min(10, Math.round(5 + (rawStressScore / activities.length || 1))));

    return {
      date: new Date().toISOString().split('T')[0],
      totalStressScore,
      totalReliefScore,
      netStressLevel,
    };
  }

  /**
   * Calculate terrarium state based on recent stress levels
   * @param recentStressLevels - Array of recent stress levels (last 7 days)
   * @returns TerrariumState object
   */
  static calculateTerrariumState(recentStressLevels: StressLevel[]): TerrariumState {
    if (recentStressLevels.length === 0) {
      return {
        healthLevel: 5,
        visualState: 'neutral'
      };
    }

    // Calculate average stress over recent period
    const averageStress = recentStressLevels.reduce((sum, level) => sum + level.netStressLevel, 0) / recentStressLevels.length;
    
    // Calculate trend (is stress increasing or decreasing?)
    let trend = 0;
    if (recentStressLevels.length >= 3) {
      const recent = recentStressLevels.slice(-3);
      const older = recentStressLevels.slice(0, -3);
      const recentAvg = recent.reduce((sum, level) => sum + level.netStressLevel, 0) / recent.length;
      const olderAvg = older.length > 0 ? older.reduce((sum, level) => sum + level.netStressLevel, 0) / older.length : recentAvg;
      trend = olderAvg - recentAvg; // Positive trend = improving
    }

    // Calculate health level (1-10)
    let healthLevel = 10 - averageStress + (trend * 0.5);
    healthLevel = Math.max(1, Math.min(10, Math.round(healthLevel)));

    // Determine visual state
    let visualState: TerrariumState['visualState'];
    if (healthLevel >= 8) {
      visualState = 'thriving';
    } else if (healthLevel >= 6) {
      visualState = 'healthy';
    } else if (healthLevel >= 4) {
      visualState = 'neutral';
    } else if (healthLevel >= 2) {
      visualState = 'stressed';
    } else {
      visualState = 'struggling';
    }

    return {
      healthLevel,
      visualState
    };
  }

  /**
   * Get stress notifications based on current level
   * @param stressLevel - Current stress level (1-10)
   * @param recentEntries - Recent activity entries
   * @returns Notification object with message and suggestions
   */
  static getStressNotification(stressLevel: number, recentEntries: ActivityEntry[] = []) {
    // Analyze recent patterns
    const recentStressEntries = recentEntries
      .filter(entry => entry.category === 'stress')
      .slice(0, 5);
    
    const recentReliefEntries = recentEntries
      .filter(entry => entry.category === 'stress-relief')
      .slice(0, 5);

    const mostCommonStressor = this.getMostCommonActivity(recentStressEntries);
    const mostCommonRelief = this.getMostCommonActivity(recentReliefEntries);

    if (stressLevel <= 3) {
      return {
        level: 'low' as const,
        message: "Your stress levels are looking good! 🌱",
        suggestions: [
          "Continue your healthy habits",
          mostCommonRelief ? `Keep up with ${mostCommonRelief}` : "Try some light exercise",
          "Take time to appreciate the moment",
          "Consider helping others - it boosts well-being"
        ]
      };
    } else if (stressLevel <= 6) {
      return {
        level: 'moderate' as const,
        message: "Your stress is at a moderate level. 🌿",
        suggestions: [
          "Try deep breathing exercises (4-7-8 technique)",
          mostCommonStressor ? `Consider addressing ${mostCommonStressor}` : "Identify your main stressor",
          mostCommonRelief ? `Try ${mostCommonRelief} again` : "Take a short walk",
          "Listen to calming music or nature sounds"
        ]
      };
    } else {
      return {
        level: 'high' as const,
        message: "Your stress levels are high. Take care of yourself. 🍃",
        suggestions: [
          "Practice mindfulness meditation (even 5 minutes helps)",
          mostCommonStressor ? `Take a break from ${mostCommonStressor}` : "Remove yourself from stressful situations",
          "Talk to someone you trust",
          "Consider professional support if stress persists"
        ]
      };
    }
  }

  /**
   * Get calendar day color based on stress level
   * @param stressLevel - Stress level for the day
   * @returns Color information for calendar display
   */
  static getCalendarDayColor(stressLevel: number) {
    if (stressLevel <= 2) {
      return { colorType: 'blue' as const, colorIntensity: 'dark' as const };
    } else if (stressLevel <= 4) {
      return { colorType: 'blue' as const, colorIntensity: 'medium' as const };
    } else if (stressLevel <= 5) {
      return { colorType: 'blue' as const, colorIntensity: 'light' as const };
    } else if (stressLevel <= 6) {
      return { colorType: 'neutral' as const, colorIntensity: 'light' as const };
    } else if (stressLevel <= 7) {
      return { colorType: 'red' as const, colorIntensity: 'light' as const };
    } else if (stressLevel <= 8) {
      return { colorType: 'red' as const, colorIntensity: 'medium' as const };
    } else {
      return { colorType: 'red' as const, colorIntensity: 'dark' as const };
    }
  }

  /**
   * Helper method to find most common activity
   */
  private static getMostCommonActivity(entries: ActivityEntry[]): string | null {
    if (entries.length === 0) return null;
    
    const activityCounts = entries.reduce((counts, entry) => {
      counts[entry.activity] = (counts[entry.activity] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    return Object.entries(activityCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null;
  }

  /**
   * Calculate weekly stress trend
   * @param weeklyData - Array of stress levels for the week
   * @returns Trend direction and percentage change
   */
  static calculateWeeklyTrend(weeklyData: StressLevel[]) {
    if (weeklyData.length < 2) {
      return { trend: 'stable', change: 0 };
    }

    const firstHalf = weeklyData.slice(0, Math.floor(weeklyData.length / 2));
    const secondHalf = weeklyData.slice(Math.floor(weeklyData.length / 2));

    const firstAvg = firstHalf.reduce((sum, level) => sum + level.netStressLevel, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, level) => sum + level.netStressLevel, 0) / secondHalf.length;

    const change = ((firstAvg - secondAvg) / firstAvg) * 100;

    if (Math.abs(change) < 10) {
      return { trend: 'stable', change: Math.round(change) };
    } else if (change > 0) {
      return { trend: 'improving', change: Math.round(change) };
    } else {
      return { trend: 'worsening', change: Math.round(Math.abs(change)) };
    }
  }
}