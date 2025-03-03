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
      customers: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string
          gohighlevel_id: string | null
          id: string
          last_name: string
          loyalty_points: number | null
          notes: string | null
          phone: string | null
          photo_url: string | null
          stripe_customer_id: string | null
          tier: string | null
          total_spend: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name: string
          gohighlevel_id?: string | null
          id?: string
          last_name: string
          loyalty_points?: number | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          stripe_customer_id?: string | null
          tier?: string | null
          total_spend?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string
          gohighlevel_id?: string | null
          id?: string
          last_name?: string
          loyalty_points?: number | null
          notes?: string | null
          phone?: string | null
          photo_url?: string | null
          stripe_customer_id?: string | null
          tier?: string | null
          total_spend?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      gift_cards: {
        Row: {
          code: string
          created_at: string | null
          created_by_staff_id: string | null
          current_value: number
          customer_id: string | null
          expires_at: string | null
          id: string
          initial_value: number
          is_active: boolean
          redeemed_at: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by_staff_id?: string | null
          current_value: number
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          initial_value: number
          is_active?: boolean
          redeemed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by_staff_id?: string | null
          current_value?: number
          customer_id?: string | null
          expires_at?: string | null
          id?: string
          initial_value?: number
          is_active?: boolean
          redeemed_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gift_cards_created_by_staff_id_fkey"
            columns: ["created_by_staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_cards_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          color: string | null
          created_at: string | null
          flavor: string | null
          id: string
          price: number | null
          product_id: string
          size: string | null
          sku: string | null
          stock_count: number | null
          updated_at: string | null
          variant_attributes: Json | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          flavor?: string | null
          id?: string
          price?: number | null
          product_id: string
          size?: string | null
          sku?: string | null
          stock_count?: number | null
          updated_at?: string | null
          variant_attributes?: Json | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          flavor?: string | null
          id?: string
          price?: number | null
          product_id?: string
          size?: string | null
          sku?: string | null
          stock_count?: number | null
          updated_at?: string | null
          variant_attributes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          category: string | null
          category_id: string | null
          cost: number | null
          created_at: string | null
          description: string | null
          has_variants: boolean | null
          id: string
          image_url: string | null
          name: string
          price: number
          sku: string | null
          stock: number | null
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          category?: string | null
          category_id?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          has_variants?: boolean | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          sku?: string | null
          stock?: number | null
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          category?: string | null
          category_id?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          has_variants?: boolean | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          sku?: string | null
          stock?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string | null
          id: string
          store_address: string | null
          store_name: string | null
          store_phone: string | null
          tab_enabled: boolean | null
          tab_max_days: number | null
          tab_threshold: number | null
          tax_rate: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          store_address?: string | null
          store_name?: string | null
          store_phone?: string | null
          tab_enabled?: boolean | null
          tab_max_days?: number | null
          tab_threshold?: number | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          store_address?: string | null
          store_name?: string | null
          store_phone?: string | null
          tab_enabled?: boolean | null
          tab_max_days?: number | null
          tab_threshold?: number | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          auth_id: string | null
          created_at: string | null
          email: string
          first_name: string
          gohighlevel_id: string | null
          id: string
          last_name: string
          role: string
          updated_at: string | null
        }
        Insert: {
          auth_id?: string | null
          created_at?: string | null
          email: string
          first_name: string
          gohighlevel_id?: string | null
          id?: string
          last_name: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          auth_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          gohighlevel_id?: string | null
          id?: string
          last_name?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          cashier_id: string | null
          completed_at: string | null
          created_at: string | null
          customer_id: string | null
          id: string
          items: Json
          payment_method: string | null
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string | null
        }
        Insert: {
          cashier_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          items: Json
          payment_method?: string | null
          status?: string
          subtotal: number
          tax: number
          total: number
          updated_at?: string | null
        }
        Update: {
          cashier_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string | null
          id?: string
          items?: Json
          payment_method?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_cashier_id_fkey"
            columns: ["cashier_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
