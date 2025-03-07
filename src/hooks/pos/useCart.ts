
import { useState } from "react";
import { formatTaxRulesFromSettings } from "@/utils/taxCalculator";
import { calculateTotalTax } from "@/utils/taxCalculator";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";

// Define product interface for type safety
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string | null;
  image_url: string | null;
  stock: number | null;
  description: string | null;
  has_variants?: boolean;
}

// Define variant interface
export interface ProductVariant {
  id: string;
  product_id: string;
  color?: string | null;
  size?: string | null;
  flavor?: string | null;
  price: number;
  stock_count?: number | null;
  sku?: string | null;
}

// Define cart item interface
export interface CartItem extends Product {
  quantity: number;
  variant_id?: string;
  variant?: ProductVariant | null; // The selected variant
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

  // Fetch variant details when needed
  const fetchVariant = async (variantId: string): Promise<ProductVariant | null> => {
    try {
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('id', variantId)
        .single();
        
      if (error) {
        console.error('Error fetching variant:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching variant:', error);
      return null;
    }
  };

  // Add product to cart, with or without a variant
  const addToCart = async (product: Product, variantId?: string) => {
    try {
      let itemToAdd: CartItem = { ...product, quantity: 1 };
      
      // If a variant ID is provided, fetch the variant details
      if (variantId) {
        const variant = await fetchVariant(variantId);
        
        if (!variant) {
          toast.error("Could not find the selected variant");
          return;
        }
        
        // Check if variant has stock
        if (variant.stock_count !== null && variant.stock_count <= 0) {
          toast.error("This variant is out of stock");
          return;
        }
        
        // Update the item with variant details
        itemToAdd = {
          ...product,
          quantity: 1,
          variant_id: variant.id,
          variant: variant,
          // Use the variant price instead of the base product price
          price: variant.price
        };
      } else {
        // For non-variant products, check stock
        if (product.stock !== null && product.stock <= 0) {
          toast.error("This product is out of stock");
          return;
        }
      }
      
      // Check if this exact item (with the same variant if applicable) already exists in the cart
      const existingItemIndex = cartItems.findIndex(item => {
        if (variantId) {
          return item.id === product.id && item.variant_id === variantId;
        }
        return item.id === product.id && !item.variant_id;
      });
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedCart = [...cartItems];
        updatedCart[existingItemIndex].quantity += 1;
        setCartItems(updatedCart);
      } else {
        // Add new item to cart
        setCartItems([...cartItems, itemToAdd]);
      }
      
      toast.success(`Added ${product.name} to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const updateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove the item if quantity is 0 or negative
      removeItem(index);
    } else {
      // Check stock before updating
      const item = cartItems[index];
      
      // For variant products
      if (item.variant_id && item.variant) {
        if (item.variant.stock_count !== null && newQuantity > item.variant.stock_count) {
          toast.error(`Only ${item.variant.stock_count} units available`);
          return;
        }
      } 
      // For regular products
      else if (item.stock !== null && newQuantity > item.stock) {
        toast.error(`Only ${item.stock} units available`);
        return;
      }
      
      // Update quantity
      const updatedCart = [...cartItems];
      updatedCart[index].quantity = newQuantity;
      setCartItems(updatedCart);
    }
  };

  const removeItem = (index: number) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
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

  // Process the transaction and update inventory
  const processTransaction = async (paymentDetails: any) => {
    try {
      // First, check stock availability for all items
      for (const item of cartItems) {
        if (item.variant_id && item.variant) {
          // Check variant stock
          const { data, error } = await supabase
            .from('product_variants')
            .select('stock_count')
            .eq('id', item.variant_id)
            .single();
            
          if (error) throw error;
          
          if (data.stock_count !== null && data.stock_count < item.quantity) {
            toast.error(`Not enough stock for ${item.name} (${item.variant.color || ''} ${item.variant.size || ''} ${item.variant.flavor || ''})`);
            return false;
          }
        } else {
          // Check regular product stock
          const { data, error } = await supabase
            .from('products')
            .select('stock')
            .eq('id', item.id)
            .single();
            
          if (error) throw error;
          
          if (data.stock !== null && data.stock < item.quantity) {
            toast.error(`Not enough stock for ${item.name}`);
            return false;
          }
        }
      }
      
      // Create transaction record
      const transactionData = {
        customer_id: selectedCustomer?.id || null,
        subtotal: getSubtotal(),
        tax: getTaxAmount(),
        total: getTotal(),
        items: cartItems,
        status: 'completed',
        payment_method: paymentDetails.method,
        cashier_id: null, // You would get this from auth context
        completed_at: new Date().toISOString()
      };
      
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert(transactionData)
        .select()
        .single();
        
      if (transactionError) throw transactionError;
      
      // Update inventory
      for (const item of cartItems) {
        if (item.variant_id) {
          // Update variant stock
          await supabase
            .from('product_variants')
            .update({ 
              stock_count: supabase.rpc('decrement', { x: item.quantity }),
              updated_at: new Date().toISOString()
            })
            .eq('id', item.variant_id);
        } else {
          // Update regular product stock
          await supabase
            .from('products')
            .update({ 
              stock: supabase.rpc('decrement', { x: item.quantity }),
              updated_at: new Date().toISOString()
            })
            .eq('id', item.id);
        }
      }
      
      toast.success('Transaction completed successfully');
      return true;
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast.error('Failed to process transaction');
      return false;
    }
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
              description: 'description' in validItem ? String(validItem.description) : null,
              variant_id: 'variant_id' in validItem ? String(validItem.variant_id) : undefined,
              variant: 'variant' in validItem ? validItem.variant as any : null
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
    handleCheckoutTab,
    processTransaction
  };
};
