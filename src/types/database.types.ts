
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  photo_url: string | null;
  stripe_customer_id: string | null;
  gohighlevel_id: string | null;
  loyalty_points: number | null;
  tier: string | null;
  total_spend: number | null;
  created_at: string | null;
  updated_at: string | null;
  // We don't want to add the address field to the database type
  // since it doesn't exist in the database schema
}

export interface GiftCard {
  id: string;
  code: string;
  initial_value: number;
  current_value: number;
  is_active: boolean;
  expires_at: string | null;
  customer_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  redeemed_at: string | null;
  created_by_staff_id: string | null;
}
