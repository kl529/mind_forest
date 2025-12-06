import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ActivityEntry } from '@/types';
import { SupabaseService } from '@/services/supabaseService';

// Stress reactions with Korean labels
const STRESS_REACTIONS = {
  physical: [
    { id: 'headache', label: '두통' },
    { id: 'heartbeat', label: '두근거림' },
    { id: 'fatigue', label: '피로' },
    { id: 'insomnia', label: '불면' },
    { id: 'appetite', label: '식욕 변화' },
    { id: 'tension', label: '긴장/경직' },
  ],
  emotional: [
    { id: 'anxiety', label: '불안' },
    { id: 'irritation', label: '짜증' },
    { id: 'sadness', label: '슬픔' },
    { id: 'overwhelmed', label: '압도됨' },
    { id: 'emptiness', label: '공허함' },
    { id: 'anger', label: '분노' },
  ],
  behavioral: [
    { id: 'avoidance', label: '회피' },
    { id: 'procrastination', label: '미루기' },
    { id: 'isolation', label: '고립' },
    { id: 'overworking', label: '과로' },
    { id: 'impulsive', label: '충동성' },
    { id: 'distraction', label: '집중 어려움' },
  ],
};

// Stress relief activities with Korean labels
const RELIEF_ACTIVITIES = {
  physical: [
    { id: 'walking', label: '산책' },
    { id: 'exercise', label: '운동' },
    { id: 'stretching', label: '스트레칭' },
    { id: 'yoga', label: '요가' },
    { id: 'sleep', label: '수면/휴식' },
    { id: 'massage', label: '마사지' },
  ],
  emotional: [
    { id: 'meditation', label: '명상' },
    { id: 'breathing', label: '호흡 연습' },
    { id: 'music', label: '음악 감상' },
    { id: 'journaling', label: '일기 쓰기' },
    { id: 'crying', label: '울기' },
    { id: 'laughing', label: '웃기' },
  ],
  behavioral: [
    { id: 'socializing', label: '친구 만남' },
    { id: 'hobby', label: '취미 활동' },
    { id: 'reading', label: '독서' },
    { id: 'nature', label: '자연 접하기' },
    { id: 'cleaning', label: '정리/청소' },
    { id: 'cooking', label: '요리하기' },
  ],
};

export default function EntryScreen() {
  const colorScheme = useColorScheme();
  const [entryType, setEntryType] = useState<'stress' | 'relief'>('stress');
  const [selectedCategory, setSelectedCategory] = useState<'physical' | 'emotional' | 'behavioral'>('emotional');
  const [selectedReaction, setSelectedReaction] = useState<string>('');
  const [intensity, setIntensity] = useState<number>(3);
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedReaction) {
      Alert.alert('Please select a reaction', 'Choose what you\'re experiencing');
      return;
    }

    try {
      setSaving(true);

      const entry = {
        date: new Date(),
        entry_type: entryType,
        category: selectedCategory,
        reaction: selectedReaction,
        intensity,
        notes: notes.trim() || undefined,
      };

      const saved = await SupabaseService.saveEntry(entry);

      if (saved) {
        Alert.alert('Saved!', 'Your entry has been recorded', [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setSelectedReaction('');
              setIntensity(3);
              setNotes('');
            }
          }
        ]);
      } else {
        Alert.alert('Error', 'Failed to save entry. Please try again.');
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const currentReactions = entryType === 'stress' ? STRESS_REACTIONS : RELIEF_ACTIVITIES;
  const reactionLabel = currentReactions[selectedCategory].find(r => r.id === selectedReaction)?.label || '';

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.title}>Record Your Experience</ThemedText>
        <ThemedText style={styles.subtitle}>
          {entryType === 'stress' ? 'What are you experiencing?' : 'What helped you feel better?'}
        </ThemedText>

        {/* Type Selection: Stress or Relief */}
        <View style={styles.section}>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                entryType === 'stress' && styles.typeButtonActiveStress,
              ]}
              onPress={() => {
                setEntryType('stress');
                setSelectedReaction('');
              }}
            >
              <ThemedText
                style={[
                  styles.typeButtonText,
                  entryType === 'stress' && styles.typeButtonTextActive,
                ]}
              >
                😰 스트레스
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                entryType === 'relief' && styles.typeButtonActiveRelief,
              ]}
              onPress={() => {
                setEntryType('relief');
                setSelectedReaction('');
              }}
            >
              <ThemedText
                style={[
                  styles.typeButtonText,
                  entryType === 'relief' && styles.typeButtonTextActive,
                ]}
              >
                😌 스트레스 해소
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Category</ThemedText>
          <View style={styles.categoryButtons}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === 'physical' && styles.categoryButtonActive,
              ]}
              onPress={() => {
                setSelectedCategory('physical');
                setSelectedReaction('');
              }}
            >
              <ThemedText
                style={[
                  styles.categoryButtonText,
                  selectedCategory === 'physical' && styles.categoryButtonTextActive,
                ]}
              >
                신체적
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === 'emotional' && styles.categoryButtonActive,
              ]}
              onPress={() => {
                setSelectedCategory('emotional');
                setSelectedReaction('');
              }}
            >
              <ThemedText
                style={[
                  styles.categoryButtonText,
                  selectedCategory === 'emotional' && styles.categoryButtonTextActive,
                ]}
              >
                정서적
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === 'behavioral' && styles.categoryButtonActive,
              ]}
              onPress={() => {
                setSelectedCategory('behavioral');
                setSelectedReaction('');
              }}
            >
              <ThemedText
                style={[
                  styles.categoryButtonText,
                  selectedCategory === 'behavioral' && styles.categoryButtonTextActive,
                ]}
              >
                행동적
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reaction Selection */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {entryType === 'stress' ? 'What are you experiencing?' : 'What did you do?'}
          </ThemedText>
          <View style={styles.reactionGrid}>
            {currentReactions[selectedCategory].map((reaction) => (
              <TouchableOpacity
                key={reaction.id}
                style={[
                  styles.reactionButton,
                  selectedReaction === reaction.id && styles.reactionButtonActive,
                ]}
                onPress={() => setSelectedReaction(reaction.id)}
              >
                <ThemedText
                  style={[
                    styles.reactionButtonText,
                    selectedReaction === reaction.id && styles.reactionButtonTextActive,
                  ]}
                >
                  {reaction.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Intensity Slider */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Intensity: {intensity}/5
          </ThemedText>
          <View style={styles.intensityContainer}>
            {[1, 2, 3, 4, 5].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.intensityButton,
                  intensity >= value && {
                    backgroundColor: Colors[colorScheme ?? 'light'].tint,
                  },
                ]}
                onPress={() => setIntensity(value)}
              >
                <ThemedText
                  style={[
                    styles.intensityText,
                    intensity >= value && styles.intensityTextActive,
                  ]}
                >
                  {value}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
          <ThemedText style={styles.intensityLabel}>
            {intensity <= 2 ? 'Mild' : intensity <= 3 ? 'Moderate' : 'Strong'}
          </ThemedText>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Notes (Optional)</ThemedText>
          <TextInput
            style={[
              styles.notesInput,
              {
                color: Colors[colorScheme ?? 'light'].text,
                backgroundColor: Colors[colorScheme ?? 'light'].background,
                borderColor: Colors[colorScheme ?? 'light'].text + '30',
              }
            ]}
            placeholder="What triggered this? Any context to remember..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].text + '60'}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            maxLength={200}
          />
          <ThemedText style={styles.characterCount}>{notes.length}/200</ThemedText>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: Colors[colorScheme ?? 'light'].tint },
            (!selectedReaction || saving) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!selectedReaction || saving}
        >
          <ThemedText style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Entry'}
          </ThemedText>
        </TouchableOpacity>
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  categoryButtonActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF5020',
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  reactionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  reactionButton: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  reactionButtonActive: {
    borderColor: '#2196F3',
    backgroundColor: '#2196F320',
  },
  reactionButtonText: {
    fontSize: 14,
  },
  reactionButtonTextActive: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  intensityContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  intensityButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  intensityTextActive: {
    color: 'white',
  },
  intensityLabel: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.7,
    marginTop: 5,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  characterCount: {
    textAlign: 'right',
    fontSize: 12,
    opacity: 0.5,
    marginTop: 5,
  },
  saveButton: {
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  typeButton: {
    flex: 1,
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  typeButtonActiveStress: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FF6B6B15',
  },
  typeButtonActiveRelief: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF5015',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  typeButtonTextActive: {
    fontWeight: 'bold',
  },
});
