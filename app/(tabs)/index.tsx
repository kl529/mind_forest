import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TerrariumView } from '@/components/TerrariumView';
import { DataStorage } from '@/utils/dataStorage';
import { WeeklyStats } from '@/types';

export default function HomeScreen() {
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    totalEntries: 0,
    streakDays: 0,
    weekData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeeklyData();
  }, []);

  const loadWeeklyData = async () => {
    try {
      setLoading(true);
      // Get activities from the last 7 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 6); // Last 7 days including today

      const activities = await DataStorage.getActivitiesForDateRange(startDate, endDate);

      // Calculate weekly stats
      const stats = calculateWeeklyStats(activities, startDate, endDate);
      setWeeklyStats(stats);
    } catch (error) {
      console.error('Error loading weekly data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeklyStats = (activities: any[], startDate: Date, endDate: Date) => {
    // Create array for 7 days
    const weekData = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];

      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date).toISOString().split('T')[0];
        return activityDate === dateString;
      });

      const avgIntensity = dayActivities.length > 0
        ? dayActivities.reduce((sum, a) => sum + a.intensity, 0) / dayActivities.length
        : 0;

      weekData.push({
        day: daysOfWeek[currentDate.getDay()],
        count: dayActivities.length,
        avgIntensity: Math.round(avgIntensity * 10) / 10,
      });
    }

    // Calculate streak
    let streakDays = 0;
    for (let i = 6; i >= 0; i--) {
      if (weekData[i].count > 0) {
        streakDays++;
      } else {
        break;
      }
    }

    return {
      totalEntries: activities.length,
      streakDays,
      weekData,
    };
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Loading...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Terrarium Section */}
        <View style={styles.terrariumSection}>
          <TerrariumView stressLevel={5} />
        </View>

        {/* Weekly Stats Section */}
        <View style={styles.statsSection}>
          <ThemedText style={styles.sectionTitle}>This Week</ThemedText>

          {/* Stats Cards */}
          <View style={styles.statsCards}>
            <View style={styles.statCard}>
              <ThemedText style={styles.statNumber}>{weeklyStats.totalEntries}</ThemedText>
              <ThemedText style={styles.statLabel}>Entries</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statNumber}>{weeklyStats.streakDays} 🔥</ThemedText>
              <ThemedText style={styles.statLabel}>Day Streak</ThemedText>
            </View>
          </View>

          {/* Weekly Chart */}
          <View style={styles.chartSection}>
            <ThemedText style={styles.chartTitle}>Daily Activity</ThemedText>
            <View style={styles.chart}>
              {weeklyStats.weekData.map((day, index) => (
                <View key={index} style={styles.chartBar}>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${Math.min(day.count * 20, 100)}%`,
                          backgroundColor: day.count > 0 ? '#4CAF50' : '#E0E0E0',
                        }
                      ]}
                    />
                  </View>
                  <ThemedText style={styles.barLabel}>{day.day}</ThemedText>
                  {day.count > 0 && (
                    <ThemedText style={styles.barCount}>{day.count}</ThemedText>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
  },
  terrariumSection: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsSection: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsCards: {
    flexDirection: 'row',
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  chartSection: {
    marginTop: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  chart: {
    flexDirection: 'row',
    height: 150,
    gap: 8,
    alignItems: 'flex-end',
    paddingBottom: 30,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  barContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 5,
    minHeight: 10,
  },
  barLabel: {
    fontSize: 12,
    marginTop: 5,
  },
  barCount: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
