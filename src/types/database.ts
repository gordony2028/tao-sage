export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          username: string | null;
          full_name: string | null;
          avatar_url: string | null;
          preferred_language: string;
          timezone: string;
          notification_preferences: {
            daily_guidance: boolean;
            consultation_reminders: boolean;
          };
          subscription_tier: 'free' | 'premium' | 'pro';
          subscription_status: string;
          consultation_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          preferred_language?: string;
          timezone?: string;
          notification_preferences?: {
            daily_guidance?: boolean;
            consultation_reminders?: boolean;
          };
          subscription_tier?: 'free' | 'premium' | 'pro';
          subscription_status?: string;
          consultation_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          preferred_language?: string;
          timezone?: string;
          notification_preferences?: {
            daily_guidance?: boolean;
            consultation_reminders?: boolean;
          };
          subscription_tier?: 'free' | 'premium' | 'pro';
          subscription_status?: string;
          consultation_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      consultations: {
        Row: {
          id: string;
          user_id: string;
          question: string;
          hexagram_number: number;
          hexagram_name: string;
          lines: number[];
          changing_lines: number[];
          interpretation: {
            interpretation: string;
            guidance?: string;
            practicalAdvice?: string;
            culturalContext?: string;
          };
          consultation_method: string;
          ip_address: string | null;
          user_agent: string | null;
          status: 'active' | 'archived';
          tags: string[];
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question: string;
          hexagram_number: number;
          hexagram_name: string;
          lines: number[];
          changing_lines?: number[];
          interpretation: {
            interpretation: string;
            guidance?: string;
            practicalAdvice?: string;
            culturalContext?: string;
          };
          consultation_method?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          status?: 'active' | 'archived';
          tags?: string[];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question?: string;
          hexagram_number?: number;
          hexagram_name?: string;
          lines?: number[];
          changing_lines?: number[];
          interpretation?: {
            interpretation?: string;
            guidance?: string;
            practicalAdvice?: string;
            culturalContext?: string;
          };
          consultation_method?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          status?: 'active' | 'archived';
          tags?: string[];
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_events: {
        Row: {
          id: string;
          user_id: string | null;
          event_type: string;
          event_data: Record<string, any>;
          session_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_type: string;
          event_data?: Record<string, any>;
          session_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          event_type?: string;
          event_data?: Record<string, any>;
          session_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      consultation_stats: {
        Row: {
          user_id: string;
          total_consultations: number;
          unique_hexagrams: number;
          last_consultation: string | null;
          first_consultation: string | null;
        };
      };
      recent_consultations: {
        Row: {
          id: string;
          user_id: string;
          question: string;
          hexagram_number: number;
          hexagram_name: string;
          created_at: string;
          username: string | null;
          full_name: string | null;
        };
      };
    };
  };
};
