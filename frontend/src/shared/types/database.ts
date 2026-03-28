export type Database = {
  public: {
    Tables: {
      factions: {
        Row: {
          id: string;
          name: string;
          icon_url: string | null;
          alignment: 'imperium' | 'chaos' | 'xenos' | 'unaligned' | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon_url?: string | null;
          alignment?: 'imperium' | 'chaos' | 'xenos' | 'unaligned' | null;
        };
        Update: {
          id?: string;
          name?: string;
          icon_url?: string | null;
        };
        Relationships: [];
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
        Relationships: [];
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
          max_per_list: number;
          is_legends: boolean;
          transport_capacity: number | null;
          transport_keywords_allowed: string[] | null;
          transport_keywords_excluded: string[] | null;
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
          max_per_list?: number;
          is_legends?: boolean;
          transport_capacity?: number | null;
          transport_keywords_allowed?: string[] | null;
          transport_keywords_excluded?: string[] | null;
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
          max_per_list?: number;
          is_legends?: boolean;
          transport_capacity?: number | null;
          transport_keywords_allowed?: string[] | null;
          transport_keywords_excluded?: string[] | null;
        };
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
      };
      battle_sizes: {
        Row: {
          id: string;
          name: string;
          min_points: number;
          max_points: number;
          sort_order: number;
        };
        Insert: {
          id: string;
          name: string;
          min_points: number;
          max_points: number;
          sort_order?: number;
        };
        Update: {
          id?: string;
          name?: string;
          min_points?: number;
          max_points?: number;
          sort_order?: number;
        };
        Relationships: [];
      };
      army_lists: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          faction_id: string;
          detachment_id: string;
          points_limit: number;
          battle_size: string;
          share_code: string | null;
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
          battle_size?: string;
          share_code?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          faction_id?: string;
          detachment_id?: string;
          points_limit?: number;
          battle_size?: string;
          share_code?: string | null;
        };
        Relationships: [];
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
        Relationships: [];
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
        Relationships: [];
      };
      wargear_options: {
        Row: {
          id: string;
          unit_id: string;
          group_name: string;
          name: string;
          is_default: boolean;
          points: number;
          model_variant_id: string | null;
          pool_group: string | null;
          pool_max: number | null;
        };
        Insert: {
          id?: string;
          unit_id: string;
          group_name: string;
          name: string;
          is_default?: boolean;
          points?: number;
          model_variant_id?: string | null;
          pool_group?: string | null;
          pool_max?: number | null;
        };
        Update: {
          id?: string;
          unit_id?: string;
          group_name?: string;
          name?: string;
          is_default?: boolean;
          points?: number;
          model_variant_id?: string | null;
          pool_group?: string | null;
          pool_max?: number | null;
        };
        Relationships: [];
      };
      army_list_unit_wargear: {
        Row: {
          id: string;
          army_list_unit_id: string;
          wargear_option_id: string;
          model_variant_id: string | null;
          quantity: number;
        };
        Insert: {
          id?: string;
          army_list_unit_id: string;
          wargear_option_id: string;
          model_variant_id?: string | null;
          quantity?: number;
        };
        Update: {
          id?: string;
          army_list_unit_id?: string;
          wargear_option_id?: string;
          model_variant_id?: string | null;
          quantity?: number;
        };
        Relationships: [];
      };
      unit_model_variants: {
        Row: {
          id: string;
          unit_id: string;
          name: string;
          min_count: number;
          max_count: number;
          default_count: number;
          is_leader: boolean;
          sort_order: number;
          group_name: string | null;
        };
        Insert: {
          id?: string;
          unit_id: string;
          name: string;
          min_count: number;
          max_count: number;
          default_count: number;
          is_leader?: boolean;
          sort_order?: number;
          group_name?: string | null;
        };
        Update: {
          id?: string;
          unit_id?: string;
          name?: string;
          min_count?: number;
          max_count?: number;
          default_count?: number;
          is_leader?: boolean;
          sort_order?: number;
          group_name?: string | null;
        };
        Relationships: [];
      };
      army_list_unit_composition: {
        Row: {
          id: string;
          army_list_unit_id: string;
          model_variant_id: string;
          count: number;
        };
        Insert: {
          id?: string;
          army_list_unit_id: string;
          model_variant_id: string;
          count: number;
        };
        Update: {
          id?: string;
          army_list_unit_id?: string;
          model_variant_id?: string;
          count?: number;
        };
        Relationships: [];
      };
      unit_leader_targets: {
        Row: {
          id: string;
          leader_unit_id: string;
          target_unit_id: string;
        };
        Insert: {
          id?: string;
          leader_unit_id: string;
          target_unit_id: string;
        };
        Update: {
          id?: string;
          leader_unit_id?: string;
          target_unit_id?: string;
        };
        Relationships: [];
      };
      army_list_leader_attachments: {
        Row: {
          id: string;
          army_list_id: string;
          leader_army_list_unit_id: string;
          target_army_list_unit_id: string;
        };
        Insert: {
          id?: string;
          army_list_id: string;
          leader_army_list_unit_id: string;
          target_army_list_unit_id: string;
        };
        Update: {
          id?: string;
          army_list_id?: string;
          leader_army_list_unit_id?: string;
          target_army_list_unit_id?: string;
        };
        Relationships: [];
      };
      missions: {
        Row: {
          id: string;
          name: string;
          type: string;
          source: string | null;
          description: string | null;
          primary_objective: string | null;
          deployment_map_url: string | null;
          max_primary_per_round: number;
          max_total: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          source?: string | null;
          description?: string | null;
          primary_objective?: string | null;
          deployment_map_url?: string | null;
          max_primary_per_round?: number;
          max_total?: number;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          source?: string | null;
          description?: string | null;
          primary_objective?: string | null;
          deployment_map_url?: string | null;
          max_primary_per_round?: number;
          max_total?: number;
        };
        Relationships: [];
      };
      secondary_objectives: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string;
          max_vp: number;
          is_fixed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string;
          description?: string;
          max_vp?: number;
          is_fixed?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          description?: string;
          max_vp?: number;
          is_fixed?: boolean;
        };
        Relationships: [];
      };
      stratagems: {
        Row: {
          id: string;
          name: string;
          type: string;
          faction_id: string | null;
          detachment_id: string | null;
          phase: string;
          cp_cost: number;
          when_text: string;
          effect_text: string;
          restrictions: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type?: string;
          faction_id?: string | null;
          detachment_id?: string | null;
          phase: string;
          cp_cost?: number;
          when_text: string;
          effect_text: string;
          restrictions?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          faction_id?: string | null;
          detachment_id?: string | null;
          phase?: string;
          cp_cost?: number;
          when_text?: string;
          effect_text?: string;
          restrictions?: string | null;
        };
        Relationships: [];
      };
      game_sessions: {
        Row: {
          id: string;
          user_id: string;
          army_list_id: string;
          mission_id: string | null;
          opponent_name: string | null;
          opponent_faction: string | null;
          status: string;
          current_round: number;
          current_phase: number;
          player_turn: string;
          cp: number;
          my_vp: number;
          opponent_vp: number;
          result: string | null;
          timer_player_seconds: number;
          timer_opponent_seconds: number;
          invite_code: string | null;
          notes: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          army_list_id: string;
          mission_id?: string | null;
          opponent_name?: string | null;
          opponent_faction?: string | null;
          status?: string;
          current_round?: number;
          current_phase?: number;
          player_turn?: string;
          cp?: number;
          my_vp?: number;
          opponent_vp?: number;
          result?: string | null;
          timer_player_seconds?: number;
          timer_opponent_seconds?: number;
          invite_code?: string | null;
          notes?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          army_list_id?: string;
          mission_id?: string | null;
          opponent_name?: string | null;
          opponent_faction?: string | null;
          status?: string;
          current_round?: number;
          current_phase?: number;
          player_turn?: string;
          cp?: number;
          my_vp?: number;
          opponent_vp?: number;
          result?: string | null;
          timer_player_seconds?: number;
          timer_opponent_seconds?: number;
          invite_code?: string | null;
          notes?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      game_session_events: {
        Row: {
          id: string;
          game_session_id: string;
          round: number;
          phase: number;
          event_type: string;
          description: string;
          data: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_session_id: string;
          round: number;
          phase: number;
          event_type: string;
          description: string;
          data?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          game_session_id?: string;
          round?: number;
          phase?: number;
          event_type?: string;
          description?: string;
          data?: Record<string, unknown> | null;
        };
        Relationships: [];
      };
      game_session_scores: {
        Row: {
          id: string;
          game_session_id: string;
          round: number;
          objective_name: string;
          vp_scored: number;
        };
        Insert: {
          id?: string;
          game_session_id: string;
          round: number;
          objective_name: string;
          vp_scored?: number;
        };
        Update: {
          id?: string;
          game_session_id?: string;
          round?: number;
          objective_name?: string;
          vp_scored?: number;
        };
        Relationships: [];
      };
      game_session_unit_states: {
        Row: {
          id: string;
          game_session_id: string;
          army_list_unit_id: string;
          model_states: number[];
        };
        Insert: {
          id?: string;
          game_session_id: string;
          army_list_unit_id: string;
          model_states?: number[];
        };
        Update: {
          id?: string;
          game_session_id?: string;
          army_list_unit_id?: string;
          model_states?: number[];
        };
        Relationships: [];
      };
      paint_library: {
        Row: {
          id: string;
          brand: string;
          range_name: string;
          paint_name: string;
          paint_type: string;
          hex_color: string | null;
          is_metallic: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          brand: string;
          range_name?: string;
          paint_name: string;
          paint_type: string;
          hex_color?: string | null;
          is_metallic?: boolean;
        };
        Update: {
          id?: string;
          brand?: string;
          range_name?: string;
          paint_name?: string;
          paint_type?: string;
          hex_color?: string | null;
          is_metallic?: boolean;
        };
        Relationships: [];
      };
      collection_entries: {
        Row: {
          id: string;
          user_id: string;
          unit_id: string | null;
          faction_id: string | null;
          custom_name: string | null;
          quantity: number;
          painting_status: string;
          purchase_price: number | null;
          purchase_date: string | null;
          finished_date: string | null;
          notes: string | null;
          photos: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          unit_id?: string | null;
          faction_id?: string | null;
          custom_name?: string | null;
          quantity?: number;
          painting_status?: string;
          purchase_price?: number | null;
          purchase_date?: string | null;
          finished_date?: string | null;
          notes?: string | null;
          photos?: string[];
        };
        Update: {
          id?: string;
          user_id?: string;
          unit_id?: string | null;
          faction_id?: string | null;
          custom_name?: string | null;
          quantity?: number;
          painting_status?: string;
          purchase_price?: number | null;
          purchase_date?: string | null;
          finished_date?: string | null;
          notes?: string | null;
          photos?: string[];
        };
        Relationships: [];
      };
      wishlist_items: {
        Row: {
          id: string;
          user_id: string;
          unit_id: string | null;
          faction_id: string | null;
          name: string;
          estimated_price: number | null;
          priority: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          unit_id?: string | null;
          faction_id?: string | null;
          name: string;
          estimated_price?: number | null;
          priority?: number;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          unit_id?: string | null;
          faction_id?: string | null;
          name?: string;
          estimated_price?: number | null;
          priority?: number;
          notes?: string | null;
        };
        Relationships: [];
      };
      paint_recipes: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          unit_id: string | null;
          faction_id: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          unit_id?: string | null;
          faction_id?: string | null;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          unit_id?: string | null;
          faction_id?: string | null;
          is_public?: boolean;
        };
        Relationships: [];
      };
      paint_recipe_steps: {
        Row: {
          id: string;
          recipe_id: string;
          step_order: number;
          paint_id: string | null;
          technique: string;
          area_description: string | null;
          notes: string | null;
          photo_url: string | null;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          step_order: number;
          paint_id?: string | null;
          technique?: string;
          area_description?: string | null;
          notes?: string | null;
          photo_url?: string | null;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          step_order?: number;
          paint_id?: string | null;
          technique?: string;
          area_description?: string | null;
          notes?: string | null;
          photo_url?: string | null;
        };
        Relationships: [];
      };
      user_paint_inventory: {
        Row: {
          id: string;
          user_id: string;
          paint_id: string;
          in_stock: boolean;
          quantity: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          paint_id: string;
          in_stock?: boolean;
          quantity?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          paint_id?: string;
          in_stock?: boolean;
          quantity?: number;
        };
        Relationships: [];
      };
      // Phase 4: Crusade & Campaign
      campaigns: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          description: string | null;
          share_code: string;
          max_players: number;
          points_limit: number;
          status: 'recruiting' | 'active' | 'completed' | 'archived';
          settings: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          description?: string | null;
          share_code?: string;
          max_players?: number;
          points_limit?: number;
          status?: 'recruiting' | 'active' | 'completed' | 'archived';
          settings?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          description?: string | null;
          max_players?: number;
          points_limit?: number;
          status?: 'recruiting' | 'active' | 'completed' | 'archived';
          settings?: Record<string, unknown>;
        };
        Relationships: [];
      };
      campaign_members: {
        Row: {
          id: string;
          campaign_id: string;
          user_id: string;
          role: 'owner' | 'player';
          display_name: string;
          requisition_points: number;
          supply_limit: number;
          joined_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          user_id: string;
          role?: 'owner' | 'player';
          display_name: string;
          requisition_points?: number;
          supply_limit?: number;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          user_id?: string;
          role?: 'owner' | 'player';
          display_name?: string;
          requisition_points?: number;
          supply_limit?: number;
        };
        Relationships: [];
      };
      crusade_rosters: {
        Row: {
          id: string;
          campaign_member_id: string;
          faction_id: string;
          name: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_member_id: string;
          faction_id: string;
          name: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          campaign_member_id?: string;
          faction_id?: string;
          name?: string;
          notes?: string | null;
        };
        Relationships: [];
      };
      crusade_units: {
        Row: {
          id: string;
          crusade_roster_id: string;
          unit_id: string;
          custom_name: string | null;
          model_count: number;
          points_cost: number;
          xp: number;
          rank: 'battle_ready' | 'blooded' | 'battle_hardened' | 'heroic' | 'legendary';
          battles_played: number;
          battles_survived: number;
          kills: number;
          honours: BattleHonour[];
          scars: BattleScar[];
          is_destroyed: boolean;
          destroyed_in_battle_id: string | null;
          notes: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          crusade_roster_id: string;
          unit_id: string;
          custom_name?: string | null;
          model_count?: number;
          points_cost?: number;
          xp?: number;
          rank?: 'battle_ready' | 'blooded' | 'battle_hardened' | 'heroic' | 'legendary';
          battles_played?: number;
          battles_survived?: number;
          kills?: number;
          honours?: BattleHonour[];
          scars?: BattleScar[];
          is_destroyed?: boolean;
          destroyed_in_battle_id?: string | null;
          notes?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          crusade_roster_id?: string;
          unit_id?: string;
          custom_name?: string | null;
          model_count?: number;
          points_cost?: number;
          xp?: number;
          rank?: 'battle_ready' | 'blooded' | 'battle_hardened' | 'heroic' | 'legendary';
          battles_played?: number;
          battles_survived?: number;
          kills?: number;
          honours?: BattleHonour[];
          scars?: BattleScar[];
          is_destroyed?: boolean;
          destroyed_in_battle_id?: string | null;
          notes?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      crusade_battles: {
        Row: {
          id: string;
          campaign_id: string;
          mission_id: string | null;
          game_session_id: string | null;
          player1_member_id: string;
          player2_member_id: string;
          player1_vp: number;
          player2_vp: number;
          winner_member_id: string | null;
          is_draw: boolean;
          round_number: number | null;
          notes: string | null;
          played_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          mission_id?: string | null;
          game_session_id?: string | null;
          player1_member_id: string;
          player2_member_id: string;
          player1_vp?: number;
          player2_vp?: number;
          winner_member_id?: string | null;
          is_draw?: boolean;
          round_number?: number | null;
          notes?: string | null;
          played_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          mission_id?: string | null;
          game_session_id?: string | null;
          player1_member_id?: string;
          player2_member_id?: string;
          player1_vp?: number;
          player2_vp?: number;
          winner_member_id?: string | null;
          is_draw?: boolean;
          round_number?: number | null;
          notes?: string | null;
          played_at?: string;
        };
        Relationships: [];
      };
      crusade_battle_participants: {
        Row: {
          id: string;
          crusade_battle_id: string;
          crusade_unit_id: string;
          xp_earned: number;
          kills_this_battle: number;
          survived: boolean;
        };
        Insert: {
          id?: string;
          crusade_battle_id: string;
          crusade_unit_id: string;
          xp_earned?: number;
          kills_this_battle?: number;
          survived?: boolean;
        };
        Update: {
          id?: string;
          crusade_battle_id?: string;
          crusade_unit_id?: string;
          xp_earned?: number;
          kills_this_battle?: number;
          survived?: boolean;
        };
        Relationships: [];
      };
      requisition_log: {
        Row: {
          id: string;
          campaign_member_id: string;
          type: 'increase_supply' | 'add_unit' | 'remove_scar' | 'refit' | 'fresh_recruits' | 'battle_earned' | 'other';
          rp_change: number;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_member_id: string;
          type: 'increase_supply' | 'add_unit' | 'remove_scar' | 'refit' | 'fresh_recruits' | 'battle_earned' | 'other';
          rp_change: number;
          description: string;
        };
        Update: {
          id?: string;
          campaign_member_id?: string;
          type?: 'increase_supply' | 'add_unit' | 'remove_scar' | 'refit' | 'fresh_recruits' | 'battle_earned' | 'other';
          rp_change?: number;
          description?: string;
        };
        Relationships: [];
      };
      // Phase 5: Social, Stats & Tournaments
      user_profiles: {
        Row: {
          id: string;
          display_name: string;
          avatar_url: string | null;
          preferred_factions: string[];
          bio: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          avatar_url?: string | null;
          preferred_factions?: string[];
          bio?: string | null;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          display_name?: string;
          avatar_url?: string | null;
          preferred_factions?: string[];
          bio?: string | null;
          is_public?: boolean;
        };
        Relationships: [];
      };
      friendships: {
        Row: {
          id: string;
          requester_id: string;
          addressee_id: string;
          status: 'pending' | 'accepted' | 'declined' | 'blocked';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          requester_id: string;
          addressee_id: string;
          status?: 'pending' | 'accepted' | 'declined' | 'blocked';
        };
        Update: {
          id?: string;
          requester_id?: string;
          addressee_id?: string;
          status?: 'pending' | 'accepted' | 'declined' | 'blocked';
        };
        Relationships: [];
      };
      tournaments: {
        Row: {
          id: string;
          organizer_id: string;
          name: string;
          description: string | null;
          format: 'swiss' | 'single_elimination' | 'round_robin';
          max_players: number;
          points_limit: number;
          num_rounds: number;
          status: 'registration' | 'active' | 'completed' | 'cancelled';
          share_code: string;
          settings: Record<string, unknown>;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organizer_id: string;
          name: string;
          description?: string | null;
          format?: 'swiss' | 'single_elimination' | 'round_robin';
          max_players?: number;
          points_limit?: number;
          num_rounds?: number;
          status?: 'registration' | 'active' | 'completed' | 'cancelled';
          share_code?: string;
          settings?: Record<string, unknown>;
          started_at?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          organizer_id?: string;
          name?: string;
          description?: string | null;
          format?: 'swiss' | 'single_elimination' | 'round_robin';
          max_players?: number;
          points_limit?: number;
          num_rounds?: number;
          status?: 'registration' | 'active' | 'completed' | 'cancelled';
          settings?: Record<string, unknown>;
          started_at?: string | null;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      tournament_participants: {
        Row: {
          id: string;
          tournament_id: string;
          user_id: string;
          army_list_id: string | null;
          display_name: string;
          seed: number | null;
          dropped: boolean;
          registered_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          user_id: string;
          army_list_id?: string | null;
          display_name: string;
          seed?: number | null;
          dropped?: boolean;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          user_id?: string;
          army_list_id?: string | null;
          display_name?: string;
          seed?: number | null;
          dropped?: boolean;
        };
        Relationships: [];
      };
      tournament_rounds: {
        Row: {
          id: string;
          tournament_id: string;
          round_number: number;
          status: 'pending' | 'active' | 'completed';
          created_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          round_number: number;
          status?: 'pending' | 'active' | 'completed';
        };
        Update: {
          id?: string;
          tournament_id?: string;
          round_number?: number;
          status?: 'pending' | 'active' | 'completed';
        };
        Relationships: [];
      };
      tournament_pairings: {
        Row: {
          id: string;
          round_id: string;
          player1_id: string;
          player2_id: string | null;
          game_session_id: string | null;
          player1_vp: number | null;
          player2_vp: number | null;
          winner_id: string | null;
          is_draw: boolean;
          is_bye: boolean;
          table_number: number | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          round_id: string;
          player1_id: string;
          player2_id?: string | null;
          game_session_id?: string | null;
          player1_vp?: number | null;
          player2_vp?: number | null;
          winner_id?: string | null;
          is_draw?: boolean;
          is_bye?: boolean;
          table_number?: number | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          round_id?: string;
          player1_id?: string;
          player2_id?: string | null;
          game_session_id?: string | null;
          player1_vp?: number | null;
          player2_vp?: number | null;
          winner_id?: string | null;
          is_draw?: boolean;
          is_bye?: boolean;
          table_number?: number | null;
          completed_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      calculate_list_points: {
        Args: { list_id: string };
        Returns: {
          total_points: number;
          unit_points: number;
          enhancement_points: number;
          points_limit: number;
          is_valid: boolean;
        };
      };
      validate_army_list: {
        Args: { list_id: string };
        Returns: {
          total_points: number;
          unit_points: number;
          enhancement_points: number;
          points_limit: number;
          is_valid: boolean;
          unit_limit_violations: {
            unit_id: string;
            unit_name: string;
            count: number;
            max_allowed: number;
          }[];
          has_unit_limit_violations: boolean;
          enhancement_violations: string[];
          has_enhancement_violations: boolean;
        };
      };
      duplicate_army_list: {
        Args: { source_list_id: string };
        Returns: string;
      };
      get_player_stats: {
        Args: { target_user_id: string };
        Returns: PlayerStats;
      };
      get_head_to_head: {
        Args: { user1_id: string; user2_id: string };
        Returns: HeadToHeadStats;
      };
      get_tournament_standings: {
        Args: { p_tournament_id: string };
        Returns: TournamentStanding[];
      };
      generate_swiss_pairings: {
        Args: { p_tournament_id: string; p_round_number: number };
        Returns: string;
      };
      award_crusade_xp: {
        Args: { p_battle_id: string };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// JSONB sub-types for Crusade
export interface BattleHonour {
  name: string;
  description: string;
  type: 'battle_honour';
  acquired_battle_id?: string;
}

export interface BattleScar {
  name: string;
  description: string;
  type: 'battle_scar';
  acquired_battle_id?: string;
}

// Convenience types
export type BattleSize = Database['public']['Tables']['battle_sizes']['Row'];
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
export type WargearOption = Database['public']['Tables']['wargear_options']['Row'];
export type ArmyListUnitWargear = Database['public']['Tables']['army_list_unit_wargear']['Row'];
export type ModelVariant = Database['public']['Tables']['unit_model_variants']['Row'];
export type ArmyListUnitComposition = Database['public']['Tables']['army_list_unit_composition']['Row'];
export type LeaderTarget = Database['public']['Tables']['unit_leader_targets']['Row'];
export type LeaderAttachment = Database['public']['Tables']['army_list_leader_attachments']['Row'];
export type Mission = Database['public']['Tables']['missions']['Row'];
export type SecondaryObjective = Database['public']['Tables']['secondary_objectives']['Row'];
export type Stratagem = Database['public']['Tables']['stratagems']['Row'];
export type GameSession = Database['public']['Tables']['game_sessions']['Row'];
export type GameSessionEvent = Database['public']['Tables']['game_session_events']['Row'];
export type GameSessionScore = Database['public']['Tables']['game_session_scores']['Row'];
export type GameSessionUnitState = Database['public']['Tables']['game_session_unit_states']['Row'];
export type Paint = Database['public']['Tables']['paint_library']['Row'];
export type CollectionEntry = Database['public']['Tables']['collection_entries']['Row'];
export type WishlistItem = Database['public']['Tables']['wishlist_items']['Row'];
export type PaintRecipe = Database['public']['Tables']['paint_recipes']['Row'];
export type PaintRecipeStep = Database['public']['Tables']['paint_recipe_steps']['Row'];
export type UserPaintInventory = Database['public']['Tables']['user_paint_inventory']['Row'];

// Phase 4: Crusade & Campaign
export type Campaign = Database['public']['Tables']['campaigns']['Row'];
export type CampaignMember = Database['public']['Tables']['campaign_members']['Row'];
export type CrusadeRoster = Database['public']['Tables']['crusade_rosters']['Row'];
export type CrusadeUnit = Database['public']['Tables']['crusade_units']['Row'];
export type CrusadeBattle = Database['public']['Tables']['crusade_battles']['Row'];
export type CrusadeBattleParticipant = Database['public']['Tables']['crusade_battle_participants']['Row'];
export type RequisitionLogEntry = Database['public']['Tables']['requisition_log']['Row'];

// Phase 5: Social, Stats & Tournaments
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type Friendship = Database['public']['Tables']['friendships']['Row'];
export type Tournament = Database['public']['Tables']['tournaments']['Row'];
export type TournamentParticipant = Database['public']['Tables']['tournament_participants']['Row'];
export type TournamentRound = Database['public']['Tables']['tournament_rounds']['Row'];
export type TournamentPairing = Database['public']['Tables']['tournament_pairings']['Row'];

// RPC response types
export type CalculateListPointsResult = Database['public']['Functions']['calculate_list_points']['Returns'];
export type ValidateArmyListResult = Database['public']['Functions']['validate_army_list']['Returns'];

export interface PlayerStats {
  total_games: number;
  wins: number;
  losses: number;
  draws: number;
  win_rate: number;
  avg_vp: number;
  avg_opponent_vp: number;
  games_by_faction: {
    faction_name: string;
    faction_id: string;
    games: number;
    wins: number;
  }[];
}

export interface HeadToHeadStats {
  total_games: number;
  user1_wins: number;
  user2_wins: number;
  draws: number;
  recent_battles: {
    played_at: string;
    player1_vp: number;
    player2_vp: number;
    winner: 'user1' | 'user2' | 'draw';
  }[];
}

export interface TournamentStanding {
  participant_id: string;
  display_name: string;
  wins: number;
  losses: number;
  draws: number;
  byes: number;
  vp_for: number;
  vp_against: number;
  vp_diff: number;
  points: number;
  dropped: boolean;
}
