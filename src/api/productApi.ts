
import { Product, ProductInsert, ProductUpdate } from "./types/productTypes";

// Re-export types
export type { Product, ProductInsert, ProductUpdate };

// Re-export operations
export { 
  fetchProducts,
  fetchProductById
} from "./operations/productOperations";

export {
  createProduct
} from "./operations/productCreation";

export {
  updateProduct,
  adjustProductStock
} from "./operations/productUpdates";

export {
  deleteProduct
} from "./operations/productDeletion";
