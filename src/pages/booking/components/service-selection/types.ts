
import type { Database } from "@/integrations/supabase/types";

export type Service = Database["public"]["Tables"]["services"]["Row"] & {
  is_popular?: boolean;
  category?: string;
  estimated_duration?: number;
};

export interface ServiceSelectionProps {
  selectedService: Service | null;
  onSelectService: (service: Service) => void;
}
