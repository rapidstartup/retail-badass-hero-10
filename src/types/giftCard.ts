
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

export interface CreateGiftCardParams {
  initial_value: number;
  customer_id?: string | null;
  expires_at?: string | null;
}

export interface RedeemGiftCardParams {
  code: string;
  amount: number;
}
