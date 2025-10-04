import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone_number: string | null;
          role: string;
          rating_avg: number;
          rating_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone_number?: string | null;
          role: string;
          rating_avg?: number;
          rating_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone_number?: string | null;
          role?: string;
          rating_avg?: number;
          rating_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          donor_id: string;
          title: string;
          description: string;
          category: string;
          quantity: number;
          image_url: string | null;
          pickup_location: string;
          pickup_instructions: string | null;
          expiry_date: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          donor_id: string;
          title: string;
          description: string;
          category: string;
          quantity: number;
          image_url?: string | null;
          pickup_location: string;
          pickup_instructions?: string | null;
          expiry_date: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          donor_id?: string;
          title?: string;
          description?: string;
          category?: string;
          quantity?: number;
          image_url?: string | null;
          pickup_location?: string;
          pickup_instructions?: string | null;
          expiry_date?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      claims: {
        Row: {
          id: string;
          listing_id: string;
          recipient_id: string;
          quantity: number;
          notes: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          recipient_id: string;
          quantity: number;
          notes?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          recipient_id?: string;
          quantity?: number;
          notes?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
