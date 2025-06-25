export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          summoner_name: string
          riot_puuid: string | null
          riot_tag_line: string | null
          summoner_level: number
          summoner_icon_url: string | null
          total_battles: number
          wins: number
          losses: number
          favorite_stat: string | null
          highest_damage: number
          longest_win_streak: number
          current_win_streak: number
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          summoner_name: string
          riot_puuid?: string | null
          riot_tag_line?: string | null
          summoner_level?: number
          summoner_icon_url?: string | null
          total_battles?: number
          wins?: number
          losses?: number
          favorite_stat?: string | null
          highest_damage?: number
          longest_win_streak?: number
          current_win_streak?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          summoner_name?: string
          riot_puuid?: string | null
          riot_tag_line?: string | null
          summoner_level?: number
          summoner_icon_url?: string | null
          total_battles?: number
          wins?: number
          losses?: number
          favorite_stat?: string | null
          highest_damage?: number
          longest_win_streak?: number
          current_win_streak?: number
        }
      }
      battles: {
        Row: {
          id: string
          created_at: string
          player1_id: string | null
          player2_id: string | null
          winner_id: string | null
          rounds_played: number
          total_damage: number
          battle_duration: number
          rounds_data: Json | null
          battle_type: string
        }
        Insert: {
          id?: string
          created_at?: string
          player1_id?: string | null
          player2_id?: string | null
          winner_id?: string | null
          rounds_played?: number
          total_damage?: number
          battle_duration?: number
          rounds_data?: Json | null
          battle_type?: string
        }
        Update: {
          id?: string
          created_at?: string
          player1_id?: string | null
          player2_id?: string | null
          winner_id?: string | null
          rounds_played?: number
          total_damage?: number
          battle_duration?: number
          rounds_data?: Json | null
          battle_type?: string
        }
      }
    }
    Views: {
      battle_stats: {
        Row: {
          id: string
          summoner_name: string
          total_battles: number
          wins: number
          losses: number
          win_rate: number
          current_win_streak: number
          longest_win_streak: number
          favorite_stat: string | null
          highest_damage: number
        }
      }
      leaderboard: {
        Row: {
          rank: number
          id: string
          summoner_name: string
          total_battles: number
          wins: number
          losses: number
          win_rate: number
          current_win_streak: number
          longest_win_streak: number
          favorite_stat: string | null
          highest_damage: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}