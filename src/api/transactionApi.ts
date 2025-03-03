
// Add this at the end of the file to export the Transaction type
export interface Transaction {
  id: string;
  customer_id: string | null;
  cashier_id: string | null;
  items: any[]; // This should match the actual structure of the items
  subtotal: number;
  tax: number;
  total: number;
  payment_method: string | null;
  status: string;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}
