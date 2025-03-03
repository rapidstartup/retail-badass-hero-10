
import { useState } from "react";
import { formatTaxRulesFromSettings } from "@/utils/taxCalculator";
import { calculateTotalTax } from "@/utils/taxCalculator";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

// Define product interface for type safety
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string | null;
  image_url: string | null;
  stock: number | null;
  description: string | null;
}

// Define cart item interface
export interface CartItem extends Product {
  quantity: number;
}

// Helper function to check if a JSON object has the required properties to be a CartItem
export const isValidCartItem = (item: Json): boolean => {
  return (
    typeof item === 'object' && 
    item !== null && 
    'id' in item && 
    typeof item.id === 'string' &&
    'name' in item && 
    typeof item.name === 'string' &&
    'price' in item && 
    typeof item.price === 'number' &&
    'quantity' in item &&
    typeof item.quantity === 'number'
  );
};

export const useCart = (taxRate: number) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  const addToCart = (product: Product) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } else {
      setCartItems(
        cartItems.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Use the dynamic tax calculator
  const getTaxAmount = () => {
    // For now we'll just use the default tax rate since we haven't stored
    // the tax rules in the database yet
    const taxRules = formatTaxRulesFromSettings([], taxRate);
    return calculateTotalTax(
      cartItems.map(item => ({
        price: item.price,
        quantity: item.quantity,
        category: item.category
      })),
      taxRules,
      taxRate
    );
  };

  const getTotal = () => {
    return getSubtotal() + getTaxAmount();
  };

  const handleCheckoutTab = async (tabId: string) => {
    try {
      // Fetch the tab items from Supabase
      const { data, error } = await supabase
        .from("transactions")
        .select("items, customer_id")
        .eq("id", tabId)
        .single();
        
      if (error) {
        console.error("Error fetching tab:", error);
        return;
      }
      
      // Fetch customer details if there's a customer_id
      if (data.customer_id) {
        const { data: customerData, error: customerError } = await supabase
          .from("customers")
          .select("*")
          .eq("id", data.customer_id)
          .single();
          
        if (!customerError && customerData) {
          setSelectedCustomer(customerData);
        }
      }
      
      // Load tab items into cart with proper type checking
      if (data.items && Array.isArray(data.items)) {
        // Filter valid cart items
        const validCartItems = data.items
          .filter(isValidCartItem)
          .map(item => {
            // We've already validated this is an object with the right properties
            const validItem = item as Record<string, Json>;
            
            // Safe type conversion with all required properties
            return {
              id: String(validItem.id),
              name: String(validItem.name),
              price: Number(validItem.price),
              quantity: Number(validItem.quantity),
              category: 'category' in validItem ? String(validItem.category) : null,
              image_url: 'image_url' in validItem ? String(validItem.image_url) : null,
              stock: 'stock' in validItem ? Number(validItem.stock) : null,
              description: 'description' in validItem ? String(validItem.description) : null
            } as CartItem;
          });
          
        setCartItems(validCartItems);
      }
    } catch (error) {
      console.error("Unexpected error loading tab:", error);
    }
  };

  return {
    cartItems,
    selectedCustomer,
    setSelectedCustomer,
    addToCart,
    updateItemQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getTaxAmount,
    getTotal,
    handleCheckoutTab
  };
};
