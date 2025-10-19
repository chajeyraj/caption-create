import { Database } from "@/integrations/supabase/types";

// Re-export the generated Database type
export type { Database };

// Table row types
export type Caption = Database["public"]["Tables"]["captions"]["Row"] & {
  profiles?: Profile;
};

export type Like = Database["public"]["Tables"]["likes"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
