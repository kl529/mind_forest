import { supabase } from '@/lib/supabase';
import { ActivityEntry } from '@/types';

export class SupabaseService {
  /**
   * Save a new activity entry
   */
  static async saveEntry(entry: Omit<ActivityEntry, 'id' | 'user_id'>): Promise<ActivityEntry | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('activity_entries')
        .insert([
          {
            user_id: user.id,
            entry_type: entry.entry_type,
            category: entry.category,
            reaction: entry.reaction,
            intensity: entry.intensity,
            notes: entry.notes || null,
            entry_date: entry.date.toISOString().split('T')[0], // YYYY-MM-DD
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        date: new Date(data.entry_date),
        entry_type: data.entry_type,
        category: data.category,
        reaction: data.reaction,
        intensity: data.intensity,
        notes: data.notes,
        user_id: data.user_id,
      };
    } catch (error) {
      console.error('Error saving entry:', error);
      return null;
    }
  }

  /**
   * Get entries for a specific date range
   */
  static async getEntriesForDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<ActivityEntry[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return [];
      }

      const start = startDate.toISOString().split('T')[0];
      const end = endDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('activity_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('entry_date', start)
        .lte('entry_date', end)
        .order('entry_date', { ascending: false });

      if (error) throw error;

      return (data || []).map((item) => ({
        id: item.id,
        date: new Date(item.entry_date),
        entry_type: item.entry_type,
        category: item.category,
        reaction: item.reaction,
        intensity: item.intensity,
        notes: item.notes,
        user_id: item.user_id,
      }));
    } catch (error) {
      console.error('Error fetching entries:', error);
      return [];
    }
  }

  /**
   * Get entries for a specific month
   */
  static async getEntriesForMonth(year: number, month: number): Promise<ActivityEntry[]> {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return this.getEntriesForDateRange(startDate, endDate);
  }

  /**
   * Get entries for a specific date
   */
  static async getEntriesForDate(date: Date): Promise<ActivityEntry[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return [];
      }

      const dateString = date.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('activity_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', dateString)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map((item) => ({
        id: item.id,
        date: new Date(item.entry_date),
        entry_type: item.entry_type,
        category: item.category,
        reaction: item.reaction,
        intensity: item.intensity,
        notes: item.notes,
        user_id: item.user_id,
      }));
    } catch (error) {
      console.error('Error fetching entries for date:', error);
      return [];
    }
  }

  /**
   * Delete an entry
   */
  static async deleteEntry(entryId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('activity_entries')
        .delete()
        .eq('id', entryId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting entry:', error);
      return false;
    }
  }

  /**
   * Get current user's streak
   */
  static async getUserStreak(): Promise<{ current: number; longest: number } | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return null;
      }

      const { data, error } = await supabase
        .from('user_streaks')
        .select('current_streak, longest_streak')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If no streak record exists, return 0
        if (error.code === 'PGRST116') {
          return { current: 0, longest: 0 };
        }
        throw error;
      }

      return {
        current: data.current_streak,
        longest: data.longest_streak,
      };
    } catch (error) {
      console.error('Error fetching user streak:', error);
      return null;
    }
  }

  /**
   * Sign up with email
   */
  static async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  }

  /**
   * Sign in with email
   */
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  /**
   * Sign out
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  /**
   * Get current user
   */
  static async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }
}
