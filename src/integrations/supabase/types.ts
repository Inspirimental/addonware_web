export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          resource_id: string | null
          resource_type: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          resource_id?: string | null
          resource_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      case_studies: {
        Row: {
          category: string
          client: string
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          published_at: string | null
          slug: string
          summary: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          client: string
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          summary: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          client?: string
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          summary?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string | null
          cv_data: Json | null
          description: string
          email: string
          id: string
          image_url: string | null
          is_active: boolean | null
          linkedin: string
          name: string
          phone: string
          sort_order: number | null
          title: string
          updated_at: string | null
          xing: string
        }
        Insert: {
          created_at?: string | null
          cv_data?: Json | null
          description: string
          email: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin?: string
          name: string
          phone?: string
          sort_order?: number | null
          title: string
          updated_at?: string | null
          xing?: string
        }
        Update: {
          created_at?: string | null
          cv_data?: Json | null
          description?: string
          email?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin?: string
          name?: string
          phone?: string
          sort_order?: number | null
          title?: string
          updated_at?: string | null
          xing?: string
        }
        Relationships: []
      }
      employees_public: {
        Row: {
          created_at: string | null
          description: string
          email: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          linkedin: string | null
          name: string
          phone: string | null
          sort_order: number | null
          title: string
          updated_at: string | null
          xing: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin?: string | null
          name: string
          phone?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
          xing?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          email?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          linkedin?: string | null
          name?: string
          phone?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
          xing?: string | null
        }
        Relationships: []
      }
      files: {
        Row: {
          created_at: string | null
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          original_name: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          original_name: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          original_name?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      homepage_cards: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          link_text: string | null
          link_url: string | null
          sort_order: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          link_text?: string | null
          link_url?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          link_text?: string | null
          link_url?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_admin: boolean | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[keyof Database]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
