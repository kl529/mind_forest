import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { SupabaseService } from '@/services/supabaseService';
import { ActivityEntry } from '@/types';

export default function CalendarScreen() {
  const colorScheme = useColorScheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedDayEntries, setSelectedDayEntries] = useState<ActivityEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMonthData();
  }, [currentDate]);

  const loadMonthData = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const data = await SupabaseService.getEntriesForMonth(year, month);
      setEntries(data);
    } catch (error) {
      console.error('Error loading month data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleDayPress = async (day: number | null) => {
    if (!day) return;

    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);

    const dayEntries = await SupabaseService.getEntriesForDate(selected);
    setSelectedDayEntries(dayEntries);
    setModalVisible(true);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getStressColor = (day: number | null) => {
    if (!day) return 'transparent';

    const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0];

    const dayEntries = entries.filter(
      (e) => e.date.toISOString().split('T')[0] === dateString
    );

    if (dayEntries.length === 0) {
      return Colors[colorScheme ?? 'light'].background;
    }

    // Calculate net stress (stress - relief)
    const stressEntries = dayEntries.filter((e) => e.entry_type === 'stress');
    const reliefEntries = dayEntries.filter((e) => e.entry_type === 'relief');

    const avgStress =
      stressEntries.length > 0
        ? stressEntries.reduce((sum, e) => sum + e.intensity, 0) / stressEntries.length
        : 0;

    const avgRelief =
      reliefEntries.length > 0
        ? reliefEntries.reduce((sum, e) => sum + e.intensity, 0) / reliefEntries.length
        : 0;

    const netStress = avgStress - avgRelief * 0.6;

    // Color based on net stress
    if (netStress > 2) {
      return netStress > 3.5 ? '#FF4444' : '#FF8888'; // Red tones
    } else if (netStress < -1) {
      return netStress < -2 ? '#4444FF' : '#8888FF'; // Blue tones
    }

    return Colors[colorScheme ?? 'light'].background;
  };

  const hasEntries = (day: number | null) => {
    if (!day) return false;

    const dateString = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0];

    return entries.some((e) => e.date.toISOString().split('T')[0] === dateString);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigateMonth('prev')}>
          <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
        
        <ThemedText style={styles.monthTitle}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </ThemedText>
        
        <TouchableOpacity onPress={() => navigateMonth('next')}>
          <IconSymbol name="chevron.right" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekHeader}>
        {weekDays.map((day) => (
          <ThemedText key={day} style={styles.weekDay}>
            {day}
          </ThemedText>
        ))}
      </View>

      <View style={styles.calendar}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayContainer,
              { backgroundColor: getStressColor(day) },
              hasEntries(day) && styles.dayWithEntries,
            ]}
            onPress={() => handleDayPress(day)}
            disabled={!day}
          >
            {day && (
              <ThemedText style={styles.dayText}>
                {day}
              </ThemedText>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.legend}>
        <ThemedText style={styles.legendTitle}>Stress Level Legend</ThemedText>
        <View style={styles.legendRow}>
          <View style={[styles.legendItem, { backgroundColor: '#4444FF' }]} />
          <ThemedText style={styles.legendText}>Low Stress</ThemedText>
          <View style={[styles.legendItem, { backgroundColor: '#FF4444' }]} />
          <ThemedText style={styles.legendText}>High Stress</ThemedText>
        </View>
      </View>

      {/* Day Entries Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                {selectedDate?.toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <ThemedText style={styles.closeButton}>✕</ThemedText>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              {selectedDayEntries.length === 0 ? (
                <ThemedText style={styles.noEntries}>No entries for this day</ThemedText>
              ) : (
                selectedDayEntries.map((entry) => (
                  <View key={entry.id} style={[
                    styles.entryCard,
                    entry.entry_type === 'stress' ? styles.stressCard : styles.reliefCard
                  ]}>
                    <View style={styles.entryHeader}>
                      <ThemedText style={styles.entryType}>
                        {entry.entry_type === 'stress' ? '😰 스트레스' : '😌 스트레스 해소'}
                      </ThemedText>
                      <ThemedText style={styles.entryIntensity}>
                        {entry.intensity}/5
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.entryCategory}>{entry.category}</ThemedText>
                    <ThemedText style={styles.entryReaction}>{entry.reaction}</ThemedText>
                    {entry.notes && (
                      <ThemedText style={styles.entryNotes}>{entry.notes}</ThemedText>
                    )}
                  </View>
                ))
              )}
            </ScrollView>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDay: {
    width: 40,
    textAlign: 'center',
    fontWeight: '600',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayContainer: {
    width: '14.28%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    margin: 1,
  },
  dayText: {
    fontSize: 16,
  },
  legend: {
    marginTop: 30,
    alignItems: 'center',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendItem: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  legendText: {
    fontSize: 14,
  },
  dayWithEntries: {
    borderWidth: 2,
    borderColor: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalScroll: {
    maxHeight: 500,
  },
  noEntries: {
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.6,
    marginTop: 40,
  },
  entryCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  stressCard: {
    backgroundColor: '#FFE5E5',
  },
  reliefCard: {
    backgroundColor: '#E5F5E5',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  entryType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  entryIntensity: {
    fontSize: 14,
    fontWeight: '600',
  },
  entryCategory: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 5,
  },
  entryReaction: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  entryNotes: {
    fontSize: 14,
    opacity: 0.8,
    fontStyle: 'italic',
  },
});