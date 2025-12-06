import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { ThemedText } from './ThemedText';

interface TerrariumViewProps {
  stressLevel: number; // 1-10
}

export function TerrariumView({ stressLevel }: TerrariumViewProps) {
  const colorScheme = useColorScheme();
  
  const getVisualState = (level: number) => {
    if (level <= 2) return 'thriving';
    if (level <= 4) return 'healthy';
    if (level <= 6) return 'neutral';
    if (level <= 8) return 'stressed';
    return 'struggling';
  };

  const getColorsForState = (state: string) => {
    const baseColors = Colors[colorScheme ?? 'light'];
    
    switch (state) {
      case 'thriving':
        return {
          background: '#E8F5E8',
          plants: '#4CAF50',
          accent: '#81C784',
          soil: '#8D6E63'
        };
      case 'healthy':
        return {
          background: '#F3E5F5',
          plants: '#66BB6A',
          accent: '#A5D6A7',
          soil: '#8D6E63'
        };
      case 'neutral':
        return {
          background: '#FFF3E0',
          plants: '#FFC107',
          accent: '#FFD54F',
          soil: '#8D6E63'
        };
      case 'stressed':
        return {
          background: '#FFEBEE',
          plants: '#FF9800',
          accent: '#FFAB91',
          soil: '#8D6E63'
        };
      case 'struggling':
        return {
          background: '#FAFAFA',
          plants: '#FF5722',
          accent: '#FFAB91',
          soil: '#8D6E63'
        };
      default:
        return {
          background: baseColors.background,
          plants: '#4CAF50',
          accent: '#81C784',
          soil: '#8D6E63'
        };
    }
  };

  const visualState = getVisualState(stressLevel);
  const colors = getColorsForState(visualState);

  const getStateEmoji = (state: string) => {
    switch (state) {
      case 'thriving': return '🌺';
      case 'healthy': return '🌿';
      case 'neutral': return '🍃';
      case 'stressed': return '🥀';
      case 'struggling': return '💀';
      default: return '🌱';
    }
  };

  const getStateMessage = (state: string) => {
    switch (state) {
      case 'thriving': return 'Your terrarium is thriving!';
      case 'healthy': return 'Your terrarium looks healthy';
      case 'neutral': return 'Your terrarium is stable';
      case 'stressed': return 'Your terrarium needs attention';
      case 'struggling': return 'Your terrarium is struggling';
      default: return 'Growing...';
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.terrarium, { backgroundColor: colors.background }]}>
        {/* Glass container outline */}
        <View style={styles.glassContainer}>
          
          {/* Soil layer */}
          <View style={[styles.soil, { backgroundColor: colors.soil }]} />
          
          {/* Plants based on stress level */}
          <View style={styles.plantsContainer}>
            {/* Main plant */}
            <View style={styles.plantRow}>
              <View 
                style={[
                  styles.plant, 
                  styles.mainPlant,
                  { backgroundColor: colors.plants }
                ]} 
              />
              {stressLevel <= 6 && (
                <View 
                  style={[
                    styles.plant, 
                    styles.smallPlant,
                    { backgroundColor: colors.accent }
                  ]} 
                />
              )}
            </View>
            
            {/* Additional plants for lower stress */}
            {stressLevel <= 4 && (
              <View style={styles.plantRow}>
                <View 
                  style={[
                    styles.plant, 
                    styles.tinyPlant,
                    { backgroundColor: colors.plants }
                  ]} 
                />
                <View 
                  style={[
                    styles.plant, 
                    styles.tinyPlant,
                    { backgroundColor: colors.accent }
                  ]} 
                />
              </View>
            )}
            
            {/* Flowers for thriving state */}
            {stressLevel <= 2 && (
              <View style={styles.flowerContainer}>
                <ThemedText style={styles.flower}>🌸</ThemedText>
                <ThemedText style={styles.flower}>🌺</ThemedText>
              </View>
            )}
          </View>
          
          {/* Decorative elements */}
          <View style={styles.decorations}>
            {stressLevel <= 5 && <ThemedText style={styles.decoration}>💎</ThemedText>}
            {stressLevel <= 3 && <ThemedText style={styles.decoration}>🦋</ThemedText>}
          </View>
        </View>
      </View>
      
      <View style={styles.statusContainer}>
        <ThemedText style={styles.stateEmoji}>
          {getStateEmoji(visualState)}
        </ThemedText>
        <ThemedText style={styles.stateMessage}>
          {getStateMessage(visualState)}
        </ThemedText>
      </View>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  terrarium: {
    width: Math.min(250, width * 0.7),
    height: Math.min(250, width * 0.7),
    borderRadius: 125,
    position: 'relative',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  glassContainer: {
    flex: 1,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
    position: 'relative',
  },
  soil: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '25%',
    borderBottomLeftRadius: 122,
    borderBottomRightRadius: 122,
  },
  plantsContainer: {
    position: 'absolute',
    bottom: '20%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  plantRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 15,
    marginBottom: 10,
  },
  plant: {
    borderRadius: 10,
  },
  mainPlant: {
    width: 20,
    height: 60,
  },
  smallPlant: {
    width: 15,
    height: 40,
  },
  tinyPlant: {
    width: 10,
    height: 25,
  },
  flowerContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: -20,
  },
  flower: {
    fontSize: 16,
  },
  decorations: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    right: '20%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  decoration: {
    fontSize: 12,
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  stateEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  stateMessage: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});