
import { useState } from "react";

export function useSkuGenerator(initialPrefix: string) {
  const [skuPrefix, setSkuPrefix] = useState(initialPrefix);
  
  // Function to generate SKU based on product info and variant attributes
  const generateSku = (color: string = "", size: string = "") => {
    // Basic pattern: PREFIX-COLOR-SIZE (e.g., TST-BLK-L)
    const prefix = skuPrefix;
    const colorCode = color ? `-${color.substring(0, 3).toUpperCase()}` : "";
    const sizeCode = size ? `-${size.toUpperCase()}` : "";
    
    return `${prefix}${colorCode}${sizeCode}`;
  };

  return {
    skuPrefix,
    setSkuPrefix,
    generateSku
  };
}
