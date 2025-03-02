/**
 * Tax Calculator Utility
 * Handles dynamic tax calculations based on settings and product categories
 */

interface TaxRule {
  id: string;
  name: string;
  rate: number;
  productCategories?: string[];
  isDefault?: boolean;
}

export function calculateItemTax(
  price: number,
  quantity: number,
  category: string | undefined,
  taxRules: TaxRule[],
  defaultTaxRate: number
): number {
  // Find applicable tax rule for this category
  const applicableRule = taxRules.find(
    (rule) => rule.productCategories?.includes(category || "")
  );

  // Use the applicable rule's rate, or fall back to default tax rate
  const taxRate = applicableRule ? applicableRule.rate : defaultTaxRate;
  
  // Calculate tax amount
  return (price * quantity * taxRate) / 100;
}

export function calculateTotalTax(
  items: Array<{ price: number; quantity: number; category?: string }>,
  taxRules: TaxRule[],
  defaultTaxRate: number
): number {
  return items.reduce((totalTax, item) => {
    const itemTax = calculateItemTax(
      item.price,
      item.quantity,
      item.category,
      taxRules,
      defaultTaxRate
    );
    return totalTax + itemTax;
  }, 0);
}

// Helper to format tax rules from settings into the structure needed for calculations
export function formatTaxRulesFromSettings(
  taxSettings: any[] = [],
  defaultTaxRate: number
): TaxRule[] {
  // If no specific tax rules exist, create a default rule
  if (!taxSettings || taxSettings.length === 0) {
    return [
      {
        id: "default",
        name: "Default Tax",
        rate: defaultTaxRate,
        isDefault: true,
      },
    ];
  }

  // Otherwise, format the existing rules
  return taxSettings.map((setting) => ({
    id: setting.id || `rule-${Math.random().toString(36).substr(2, 9)}`,
    name: setting.name || "Tax Rule",
    rate: setting.rate || defaultTaxRate,
    productCategories: setting.categories || [],
    isDefault: setting.isDefault || false,
  }));
}
