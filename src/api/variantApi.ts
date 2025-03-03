
import { ProductVariant, VariantInsert, VariantUpdate } from "./types/variantTypes";

// Re-export types
export type { ProductVariant, VariantInsert, VariantUpdate };

// Re-export operations
export {
  fetchVariantsByProductId,
  createVariant
} from "./operations/variantOperations";

export {
  updateVariant,
  adjustVariantStock
} from "./operations/variantUpdates";

export {
  deleteVariant
} from "./operations/variantDeletion";
