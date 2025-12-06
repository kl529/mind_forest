export interface ActivityEntry {
  id: string;
  date: Date;
  entry_type: 'stress' | 'relief';
  category: 'physical' | 'emotional' | 'behavioral';
  reaction: string; // e.g., "두근거림", "불안", "피로", "짜증"
  intensity: number; // 1-5
  notes?: string;
  user_id?: string; // For Supabase
}

export interface StressLevel {
  date: string; // YYYY-MM-DD
  totalStressScore: number;
  totalReliefScore: number;
  netStressLevel: number; // calculated stress level
}

export interface ActivityCategory {
  id: string;
  name: string;
  type: 'stress' | 'stress-relief';
}

export interface TerrariumState {
  healthLevel: number; // 1-10, affects terrarium appearance
  visualState: 'thriving' | 'healthy' | 'neutral' | 'stressed' | 'struggling';
}

export interface StressNotification {
  level: 'low' | 'moderate' | 'high';
  message: string;
  suggestions: string[];
}

export interface MonthlyStats {
  month: string; // YYYY-MM
  averageStress: number;
  averageRelief: number;
  totalEntries: number;
  mostCommonStressor: string;
  mostCommonRelief: string;
}

export type TabScreen = 'home' | 'entry' | 'calendar' | 'terrarium';

export interface WeeklyStats {
  totalEntries: number;
  streakDays: number;
  weekData: { day: string; count: number; avgIntensity: number }[];
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  entries: ActivityEntry[];
  avgIntensity: number;
}

export interface HealthTip {
  id: string;
  title: string;
  description: string;
  category: 'breathing' | 'movement' | 'mindfulness' | 'social' | 'sleep';
}

export interface CalendarDay {
  date: string; // YYYY-MM-DD
  stressLevel: number;
  colorIntensity: 'light' | 'medium' | 'dark';
  colorType: 'blue' | 'red' | 'neutral';
}