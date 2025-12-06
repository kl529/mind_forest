import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { HealthTip } from '@/types';

// Health tips for stress management
const HEALTH_TIPS: HealthTip[] = [
  {
    id: '1',
    title: '깊은 호흡 연습',
    description: '4초 들이마시고, 7초 참고, 8초 내쉬기를 반복하세요. 이 호흡법은 신경계를 진정시킵니다.',
    category: 'breathing',
  },
  {
    id: '2',
    title: '5분 산책',
    description: '짧은 산책만으로도 스트레스 호르몬이 감소합니다. 주변을 둘러보며 천천히 걸어보세요.',
    category: 'movement',
  },
  {
    id: '3',
    title: '3-3-3 기법',
    description: '주변에서 보이는 것 3가지, 들리는 것 3가지, 움직일 수 있는 것 3가지를 찾아보세요.',
    category: 'mindfulness',
  },
  {
    id: '4',
    title: '누군가에게 연락하기',
    description: '친한 친구나 가족에게 간단한 메시지를 보내보세요. 사회적 연결은 스트레스를 완화합니다.',
    category: 'social',
  },
  {
    id: '5',
    title: '수면 루틴 만들기',
    description: '매일 같은 시간에 자고 일어나세요. 좋은 수면은 스트레스 회복의 기본입니다.',
    category: 'sleep',
  },
  {
    id: '6',
    title: '스트레칭',
    description: '목, 어깨, 팔을 천천히 스트레칭하세요. 신체적 긴장을 풀면 정신적 긴장도 완화됩니다.',
    category: 'movement',
  },
];

export default function TerrariumScreen() {
  const colorScheme = useColorScheme();
  const [streakDays, setStreakDays] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    loadStreakData();
  }, []);

  const loadStreakData = async () => {
    // TODO: Calculate actual streak from DataStorage
    // For now, using mock data
    setStreakDays(7);
  };

  const currentTip = HEALTH_TIPS[currentTipIndex];

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % HEALTH_TIPS.length);
  };

  const handlePreviousTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + HEALTH_TIPS.length) % HEALTH_TIPS.length);
  };

  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      breathing: '🫁',
      movement: '🚶',
      mindfulness: '🧘',
      social: '💬',
      sleep: '😴',
    };
    return emojiMap[category] || '💡';
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.title}>Your Wellness Journey</ThemedText>

        {/* Streak Section */}
        <View style={styles.streakSection}>
          <View style={styles.streakCard}>
            <ThemedText style={styles.streakEmoji}>🔥</ThemedText>
            <ThemedText style={styles.streakNumber}>{streakDays}</ThemedText>
            <ThemedText style={styles.streakLabel}>Day Streak</ThemedText>
            <ThemedText style={styles.streakSubtext}>
              {streakDays >= 7
                ? 'Amazing! Keep it up!'
                : streakDays >= 3
                ? 'Great progress!'
                : 'Start your journey!'}
            </ThemedText>
          </View>

          <View style={styles.streakInfo}>
            <ThemedText style={styles.infoText}>
              📊 기록을 꾸준히 남기면 패턴을 파악하고 더 나은 대처 방법을 찾을 수 있어요.
            </ThemedText>
          </View>
        </View>

        {/* Health Tips Section */}
        <View style={styles.tipsSection}>
          <ThemedText style={styles.sectionTitle}>💡 Mind Health Tips</ThemedText>

          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <ThemedText style={styles.tipEmoji}>
                {getCategoryEmoji(currentTip.category)}
              </ThemedText>
              <ThemedText style={styles.tipTitle}>{currentTip.title}</ThemedText>
            </View>

            <ThemedText style={styles.tipDescription}>{currentTip.description}</ThemedText>

            <View style={styles.tipNavigation}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={handlePreviousTip}
              >
                <ThemedText style={styles.navButtonText}>← Prev</ThemedText>
              </TouchableOpacity>

              <ThemedText style={styles.tipCounter}>
                {currentTipIndex + 1} / {HEALTH_TIPS.length}
              </ThemedText>

              <TouchableOpacity
                style={styles.navButton}
                onPress={handleNextTip}
              >
                <ThemedText style={styles.navButtonText}>Next →</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.notificationsSection}>
          <ThemedText style={styles.sectionTitle}>🔔 Daily Reminders</ThemedText>

          <View style={styles.notificationCard}>
            <View style={styles.notificationContent}>
              <ThemedText style={styles.notificationTitle}>
                Daily Check-in Reminder
              </ThemedText>
              <ThemedText style={styles.notificationDescription}>
                Receive a gentle reminder to record your experiences each day
              </ThemedText>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: '#E0E0E0',
                true: Colors[colorScheme ?? 'light'].tint,
              }}
            />
          </View>

          {notificationsEnabled && (
            <View style={styles.notificationInfo}>
              <ThemedText style={styles.infoText}>
                ⏰ You'll receive a reminder at 8:00 PM daily
              </ThemedText>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <ThemedText style={styles.sectionTitle}>Quick Stats</ThemedText>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>28</ThemedText>
              <ThemedText style={styles.statLabel}>Total Entries</ThemedText>
            </View>
            <View style={styles.statItem}>
              <ThemedText style={styles.statNumber}>14</ThemedText>
              <ThemedText style={styles.statLabel}>This Month</ThemedText>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  streakSection: {
    marginBottom: 30,
  },
  streakCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 15,
  },
  streakEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  streakNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  streakLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6F00',
    marginTop: 5,
  },
  streakSubtext: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 10,
  },
  streakInfo: {
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 15,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  tipsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tipCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  tipEmoji: {
    fontSize: 28,
  },
  tipTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  tipDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  tipNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navButton: {
    padding: 10,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  tipCounter: {
    fontSize: 14,
    opacity: 0.5,
  },
  notificationsSection: {
    marginBottom: 30,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    gap: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  notificationInfo: {
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  quickStats: {
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
});
