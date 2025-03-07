
import { CartItem, Product } from "../types/cartTypes";
import { fetchVariant, hasEnoughProductStock, hasEnoughVariantStock, showStockErrorMessage } from "./variantUtils";
import { toast } from "sonner";

// Find an existing item in the cart
export const findExistingCartItem = (cartItems: CartItem[], product: Product, variantId?: string): number => {
  return cartItems.findIndex(item => {
    if (variantId) {
      return item.id === product.id && item.variant_id === variantId;
    }
    return item.id === product.id && !item.variant_id;
  });
};

// Prepare a cart item with or without variant
export const prepareCartItem = async (product: Product, variantId?: string): Promise<CartItem | null> => {
  // For a product without variants
  if (!variantId) {
    // Check stock for non-variant product
    if (!hasEnoughProductStock(product.stock, 1)) {
      showStockErrorMessage(product.name);
      return null;
    }
    
    return { ...product, quantity: 1 };
  }
  
  // For a product with a variant
  const variant = await fetchVariant(variantId);
  
  if (!variant) {
    toast.error("Could not find the selected variant");
    return null;
  }
  
  // Check variant stock
  if (!hasEnoughVariantStock(variant, 1)) {
    const variantDetails = [variant.color, variant.size, variant.flavor]
      .filter(Boolean)
      .join(' ');
    
    showStockErrorMessage(product.name, variantDetails);
    return null;
  }
  
  // Create the cart item with variant details
  return {
    ...product,
    quantity: 1,
    variant_id: variant.id,
    variant: variant,
    // Use the variant price instead of the base product price
    price: variant.price
  };
};

// Update the cart with a new item
export const updateCartWithNewItem = (cartItems: CartItem[], newItem: CartItem): CartItem[] => {
  const existingItemIndex = findExistingCartItem(cartItems, newItem, newItem.variant_id);
  
  if (existingItemIndex >= 0) {
    // Update quantity of existing item
    const updatedCart = [...cartItems];
    updatedCart[existingItemIndex].quantity += 1;
    return updatedCart;
  } else {
    // Add new item to cart
    return [...cartItems, newItem];
  }
};

// Calculate cart subtotal
export const calculateSubtotal = (cartItems: CartItem[]): number => {
  return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
};
