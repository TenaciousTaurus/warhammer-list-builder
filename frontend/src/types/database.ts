export type Database = {
  public: {
    Tables: {
      factions: {
        Row: {
          id: string;
          name: string;
          icon_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          icon_url?: string | null;
        };
      };
      detachments: {
        Row: {
          id: string;
          faction_id: string;
          name: string;
          rule_text: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          faction_id: string;
          name: string;
          rule_text?: string | null;
        };
        Update: {
          id?: string;
          faction_id?: string;
          name?: string;
          rule_text?: string | null;
        };
      };
      units: {
        Row: {
          id: string;
          faction_id: string;
          name: string;
          role: string;
          movement: string;
          toughness: number;
          save: string;
          wounds: number;
          leadership: number;
          objective_control: number;
          keywords: string[];
          is_unique: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          faction_id: string;
          name: string;
          role: string;
          movement: string;
          toughness: number;
          save: string;
          wounds: number;
          leadership: number;
          objective_control: number;
          keywords?: string[];
          is_unique?: boolean;
        };
        Update: {
          id?: string;
          faction_id?: string;
          name?: string;
          role?: string;
          movement?: string;
          toughness?: number;
          save?: string;
          wounds?: number;
          leadership?: number;
          objective_control?: number;
          keywords?: string[];
          is_unique?: boolean;
        };
      };
      unit_points_tiers: {
        Row: {
          id: string;
          unit_id: string;
          model_count: number;
          points: number;
        };
        Insert: {
          id?: string;
          unit_id: string;
          model_count: number;
          points: number;
        };
        Update: {
          id?: string;
          unit_id?: string;
          model_count?: number;
          points?: number;
        };
      };
      weapons: {
        Row: {
          id: string;
          unit_id: string;
          name: string;
          type: 'ranged' | 'melee';
          range: string | null;
          attacks: string;
          skill: string;
          strength: number;
          ap: number;
          damage: string;
          keywords: string[];
        };
        Insert: {
          id?: string;
          unit_id: string;
          name: string;
          type: 'ranged' | 'melee';
          range?: string | null;
          attacks: string;
          skill: string;
          strength: number;
          ap: number;
          damage: string;
          keywords?: string[];
        };
        Update: {
          id?: string;
          unit_id?: string;
          name?: string;
          type?: 'ranged' | 'melee';
          range?: string | null;
          attacks?: string;
          skill?: string;
          strength?: number;
          ap?: number;
          damage?: string;
          keywords?: string[];
        };
      };
      abilities: {
        Row: {
          id: string;
          unit_id: string;
          name: string;
          type: string;
          description: string;
        };
        Insert: {
          id?: string;
          unit_id: string;
          name: string;
          type: string;
          description: string;
        };
        Update: {
          id?: string;
          unit_id?: string;
          name?: string;
          type?: string;
          description?: string;
        };
      };
      enhancements: {
        Row: {
          id: string;
          detachment_id: string;
          name: string;
          points: number;
          description: string;
        };
        Insert: {
          id?: string;
          detachment_id: string;
          name: string;
          points: number;
          description: string;
        };
        Update: {
          id?: string;
          detachment_id?: string;
          name?: string;
          points?: number;
          description?: string;
        };
      };
      army_lists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          faction_id: string;
          detachment_id: string;
          points_limit: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          faction_id: string;
          detachment_id: string;
          points_limit?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          faction_id?: string;
          detachment_id?: string;
          points_limit?: number;
        };
      };
      army_list_units: {
        Row: {
          id: string;
          army_list_id: string;
          unit_id: string;
          model_count: number;
          sort_order: number;
        };
        Insert: {
          id?: string;
          army_list_id: string;
          unit_id: string;
          model_count: number;
          sort_order?: number;
        };
        Update: {
          id?: string;
          army_list_id?: string;
          unit_id?: string;
          model_count?: number;
          sort_order?: number;
        };
      };
      army_list_enhancements: {
        Row: {
          id: string;
          army_list_id: string;
          enhancement_id: string;
          army_list_unit_id: string;
        };
        Insert: {
          id?: string;
          army_list_id: string;
          enhancement_id: string;
          army_list_unit_id: string;
        };
        Update: {
          id?: string;
          army_list_id?: string;
          enhancement_id?: string;
          army_list_unit_id?: string;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Convenience types
export type Faction = Database['public']['Tables']['factions']['Row'];
export type Detachment = Database['public']['Tables']['detachments']['Row'];
export type Unit = Database['public']['Tables']['units']['Row'];
export type UnitPointsTier = Database['public']['Tables']['unit_points_tiers']['Row'];
export type Weapon = Database['public']['Tables']['weapons']['Row'];
export type Ability = Database['public']['Tables']['abilities']['Row'];
export type Enhancement = Database['public']['Tables']['enhancements']['Row'];
export type ArmyList = Database['public']['Tables']['army_lists']['Row'];
export type ArmyListUnit = Database['public']['Tables']['army_list_units']['Row'];
export type ArmyListEnhancement = Database['public']['Tables']['army_list_enhancements']['Row'];
