export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      guests: {
        Row: {
          id: string
          name: string
          institution: string
          purpose: string
          department: string
          person: string
          identity_number: string
          phone_number: string
          email: string
          photo_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          institution: string
          purpose: string
          department: string
          person: string
          identity_number: string
          phone_number: string
          email: string
          photo_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          institution?: string
          purpose?: string
          department?: string
          person?: string
          identity_number?: string
          phone_number?: string
          email?: string
          photo_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      visits: {
        Row: {
          id: string
          guest_id: string
          check_in: string
          check_out: string | null
          status: string
          date: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          guest_id: string
          check_in: string
          check_out?: string | null
          status: string
          date: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          guest_id?: string
          check_in?: string
          check_out?: string | null
          status?: string
          date?: string
          created_at?: string
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
