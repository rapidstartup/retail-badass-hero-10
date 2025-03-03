
/**
 * Utility for calculating customer tiers based on spending
 */

// Spending thresholds for tier progression
export const TIER_THRESHOLDS = {
  BRONZE: 0,       // Starting tier (default)
  SILVER: 500,     // $500 minimum spend to reach Silver
  GOLD: 2000       // $2000 minimum spend to reach Gold
};

/**
 * Calculate the appropriate customer tier based on total spend
 * @param totalSpend - The customer's total spending amount
 * @returns The tier designation ("Bronze", "Silver", or "Gold")
 */
export const calculateTierFromSpend = (totalSpend: number | null): string => {
  if (!totalSpend || totalSpend < 0) return "Bronze";
  
  if (totalSpend >= TIER_THRESHOLDS.GOLD) {
    return "Gold";
  } else if (totalSpend >= TIER_THRESHOLDS.SILVER) {
    return "Silver";
  } else {
    return "Bronze";
  }
};

/**
 * Calculate the spending needed to reach the next tier
 * @param totalSpend - The customer's current total spending
 * @returns The amount needed to reach the next tier, or 0 if already at Gold
 */
export const calculateSpendToNextTier = (totalSpend: number | null): number => {
  if (!totalSpend || totalSpend < 0) totalSpend = 0;
  
  if (totalSpend >= TIER_THRESHOLDS.GOLD) {
    return 0; // Already at highest tier
  } else if (totalSpend >= TIER_THRESHOLDS.SILVER) {
    return TIER_THRESHOLDS.GOLD - totalSpend; // Need to reach Gold
  } else {
    return TIER_THRESHOLDS.SILVER - totalSpend; // Need to reach Silver
  }
};
