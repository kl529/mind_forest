import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import { IconSymbol } from './ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ActivityEntry } from '@/types';

interface InputModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (entry: Partial<ActivityEntry>) => void;
}

const STRESS_ACTIVITIES = [
  { id: 'work', name: 'Work pressure' },
  { id: 'sleep', name: 'Sleep issues' },
  { id: 'social', name: 'Social situations' },
  { id: 'health', name: 'Health concerns' },
  { id: 'financial', name: 'Financial worries' },
  { id: 'family', name: 'Family issues' },
];

const RELIEF_ACTIVITIES = [
  { id: 'walking', name: 'Walking' },
  { id: 'reading', name: 'Reading' },
  { id: 'meditation', name: 'Meditation' },
  { id: 'music', name: 'Listening to music' },
  { id: 'exercise', name: 'Exercise' },
  { id: 'socializing', name: 'Socializing' },
  { id: 'hobbies', name: 'Hobbies' },
  { id: 'nature', name: 'Time in nature' },
];

export function InputModal({ visible, onClose, onSave }: InputModalProps) {
  const colorScheme = useColorScheme();
  const [category, setCategory] = useState<'stress' | 'stress-relief'>('stress');
  const [selectedActivity, setSelectedActivity] = useState<string>('');
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setCategory('stress');
    setSelectedActivity('');
    setIntensity(3);
    setNotes('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!selectedActivity) {
      Alert.alert('Missing Information', 'Please select an activity.');
      return;
    }

    const entry: Partial<ActivityEntry> = {
      id: Date.now().toString(),
      date: new Date(),
      category,
      activity: selectedActivity,
      intensity,
      notes: notes.trim() || undefined,
    };

    onSave(entry);
    resetForm();
  };

  const currentActivities = category === 'stress' ? STRESS_ACTIVITIES : RELIEF_ACTIVITIES;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ThemedView style={styles.modal}>
            
            {/* Header */}
            <View style={styles.header}>
              <ThemedText style={styles.title}>Log Activity</ThemedText>
              <TouchableOpacity onPress={handleClose}>
                <IconSymbol name="xmark" size={24} color={Colors[colorScheme ?? 'light'].text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              
              {/* Category Selection */}
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Category</ThemedText>
                <View style={styles.categoryContainer}>
                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      category === 'stress' && styles.categoryButtonActive,
                      { 
                        borderColor: Colors[colorScheme ?? 'light'].tint,
                        backgroundColor: category === 'stress' 
                          ? Colors[colorScheme ?? 'light'].tint + '20'
                          : 'transparent'
                      }
                    ]}
                    onPress={() => {
                      setCategory('stress');
                      setSelectedActivity('');
                    }}
                  >
                    <ThemedText style={[
                      styles.categoryText,
                      category === 'stress' && { color: Colors[colorScheme ?? 'light'].tint }
                    ]}>
                      Stress
                    </ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.categoryButton,
                      category === 'stress-relief' && styles.categoryButtonActive,
                      { 
                        borderColor: Colors[colorScheme ?? 'light'].tint,
                        backgroundColor: category === 'stress-relief' 
                          ? Colors[colorScheme ?? 'light'].tint + '20'
                          : 'transparent'
                      }
                    ]}
                    onPress={() => {
                      setCategory('stress-relief');
                      setSelectedActivity('');
                    }}
                  >
                    <ThemedText style={[
                      styles.categoryText,
                      category === 'stress-relief' && { color: Colors[colorScheme ?? 'light'].tint }
                    ]}>
                      Stress Relief
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Activity Selection */}
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Activity</ThemedText>
                <View style={styles.activitiesContainer}>
                  {currentActivities.map((activity) => (
                    <TouchableOpacity
                      key={activity.id}
                      style={[
                        styles.activityButton,
                        selectedActivity === activity.id && styles.activityButtonActive,
                        {
                          borderColor: Colors[colorScheme ?? 'light'].text + '30',
                          backgroundColor: selectedActivity === activity.id
                            ? Colors[colorScheme ?? 'light'].tint + '20'
                            : 'transparent'
                        }
                      ]}
                      onPress={() => setSelectedActivity(activity.id)}
                    >
                      <ThemedText style={[
                        styles.activityText,
                        selectedActivity === activity.id && { color: Colors[colorScheme ?? 'light'].tint }
                      ]}>
                        {activity.name}
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
                        {
                          backgroundColor: value <= intensity 
                            ? Colors[colorScheme ?? 'light'].tint 
                            : Colors[colorScheme ?? 'light'].text + '20'
                        }
                      ]}
                      onPress={() => setIntensity(value)}
                    >
                      <ThemedText style={[
                        styles.intensityText,
                        { color: value <= intensity ? 'white' : Colors[colorScheme ?? 'light'].text }
                      ]}>
                        {value}
                      </ThemedText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Notes */}
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Notes (optional)</ThemedText>
                <TextInput
                  style={[
                    styles.notesInput,
                    {
                      borderColor: Colors[colorScheme ?? 'light'].text + '30',
                      color: Colors[colorScheme ?? 'light'].text,
                      backgroundColor: Colors[colorScheme ?? 'light'].background,
                    }
                  ]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Add any additional notes..."
                  placeholderTextColor={Colors[colorScheme ?? 'light'].text + '50'}
                  multiline
                  numberOfLines={3}
                  maxLength={200}
                />
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  { borderColor: Colors[colorScheme ?? 'light'].text + '30' }
                ]}
                onPress={handleClose}
              >
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.saveButton,
                  { backgroundColor: Colors[colorScheme ?? 'light'].tint }
                ]}
                onPress={handleSave}
              >
                <ThemedText style={styles.saveButtonText}>Save</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    maxHeight: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    maxHeight: 400,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  categoryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: 'center',
  },
  categoryButtonActive: {
    borderWidth: 2,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  activityButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
  },
  activityButtonActive: {
    borderWidth: 2,
  },
  activityText: {
    fontSize: 14,
  },
  intensityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  intensityButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  intensityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 2,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    // backgroundColor set dynamically
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});