
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
                },"beta_invites": {
                  Row: {
                    "created_at": string,"email": string,"note": string | null
                  }
                  Insert: {
                    "created_at"?: string,"email": string,"note"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"email"?: string,"note"?: string | null
                  }
                  Relationships: [
                    
                  ]
                },"challenges": {
                  Row: {
                    "completed_at": string | null,"created_at": string,"expires_at": string,"friendship_id": string,"from_child": string,"from_correct": number | null,"game_id": string,"id": string,"level": number,"seed": number,"to_child": string,"to_correct": number | null,"total": number
                  }
                  Insert: {
                    "completed_at"?: string | null,"created_at"?: string,"expires_at"?: string,"friendship_id": string,"from_child": string,"from_correct"?: number | null,"game_id": string,"id"?: string,"level": number,"seed": number,"to_child": string,"to_correct"?: number | null,"total"?: number
                  }
                  Update: {
                    "completed_at"?: string | null,"created_at"?: string,"expires_at"?: string,"friendship_id"?: string,"from_child"?: string,"from_correct"?: number | null,"game_id"?: string,"id"?: string,"level"?: number,"seed"?: number,"to_child"?: string,"to_correct"?: number | null,"total"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "challenges_friendship_id_fkey"
      columns: ["friendship_id"]
isOneToOne: false
      referencedRelation: "friendships"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "challenges_from_child_fkey"
      columns: ["from_child"]
isOneToOne: false
      referencedRelation: "children"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "challenges_to_child_fkey"
      columns: ["to_child"]
isOneToOne: false
      referencedRelation: "children"
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
                },"friend_invites": {
                  Row: {
                    "child_id": string,"code": string,"created_at": string,"expires_at": string,"id": string,"parent_id": string,"used_at": string | null
                  }
                  Insert: {
                    "child_id": string,"code": string,"created_at"?: string,"expires_at"?: string,"id"?: string,"parent_id": string,"used_at"?: string | null
                  }
                  Update: {
                    "child_id"?: string,"code"?: string,"created_at"?: string,"expires_at"?: string,"id"?: string,"parent_id"?: string,"used_at"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "friend_invites_child_id_fkey"
      columns: ["child_id"]
isOneToOne: false
      referencedRelation: "children"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "friend_invites_parent_id_fkey"
      columns: ["parent_id"]
isOneToOne: false
      referencedRelation: "parents"
      referencedColumns: ["id"]
    }
                  ]
                },"friend_messages": {
                  Row: {
                    "content": string,"created_at": string,"delivered": boolean,"expires_at": string,"flag_category": Database["public"]['Enums']["safety_category"] | null,"friendship_id": string,"from_child": string,"id": string,"kind": Database["public"]['Enums']["friend_message_kind"],"read_at": string | null,"to_child": string
                  }
                  Insert: {
                    "content": string,"created_at"?: string,"delivered"?: boolean,"expires_at"?: string,"flag_category"?: Database["public"]['Enums']["safety_category"] | null,"friendship_id": string,"from_child": string,"id"?: string,"kind": Database["public"]['Enums']["friend_message_kind"],"read_at"?: string | null,"to_child": string
                  }
                  Update: {
                    "content"?: string,"created_at"?: string,"delivered"?: boolean,"expires_at"?: string,"flag_category"?: Database["public"]['Enums']["safety_category"] | null,"friendship_id"?: string,"from_child"?: string,"id"?: string,"kind"?: Database["public"]['Enums']["friend_message_kind"],"read_at"?: string | null,"to_child"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "friend_messages_friendship_id_fkey"
      columns: ["friendship_id"]
isOneToOne: false
      referencedRelation: "friendships"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "friend_messages_from_child_fkey"
      columns: ["from_child"]
isOneToOne: false
      referencedRelation: "children"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "friend_messages_to_child_fkey"
      columns: ["to_child"]
isOneToOne: false
      referencedRelation: "children"
      referencedColumns: ["id"]
    }
                  ]
                },"friendships": {
                  Row: {
                    "blocked_by": string | null,"child_a": string,"child_b": string,"created_at": string,"id": string,"parent_a": string,"parent_b": string,"status": Database["public"]['Enums']["friendship_status"]
                  }
                  Insert: {
                    "blocked_by"?: string | null,"child_a": string,"child_b": string,"created_at"?: string,"id"?: string,"parent_a": string,"parent_b": string,"status"?: Database["public"]['Enums']["friendship_status"]
                  }
                  Update: {
                    "blocked_by"?: string | null,"child_a"?: string,"child_b"?: string,"created_at"?: string,"id"?: string,"parent_a"?: string,"parent_b"?: string,"status"?: Database["public"]['Enums']["friendship_status"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "friendships_blocked_by_fkey"
      columns: ["blocked_by"]
isOneToOne: false
      referencedRelation: "children"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "friendships_child_a_fkey"
      columns: ["child_a"]
isOneToOne: false
      referencedRelation: "children"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "friendships_child_b_fkey"
      columns: ["child_b"]
isOneToOne: false
      referencedRelation: "children"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "friendships_parent_a_fkey"
      columns: ["parent_a"]
isOneToOne: false
      referencedRelation: "parents"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "friendships_parent_b_fkey"
      columns: ["parent_b"]
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
                    "category": Database["public"]['Enums']["safety_category"],"child_id": string,"created_at": string,"expires_at": string,"friend_message_id": string | null,"id": string,"message_id": string | null,"parent_id": string,"seen_at": string | null,"severity": Database["public"]['Enums']["alert_severity"]
                  }
                  Insert: {
                    "category": Database["public"]['Enums']["safety_category"],"child_id": string,"created_at"?: string,"expires_at"?: string,"friend_message_id"?: string | null,"id"?: string,"message_id"?: string | null,"parent_id": string,"seen_at"?: string | null,"severity": Database["public"]['Enums']["alert_severity"]
                  }
                  Update: {
                    "category"?: Database["public"]['Enums']["safety_category"],"child_id"?: string,"created_at"?: string,"expires_at"?: string,"friend_message_id"?: string | null,"id"?: string,"message_id"?: string | null,"parent_id"?: string,"seen_at"?: string | null,"severity"?: Database["public"]['Enums']["alert_severity"]
                  }
                  Relationships: [
                    {
      foreignKeyName: "safety_alerts_child_id_fkey"
      columns: ["child_id"]
isOneToOne: false
      referencedRelation: "children"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "safety_alerts_friend_message_id_fkey"
      columns: ["friend_message_id"]
isOneToOne: false
      referencedRelation: "friend_messages"
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
            "hook_before_user_created":
{ Args: { "event": Json }; Returns: Json
                           }
          }
          Enums: {
            "alert_severity": "info"|"warning"|"urgent","chat_mode": "socratic"|"direct","friend_message_kind": "sticker"|"phrase"|"text","friendship_status": "active"|"blocked","grade": "pre3"|"pre4"|"pre5"|"g1"|"g2"|"g3"|"g4"|"g5"|"m1"|"m2"|"m3","message_role": "child"|"assistant","safety_category": "self_harm"|"abuse"|"bullying"|"sexual"|"violence"|"dangerous"|"hate"|"personal_info"|"other"|"friend_report"
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
            "alert_severity": ["info", "warning", "urgent"],"chat_mode": ["socratic", "direct"],"friend_message_kind": ["sticker", "phrase", "text"],"friendship_status": ["active", "blocked"],"grade": ["pre3", "pre4", "pre5", "g1", "g2", "g3", "g4", "g5", "m1", "m2", "m3"],"message_role": ["child", "assistant"],"safety_category": ["self_harm", "abuse", "bullying", "sexual", "violence", "dangerous", "hate", "personal_info", "other", "friend_report"]
          }
        }
} as const
