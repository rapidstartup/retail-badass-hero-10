
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

interface ProductItem {
  name: string;
  quantity: number;
  price: number;
}

export const useTopProducts = () => {
  return useQuery({
    queryKey: ["top-products"],
    queryFn: async () => {
      // Get the date for a week ago
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      // Query for recent transactions
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('items')
        .gte('created_at', weekAgo.toISOString())
        .eq('status', 'completed');
      
      if (error) throw error;
      
      // Process transaction items to count products
      const productCounts: Record<string, { name: string, sales: number, revenue: number }> = {};
      
      transactions.forEach(transaction => {
        if (!transaction.items) return;
        
        // Handle different formats of items
        let items: any[] = [];
        
        if (typeof transaction.items === 'string') {
          try {
            items = JSON.parse(transaction.items);
          } catch (e) {
            console.error('Failed to parse items:', e);
            return;
          }
        } else if (Array.isArray(transaction.items)) {
          items = transaction.items;
        } else {
          return;
        }
        
        items.forEach(item => {
          if (typeof item !== 'object' || item === null) return;
          
          const productName = 'name' in item ? String(item.name) : 'Unknown Product';
          const quantity = 'quantity' in item ? Number(item.quantity) || 1 : 1;
          const price = 'price' in item ? Number(item.price) || 0 : 0;
          
          if (!productCounts[productName]) {
            productCounts[productName] = {
              name: productName,
              sales: 0,
              revenue: 0
            };
          }
          
          productCounts[productName].sales += quantity;
          productCounts[productName].revenue += price * quantity;
        });
      });
      
      // Convert to array and sort by sales count
      const topProducts = Object.values(productCounts)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5); // Get top 5
      
      return topProducts;
    }
  });
};
