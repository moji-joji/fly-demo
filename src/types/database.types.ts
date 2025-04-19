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
      credits: {
        Row: {
          created_at: string
          credits: number
          id: string
          planType: Database["public"]["Enums"]["Plan Type"]
          proPlanExpirationDate: string | null
          userId: string | null
        }
        Insert: {
          created_at?: string
          credits?: number
          id?: string
          planType?: Database["public"]["Enums"]["Plan Type"]
          proPlanExpirationDate?: string | null
          userId?: string | null
        }
        Update: {
          created_at?: string
          credits?: number
          id?: string
          planType?: Database["public"]["Enums"]["Plan Type"]
          proPlanExpirationDate?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credits_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          id: number
          rating: number | null
          text: string | null
          userId: string
        }
        Insert: {
          created_at?: string
          id?: number
          rating?: number | null
          text?: string | null
          userId?: string
        }
        Update: {
          created_at?: string
          id?: number
          rating?: number | null
          text?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      inspirations: {
        Row: {
          category: string
          createdAt: string
          id: string
          isSaved: boolean
          text: string
          userId: string
        }
        Insert: {
          category: string
          createdAt?: string
          id?: string
          isSaved?: boolean
          text: string
          userId?: string
        }
        Update: {
          category?: string
          createdAt?: string
          id?: string
          isSaved?: boolean
          text?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "inspirations_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          createdAt: string
          edited: boolean
          id: string
          postId: string
          role: string
          userId: string
        }
        Insert: {
          content: string
          createdAt?: string
          edited?: boolean
          id?: string
          postId: string
          role: string
          userId?: string
        }
        Update: {
          content?: string
          createdAt?: string
          edited?: boolean
          id?: string
          postId?: string
          role?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      postIterations: {
        Row: {
          createdAt: string
          id: number
          isManuallyEdited: boolean
          postId: string
          text: string
          userId: string
          userMessage: string | null
        }
        Insert: {
          createdAt?: string
          id?: number
          isManuallyEdited: boolean
          postId: string
          text: string
          userId?: string
          userMessage?: string | null
        }
        Update: {
          createdAt?: string
          id?: number
          isManuallyEdited?: boolean
          postId?: string
          text?: string
          userId?: string
          userMessage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "postIterations_postId_fkey"
            columns: ["postId"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "postIterations_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          createdAt: string
          feedback: string | null
          feedbackSubmitted: boolean
          id: string
          isPosted: boolean
          isSaved: boolean
          rating: number | null
          userId: string
        }
        Insert: {
          createdAt?: string
          feedback?: string | null
          feedbackSubmitted?: boolean
          id?: string
          isPosted?: boolean
          isSaved?: boolean
          rating?: number | null
          userId?: string
        }
        Update: {
          createdAt?: string
          feedback?: string | null
          feedbackSubmitted?: boolean
          id?: string
          isPosted?: boolean
          isSaved?: boolean
          rating?: number | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          buyerPersona: string | null
          companyData: string | null
          companyName: string | null
          companyUrl: string | null
          created_at: string
          email: string
          feedbackGiven: boolean
          hasOnboarded: boolean | null
          id: string
          linkedinGoals: string[] | null
          linkedinTopics: string[] | null
          name: string | null
          postTone: string | null
          productInfo: string | null
          profession: string | null
          role: string | null
          stripeCustomerId: string | null
          subscriptionId: string | null
          targetAudience: string[] | null
        }
        Insert: {
          avatar?: string | null
          buyerPersona?: string | null
          companyData?: string | null
          companyName?: string | null
          companyUrl?: string | null
          created_at?: string
          email: string
          feedbackGiven?: boolean
          hasOnboarded?: boolean | null
          id: string
          linkedinGoals?: string[] | null
          linkedinTopics?: string[] | null
          name?: string | null
          postTone?: string | null
          productInfo?: string | null
          profession?: string | null
          role?: string | null
          stripeCustomerId?: string | null
          subscriptionId?: string | null
          targetAudience?: string[] | null
        }
        Update: {
          avatar?: string | null
          buyerPersona?: string | null
          companyData?: string | null
          companyName?: string | null
          companyUrl?: string | null
          created_at?: string
          email?: string
          feedbackGiven?: boolean
          hasOnboarded?: boolean | null
          id?: string
          linkedinGoals?: string[] | null
          linkedinTopics?: string[] | null
          name?: string | null
          postTone?: string | null
          productInfo?: string | null
          profession?: string | null
          role?: string | null
          stripeCustomerId?: string | null
          subscriptionId?: string | null
          targetAudience?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_credit: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      get_posts_with_latest_content: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          isPosted: boolean
          isSaved: boolean
          text: string
        }[]
      }
      subtract_credit: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      "Plan Type": "Pro" | "Free"
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
