export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      albums: {
        Row: {
          artist: string
          cover_url: string | null
          created_at: string | null
          created_by: string | null
          genre: string | null
          id: string
          release_year: number | null
          title: string
        }
        Insert: {
          artist: string
          cover_url?: string | null
          created_at?: string | null
          created_by?: string | null
          genre?: string | null
          id?: string
          release_year?: number | null
          title: string
        }
        Update: {
          artist?: string
          cover_url?: string | null
          created_at?: string | null
          created_by?: string | null
          genre?: string | null
          id?: string
          release_year?: number | null
          title?: string
        }
        Relationships: []
      }
      client_payments: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          id: string
          payment_provider: string | null
          payment_reference: string | null
          plan_type: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          id?: string
          payment_provider?: string | null
          payment_reference?: string | null
          plan_type?: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          id?: string
          payment_provider?: string | null
          payment_reference?: string | null
          plan_type?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "platform_clients"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          certificate_issued_at: string | null
          certificate_photo_url: string | null
          certificate_url: string | null
          created_at: string
          id: string
          is_premium: boolean | null
          premium_activated_at: string | null
          user_id: string
        }
        Insert: {
          certificate_issued_at?: string | null
          certificate_photo_url?: string | null
          certificate_url?: string | null
          created_at?: string
          id?: string
          is_premium?: boolean | null
          premium_activated_at?: string | null
          user_id: string
        }
        Update: {
          certificate_issued_at?: string | null
          certificate_photo_url?: string | null
          certificate_url?: string | null
          created_at?: string
          id?: string
          is_premium?: boolean | null
          premium_activated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      course_lessons: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          module_id: string
          order_index: number
          title: string
          updated_at: string
          video_file_url: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          module_id: string
          order_index?: number
          title: string
          updated_at?: string
          video_file_url?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          module_id?: string
          order_index?: number
          title?: string
          updated_at?: string
          video_file_url?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title: string
          updated_at?: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      course_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_provider: string | null
          payment_reference: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payment_provider?: string | null
          payment_reference?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_provider?: string | null
          payment_reference?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          payment_provider: string | null
          payment_reference: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          payment_provider?: string | null
          payment_reference?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          payment_provider?: string | null
          payment_reference?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_clients: {
        Row: {
          additional_notes: string | null
          admin_instructions: string | null
          created_at: string
          email: string
          existing_site_url: string | null
          full_name: string
          id: string
          infinitepay_username: string | null
          is_paid: boolean | null
          paid_at: string | null
          payment_link: string | null
          pending_plan_type: string | null
          phone_number: string | null
          plan_amount: number | null
          plan_type: string | null
          product_description: string | null
          product_name: string | null
          product_price: number | null
          product_type: string | null
          site_blocked: boolean | null
          site_completed_at: string | null
          site_description_count: number | null
          site_status: string | null
          site_url: string | null
          subscription_ends_at: string | null
          target_audience: string | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
          whatsapp: string
        }
        Insert: {
          additional_notes?: string | null
          admin_instructions?: string | null
          created_at?: string
          email: string
          existing_site_url?: string | null
          full_name: string
          id?: string
          infinitepay_username?: string | null
          is_paid?: boolean | null
          paid_at?: string | null
          payment_link?: string | null
          pending_plan_type?: string | null
          phone_number?: string | null
          plan_amount?: number | null
          plan_type?: string | null
          product_description?: string | null
          product_name?: string | null
          product_price?: number | null
          product_type?: string | null
          site_blocked?: boolean | null
          site_completed_at?: string | null
          site_description_count?: number | null
          site_status?: string | null
          site_url?: string | null
          subscription_ends_at?: string | null
          target_audience?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
          whatsapp: string
        }
        Update: {
          additional_notes?: string | null
          admin_instructions?: string | null
          created_at?: string
          email?: string
          existing_site_url?: string | null
          full_name?: string
          id?: string
          infinitepay_username?: string | null
          is_paid?: boolean | null
          paid_at?: string | null
          payment_link?: string | null
          pending_plan_type?: string | null
          phone_number?: string | null
          plan_amount?: number | null
          plan_type?: string | null
          product_description?: string | null
          product_name?: string | null
          product_price?: number | null
          product_type?: string | null
          site_blocked?: boolean | null
          site_completed_at?: string | null
          site_description_count?: number | null
          site_status?: string | null
          site_url?: string | null
          subscription_ends_at?: string | null
          target_audience?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
          whatsapp?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          created_at: string
          facebook_pixel_code: string | null
          id: string
          infinitepay_link: string | null
          product_slug: string
          thank_you_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          facebook_pixel_code?: string | null
          id?: string
          infinitepay_link?: string | null
          product_slug: string
          thank_you_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          facebook_pixel_code?: string | null
          id?: string
          infinitepay_link?: string | null
          product_slug?: string
          thank_you_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_premium: boolean | null
          premium_activated_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          is_premium?: boolean | null
          premium_activated_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_premium?: boolean | null
          premium_activated_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tracks: {
        Row: {
          album_id: string | null
          artist: string
          audio_url: string
          created_at: string | null
          duration_seconds: number | null
          id: string
          title: string
          track_number: number | null
        }
        Insert: {
          album_id?: string | null
          artist: string
          audio_url: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          title: string
          track_number?: number | null
        }
        Update: {
          album_id?: string | null
          artist?: string
          audio_url?: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          title?: string
          track_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tracks_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_connections: {
        Row: {
          created_at: string
          id: string
          name: string
          phone_number: string | null
          qr_code: string | null
          session_data: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone_number?: string | null
          qr_code?: string | null
          session_data?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone_number?: string | null
          qr_code?: string | null
          session_data?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_contacts: {
        Row: {
          avatar_url: string | null
          connection_id: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone_number: string
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          connection_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone_number: string
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          connection_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone_number?: string
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_contacts_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_conversations: {
        Row: {
          connection_id: string | null
          contact_id: string | null
          created_at: string
          id: string
          last_message: string | null
          last_message_at: string | null
          status: string | null
          unread_count: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          connection_id?: string | null
          contact_id?: string | null
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          status?: string | null
          unread_count?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          connection_id?: string | null
          contact_id?: string | null
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          status?: string | null
          unread_count?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_conversations_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_conversations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_flows: {
        Row: {
          actions: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          trigger_type: string
          trigger_value: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          trigger_type: string
          trigger_value?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actions?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          trigger_type?: string
          trigger_value?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          direction: string
          id: string
          media_url: string | null
          message_type: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          direction?: string
          id?: string
          media_url?: string | null
          message_type?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          direction?: string
          id?: string
          media_url?: string | null
          message_type?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_scheduled_messages: {
        Row: {
          connection_id: string | null
          contact_id: string | null
          content: string
          created_at: string
          id: string
          recurrence: string | null
          scheduled_at: string
          status: string | null
          user_id: string
        }
        Insert: {
          connection_id?: string | null
          contact_id?: string | null
          content: string
          created_at?: string
          id?: string
          recurrence?: string | null
          scheduled_at: string
          status?: string | null
          user_id: string
        }
        Update: {
          connection_id?: string | null
          contact_id?: string | null
          content?: string
          created_at?: string
          id?: string
          recurrence?: string | null
          scheduled_at?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_scheduled_messages_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_scheduled_messages_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_settings: {
        Row: {
          auto_reply_enabled: boolean | null
          auto_reply_message: string | null
          created_at: string
          id: string
          notifications_enabled: boolean | null
          plan_type: string | null
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          auto_reply_enabled?: boolean | null
          auto_reply_message?: string | null
          created_at?: string
          id?: string
          notifications_enabled?: boolean | null
          plan_type?: string | null
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          auto_reply_enabled?: boolean | null
          auto_reply_message?: string | null
          created_at?: string
          id?: string
          notifications_enabled?: boolean | null
          plan_type?: string | null
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_premium: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
