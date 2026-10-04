
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "graphql_public": {
          Tables: {
            [_ in never]: never
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "graphql":
{ Args: { "extensions"?: Json,"operationName"?: string,"query"?: string,"variables"?: Json }; Returns: Json
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        },"public": {
          Tables: {
            "activity_results": {
                  Row: {
                    "child_id": string,"correct": number,"created_at": string,"duration_seconds": number,"game_id": string,"id": string,"level": number,"parent_id": string,"subject": string,"total": number
                  }
                  Insert: {
                    "child_id": string,"correct": number,"created_at"?: string,"duration_seconds": number,"game_id": string,"id"?: string,"level": number,"parent_id": string,"subject": string,"total": number
                  }
                  Update: {
                    "child_id"?: string,"correct"?: number,"created_at"?: string,"duration_seconds"?: number,"game_id"?: string,"id"?: string,"level"?: number,"parent_id"?: string,"subject"?: string,"total"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "activity_results_child_id_fkey"
      columns: ["child_id"]
isOneToOne: false
      referencedRelation: "children"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "activity_results_parent_id_fkey"
      columns: ["parent_id"]
isOneToOne: false
      referencedRelation: "parents"
      referencedColumns: ["id"]
    }
                  ]
                },"chat_messages": {
                  Row: {
                    "child_id": string,"content": string,"created_at": string,"expires_at": string,"flag_category": Database["public"]['Enums']["safety_category"] | null,"flagged": boolean,"id": string,"model": string | null,"parent_id": string,"role": Database["public"]['Enums']["message_role"]
                  }
                  Insert: {
                    "child_id": string,"content": string,"created_at"?: string,"expires_at"?: string,"flag_category"?: Database["public"]['Enums']["safety_category"] | null,"flagged"?: boolean,"id"?: string,"model"?: string | null,"parent_id": string,"role": Database["public"]['Enums']["message_role"]
                  }
                  Update: {
                    "child_id"?: string,"content"?: string,"created_at"?: string,"expires_at"?: string,"flag_category"?: Database["public"]['Enums']["safety_category"] | null,"flagged"?: boolean,"id"?: string,"model"?: string | null,"parent_id"?: string,"role"?: Database["public"]['Enums']["message_role"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "chat_messages_child_id_fkey"
      columns: ["child_id"]
isOneToOne: false
      referencedRelation: "children"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "chat_messages_parent_id_fkey"
      columns: ["parent_id"]
isOneToOne: false
      referencedRelation: "parents"
      referencedColumns: ["id"]
    }
                  ]
                },"children": {
                  Row: {
                    "avatar": string,"chat_enabled": boolean,"created_at": string,"grade": Database["public"]['Enums']["grade"],"id": string,"locale": string | null,"mascot": string | null,"nickname": string,"parent_id": string,"updated_at": string
                  }
                  Insert: {
                    "avatar": string,"chat_enabled"?: boolean,"created_at"?: string,"grade": Database["public"]['Enums']["grade"],"id"?: string,"locale"?: string | null,"mascot"?: string | null,"nickname": string,"parent_id": string,"updated_at"?: string
                  }
                  Update: {
                    "avatar"?: string,"chat_enabled"?: boolean,"created_at"?: string,"grade"?: Database["public"]['Enums']["grade"],"id"?: string,"locale"?: string | null,"mascot"?: string | null,"nickname"?: string,"parent_id"?: string,"updated_at"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "children_parent_id_fkey"
      columns: ["parent_id"]
isOneToOne: false
      referencedRelation: "parents"
      referencedColumns: ["id"]
    }
                  ]
                },"parents": {
                  Row: {
                    "adult_confirmed_at": string | null,"chat_mode": Database["public"]['Enums']["chat_mode"],"consent_at": string | null,"consent_version": string | null,"country": string | null,"created_at": string,"daily_limit_minutes": number | null,"id": string,"locale": string,"pin_failed_attempts": number,"pin_hash": string | null,"pin_locked_until": string | null,"quiet_hours_end": string | null,"quiet_hours_start": string | null,"updated_at": string
                  }
                  Insert: {
                    "adult_confirmed_at"?: string | null,"chat_mode"?: Database["public"]['Enums']["chat_mode"],"consent_at"?: string | null,"consent_version"?: string | null,"country"?: string | null,"created_at"?: string,"daily_limit_minutes"?: number | null,"id": string,"locale"?: string,"pin_failed_attempts"?: number,"pin_hash"?: string | null,"pin_locked_until"?: string | null,"quiet_hours_end"?: string | null,"quiet_hours_start"?: string | null,"updated_at"?: string
                  }
                  Update: {
                    "adult_confirmed_at"?: string | null,"chat_mode"?: Database["public"]['Enums']["chat_mode"],"consent_at"?: string | null,"consent_version"?: string | null,"country"?: string | null,"created_at"?: string,"daily_limit_minutes"?: number | null,"id"?: string,"locale"?: string,"pin_failed_attempts"?: number,"pin_hash"?: string | null,"pin_locked_until"?: string | null,"quiet_hours_end"?: string | null,"quiet_hours_start"?: string | null,"updated_at"?: string
                  }
                  Relationships: [
                    
                  ]
                },"safety_alerts": {
                  Row: {
                    "category": Database["public"]['Enums']["safety_category"],"child_id": string,"created_at": string,"expires_at": string,"id": string,"message_id": string | null,"parent_id": string,"seen_at": string | null,"severity": Database["public"]['Enums']["alert_severity"]
                  }
                  Insert: {
                    "category": Database["public"]['Enums']["safety_category"],"child_id": string,"created_at"?: string,"expires_at"?: string,"id"?: string,"message_id"?: string | null,"parent_id": string,"seen_at"?: string | null,"severity": Database["public"]['Enums']["alert_severity"]
                  }
                  Update: {
                    "category"?: Database["public"]['Enums']["safety_category"],"child_id"?: string,"created_at"?: string,"expires_at"?: string,"id"?: string,"message_id"?: string | null,"parent_id"?: string,"seen_at"?: string | null,"severity"?: Database["public"]['Enums']["alert_severity"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "safety_alerts_child_id_fkey"
      columns: ["child_id"]
isOneToOne: false
      referencedRelation: "children"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "safety_alerts_message_id_fkey"
      columns: ["message_id"]
isOneToOne: false
      referencedRelation: "chat_messages"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "safety_alerts_parent_id_fkey"
      columns: ["parent_id"]
isOneToOne: false
      referencedRelation: "parents"
      referencedColumns: ["id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            [_ in never]: never
          }
          Enums: {
            "alert_severity": "info"|"warning"|"urgent","chat_mode": "socratic"|"direct","grade": "pre3"|"pre4"|"pre5"|"g1"|"g2"|"g3"|"g4"|"g5"|"m1"|"m2"|"m3","message_role": "child"|"assistant","safety_category": "self_harm"|"abuse"|"bullying"|"sexual"|"violence"|"dangerous"|"hate"|"personal_info"|"other"
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
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
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "graphql_public": {
          Enums: {
            
          }
        },"public": {
          Enums: {
            "alert_severity": ["info", "warning", "urgent"],"chat_mode": ["socratic", "direct"],"grade": ["pre3", "pre4", "pre5", "g1", "g2", "g3", "g4", "g5", "m1", "m2", "m3"],"message_role": ["child", "assistant"],"safety_category": ["self_harm", "abuse", "bullying", "sexual", "violence", "dangerous", "hate", "personal_info", "other"]
          }
        }
} as const
