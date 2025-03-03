
/**
 * Utility for calculating customer tiers based on spending
 */
import { useSettings } from "@/contexts/SettingsContext";

// Define default thresholds (these will be overridden by settings)
export const TIER_THRESHOLDS = {
  BRONZE: 0,       // Starting tier (default)
  SILVER: 500,     // $500 minimum spend to reach Silver
  GOLD: 2000       // $2000 minimum spend to reach Gold
};

/**
 * Get the current tier thresholds from settings
 * @returns The current tier thresholds object
 */
export const getTierThresholds = () => {
  // Try to get settings from localStorage as a fallback
  let thresholds = { ...TIER_THRESHOLDS };
  
  try {
    const savedSettings = localStorage.getItem("posSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.tierThresholdSilver !== undefined) {
        thresholds.SILVER = settings.tierThresholdSilver;
      }
      if (settings.tierThresholdGold !== undefined) {
        thresholds.GOLD = settings.tierThresholdGold;
      }
    }
  } catch (error) {
    console.error("Error reading tier thresholds from settings:", error);
  }
  
  return thresholds;
};

/**
 * Calculate the appropriate customer tier based on total spend
 * @param totalSpend - The customer's total spending amount
 * @returns The tier designation ("Bronze", "Silver", or "Gold")
 */
export const calculateTierFromSpend = (totalSpend: number | null): string => {
  if (!totalSpend || totalSpend < 0) return "Bronze";
  
  const thresholds = getTierThresholds();
  
  if (totalSpend >= thresholds.GOLD) {
    return "Gold";
  } else if (totalSpend >= thresholds.SILVER) {
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
  
  const thresholds = getTierThresholds();
  
  if (totalSpend >= thresholds.GOLD) {
    return 0; // Already at highest tier
  } else if (totalSpend >= thresholds.SILVER) {
    return thresholds.GOLD - totalSpend; // Need to reach Gold
  } else {
    return thresholds.SILVER - totalSpend; // Need to reach Silver
  }
};
