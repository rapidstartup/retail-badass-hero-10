import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Grid3X3, Save, RefreshCw } from "lucide-react";
import { Product, ProductVariant } from "@/types";
import { 
  fetchVariantsByProductId, 
  createVariant, 
  updateVariant, 
  deleteVariant,
  updateProduct
} from "@/api/inventoryApi";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VariantTypeManager from "./VariantTypeManager";
import VariantCombinationsTable from "./VariantCombinationsTable";

interface EnhancedProductVariantsManagerProps {
  product: Product;
  onClose: () => void;
  onProductUpdated?: () => void;
}

interface VariantCombination {
  id?: string;
  attributes: Record<string, string>;
  sku: string;
  price: number;
  stock_count: number;
  product_id: string;
}

const EnhancedProductVariantsManager: React.FC<EnhancedProductVariantsManagerProps> = ({
  product,
  onClose,
  onProductUpdated
}) => {
  // States for variant management
  const [existingVariants, setExistingVariants] = useState<ProductVariant[]>([]);
  const [variantTypes, setVariantTypes] = useState<Map<string, string[]>>(new Map());
  const [combinations, setCombinations] = useState<VariantCombination[]>([]);
  const [skuPrefix, setSkuPrefix] = useState(product.sku || product.name.substring(0, 3).toUpperCase());
  const [basePrice, setBasePrice] = useState(product.price);
  const [baseStock, setBaseStock] = useState(0);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("define");
  const [error, setError] = useState<string | null>(null);

  // Fetch existing variants
  useEffect(() => {
    fetchVariants();
  }, [product.id]);

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const data = await fetchVariantsByProductId(product.id);
      setExistingVariants(data);
      
      // Extract variant types and values from existing variants
      const typesMap = new Map<string, string[]>();
      
      data.forEach(variant => {
        if (variant.variant_attributes) {
          Object.entries(variant.variant_attributes).forEach(([key, value]) => {
            if (typeof value === 'string') {
              const existingValues = typesMap.get(key) || [];
              if (!existingValues.includes(value)) {
                typesMap.set(key, [...existingValues, value]);
              }
            }
          });
        }
      });
      
      setVariantTypes(typesMap);
      
      // If there are existing variants, also create combinations
      if (data.length > 0) {
        const existingCombinations = data.map(variant => ({
          id: variant.id,
          attributes: variant.variant_attributes as Record<string, string> || {},
          sku: variant.sku || '',
          price: variant.price || product.price,
          stock_count: variant.stock_count || 0,
          product_id: product.id
        }));
        
        setCombinations(existingCombinations);
      }
      
    } catch (error) {
      console.error("Error fetching variants:", error);
      setError("Failed to load existing variants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate all possible combinations when variant types or values change
  useEffect(() => {
    generateCombinations();
  }, [variantTypes]);

  const generateCombinations = () => {
    // If no variant types, return empty array
    if (variantTypes.size === 0) {
      setCombinations([]);
      return;
    }

    // Convert Map to array for easier processing
    const typesArray = Array.from(variantTypes.entries()).filter(
      ([_, values]) => values.length > 0
    );
    
    if (typesArray.length === 0) {
      setCombinations([]);
      return;
    }

    // Helper function to generate combinations recursively
    const generateHelper = (
      index: number,
      currentCombination: Record<string, string>
    ): Record<string, string>[] => {
      // Base case: we've assigned a value for each type
      if (index === typesArray.length) {
        return [{ ...currentCombination }];
      }

      const [type, values] = typesArray[index];
      const result: Record<string, string>[] = [];

      // For each possible value of the current type
      for (const value of values) {
        // Add this value to the current combination
        const newCombination = {
          ...currentCombination,
          [type]: value,
        };

        // Recursively generate combinations for the remaining types
        const subCombinations = generateHelper(index + 1, newCombination);
        result.push(...subCombinations);
      }

      return result;
    };

    // Start the recursion with an empty combination
    const attributeCombinations = generateHelper(0, {});

    // Map attribute combinations to full variant combinations
    const newCombinations = attributeCombinations.map((attributes) => {
      // Generate a SKU based on the attributes
      const attributeParts = Object.values(attributes)
        .map(val => val.substring(0, 3).toUpperCase())
        .join('-');
      
      const sku = `${skuPrefix}-${attributeParts}`;

      // Check if this combination already exists in our current combinations
      const existingCombination = combinations.find(comb => {
        return Object.entries(attributes).every(([key, value]) => 
          comb.attributes[key] === value
        );
      });

      // Either use existing data or create new
      return existingCombination || {
        attributes,
        sku,
        price: basePrice,
        stock_count: baseStock,
        product_id: product.id
      };
    });

    setCombinations(newCombinations);
  };

  // Handlers for combination updates
  const handleUpdateCombination = (
    index: number,
    updates: Partial<VariantCombination>
  ) => {
    const updatedCombinations = [...combinations];
    updatedCombinations[index] = {
      ...updatedCombinations[index],
      ...updates,
    };
    setCombinations(updatedCombinations);
  };

  const handleDeleteCombination = (index: number) => {
    const updatedCombinations = [...combinations];
    updatedCombinations.splice(index, 1);
    setCombinations(updatedCombinations);
  };

  // Save all variants to database
  const saveVariants = async () => {
    if (combinations.length === 0) {
      setError("No variant combinations to save. Please add variants first.");
      return;
    }

    setSaving(true);
    setError(null);
    let success = true;

    try {
      // First ensure product has_variants is set to true
      if (!product.has_variants) {
        await updateProduct(product.id, { has_variants: true });
        
        // Update local product if callback provided
        if (onProductUpdated) {
          onProductUpdated();
        }
      }

      // Create map of existing variants by their attribute signature for easy lookup
      const existingVariantsMap = new Map<string, string>();
      existingVariants.forEach(variant => {
        const signature = JSON.stringify(variant.variant_attributes || {});
        existingVariantsMap.set(signature, variant.id);
      });

      // Track which existing variants have been processed
      const processedVariantIds = new Set<string>();

      // Process each combination
      for (const combination of combinations) {
        const attributesSignature = JSON.stringify(combination.attributes);
        const existingId = existingVariantsMap.get(attributesSignature);

        if (existingId) {
          // Update existing variant
          await updateVariant(existingId, {
            sku: combination.sku,
            price: combination.price,
            stock_count: combination.stock_count,
            variant_attributes: combination.attributes
          });
          processedVariantIds.add(existingId);
        } else {
          // Create new variant
          await createVariant({
            product_id: product.id,
            sku: combination.sku,
            price: combination.price,
            stock_count: combination.stock_count,
            variant_attributes: combination.attributes,
            color: combination.attributes.Color || combination.attributes.color || null,
            size: combination.attributes.Size || combination.attributes.size || null,
            flavor: combination.attributes.Flavor || combination.attributes.flavor || null
          });
        }
      }

      // Delete any variants that weren't in the combinations
      const variantsToDelete = existingVariants
        .filter(v => !processedVariantIds.has(v.id))
        .map(v => v.id);
      
      for (const variantId of variantsToDelete) {
        await deleteVariant(variantId);
      }

      toast.success("Variants saved successfully");
      fetchVariants(); // Refresh variants
    } catch (error) {
      console.error("Error saving variants:", error);
      toast.error("Failed to save variants");
      setError("Failed to save variants. Please try again.");
      success = false;
    } finally {
      setSaving(false);
      if (success) {
        // Switch to combinations tab to show the saved variants
        setActiveTab("combinations");
      }
    }
  };

  // Generate SKU prefix from product name
  const generateSkuPrefix = () => {
    const prefix = product.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3);
    
    setSkuPrefix(prefix);
  };

  // Apply base price to all combinations
  const applyBasePriceToAll = () => {
    const updatedCombinations = combinations.map(combination => ({
      ...combination,
      price: basePrice
    }));
    setCombinations(updatedCombinations);
  };

  // Apply base stock to all combinations
  const applyBaseStockToAll = () => {
    const updatedCombinations = combinations.map(combination => ({
      ...combination,
      stock_count: baseStock
    }));
    setCombinations(updatedCombinations);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Variants for {product.name}</DialogTitle>
          <DialogDescription>
            Create and manage product variations such as colors, sizes, and other attributes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="define">
                1. Define Variants
              </TabsTrigger>
              <TabsTrigger value="combinations">
                2. Manage Combinations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="define" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SKU Prefix</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="SKU Prefix"
                      value={skuPrefix}
                      onChange={(e) => setSkuPrefix(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={generateSkuPrefix}
                      type="button"
                    >
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This prefix will be used to generate SKUs for each variant (e.g., {skuPrefix}-RED-LG)
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Base Price</label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Base Price"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={applyBasePriceToAll}
                      type="button"
                      disabled={combinations.length === 0}
                    >
                      Apply to All
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set the default price for all variants
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Base Stock Level</label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Base Stock"
                      value={baseStock}
                      onChange={(e) => setBaseStock(Number(e.target.value))}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={applyBaseStockToAll}
                      type="button"
                      disabled={combinations.length === 0}
                    >
                      Apply to All
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set the default stock level for all variants
                  </p>
                </div>
              </div>

              <VariantTypeManager 
                variantTypes={variantTypes}
                setVariantTypes={setVariantTypes}
              />

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">
                  Generated Combinations ({combinations.length})
                </h3>
                {combinations.length > 0 ? (
                  <div className="text-sm">
                    You've created {combinations.length} variant combinations. 
                    Switch to the "Manage Combinations" tab to customize stock, prices, and SKUs.
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Add variant types and values above to generate combinations.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="combinations" className="space-y-4 pt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Variant Combinations ({combinations.length})
                </h3>
                <Button
                  onClick={() => setActiveTab("define")}
                  variant="outline"
                >
                  Back to Variant Definition
                </Button>
              </div>

              {combinations.length > 0 ? (
                <VariantCombinationsTable
                  combinations={combinations}
                  basePrice={basePrice}
                  skuPrefix={skuPrefix}
                  onUpdateCombination={handleUpdateCombination}
                  onDeleteCombination={handleDeleteCombination}
                  isLoading={loading}
                />
              ) : (
                <div className="text-center py-8 border rounded-md">
                  <Grid3X3 className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Combinations Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
                    Go to the "Define Variants" tab to add variant types and values.
                    Combinations will be automatically generated.
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setActiveTab("define")}
                  >
                    Define Variants
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={saveVariants}
            disabled={combinations.length === 0 || saving}
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving Variants
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save {combinations.length} Variants
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedProductVariantsManager;
