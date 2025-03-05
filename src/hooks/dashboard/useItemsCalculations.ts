
/**
 * Utility functions to calculate items sold from transaction data
 */
export const calculateItemsSold = (transactions: any[]) => {
  return transactions.reduce((sum, tx) => {
    // Safely handle items array
    if (!tx.items) return sum;
    
    let items: any[] = [];
    
    // Handle string or array
    if (typeof tx.items === 'string') {
      try {
        items = JSON.parse(tx.items);
      } catch (e) {
        console.error('Failed to parse items:', e);
        return sum;
      }
    } else if (Array.isArray(tx.items)) {
      items = tx.items;
    } else {
      return sum;
    }
    
    // Sum up quantities from items
    return sum + items.reduce((count, item) => {
      const quantity = typeof item === 'object' && item !== null && 'quantity' in item 
        ? Number(item.quantity) || 1 
        : 1;
      return count + quantity;
    }, 0);
  }, 0);
};
