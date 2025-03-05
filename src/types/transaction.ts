
import { DateRange } from "react-day-picker";

export interface Transaction {
  id: string;
  status: 'open' | 'completed' | 'refunded';
  total: number;
  subtotal: number;
  tax: number;
  payment_method?: string;
  created_at: string;
  completed_at?: string;
  refund_amount?: number;
  refund_date?: string;
  customers?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  };
  items: TransactionItem[];
}

export interface TransactionItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  product_id?: string;
  variant_id?: string;
}

export interface TransactionFilters {
  dateRange: DateRange;
  paymentMethod?: string;
  status?: string;
  minimumAmount?: number;
  maximumAmount?: number;
  searchQuery: string;
}

export interface TransactionSummary {
  totalSales: number;
  transactionCount: number;
  averageOrder: number;
  growth: number;
}
