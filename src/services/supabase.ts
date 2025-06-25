import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = {
  // Sign up with email and password
  async signUp(email: string, password: string, metadata?: { summoner_name?: string; riot_puuid?: string }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Get user profile
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Create or update profile (upsert)
  async upsertProfile(profile: Database['public']['Tables']['profiles']['Insert']) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile)
      .select()
      .single();
    return { data, error };
  },

  // Save battle result
  async saveBattle(battleData: {
    player1_id: string;
    player2_id: string;
    winner_id: string;
    rounds_played: number;
    total_damage: number;
    battle_duration: number;
    rounds_data: any;
    battle_type?: string;
  }) {
    const { data, error } = await supabase
      .from('battles')
      .insert(battleData)
      .select()
      .single();
    return { data, error };
  },

  // Get battle history for a user
  async getBattleHistory(userId: string, limit = 10) {
    const { data, error } = await supabase
      .from('battles')
      .select(`
        *,
        player1:profiles!battles_player1_id_fkey(summoner_name, summoner_icon_url),
        player2:profiles!battles_player2_id_fkey(summoner_name, summoner_icon_url),
        winner:profiles!battles_winner_id_fkey(summoner_name, summoner_icon_url)
      `)
      .or(`player1_id.eq.${userId},player2_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(limit);
    return { data, error };
  },

  // Get leaderboard
  async getLeaderboard(limit = 50) {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(limit);
    return { data, error };
  },

  // Get battle stats for a user
  async getBattleStats(userId: string) {
    const { data, error } = await supabase
      .from('battle_stats')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Real-time subscriptions
  subscribeToBattles(callback: (payload: any) => void) {
    return supabase
      .channel('battles')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'battles' }, callback)
      .subscribe();
  },

  subscribeToLeaderboard(callback: (payload: any) => void) {
    return supabase
      .channel('leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, callback)
      .subscribe();
  }
};

export default supabase;