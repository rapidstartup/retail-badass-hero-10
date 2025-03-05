/**
 * Utility functions for managing PDF styling
 */

// Stores original styles when temporarily applying light mode for PDF generation
export interface ElementStyles {
  color: string;
  backgroundColor: string;
}

/**
 * Apply light theme styles to an element and its children for PDF generation
 * 
 * @param element - The root element to style
 * @returns An object containing original styles for restoration
 */
export const applyLightThemeStyles = (element: HTMLElement): {
  originalStyles: CSSStyleDeclaration;
  originalElementStyles: Record<number, ElementStyles>;
} => {
  // Save the current element styles
  const originalStyles = window.getComputedStyle(element);
  
  // We're keeping the original background colors and text colors
  // No style modifications here anymore
  
  // Find all child elements to store their original styles
  const allElements = element.querySelectorAll('*');
  const originalElementStyles: Record<number, ElementStyles> = {};
  
  allElements.forEach((el, index) => {
    const styles = window.getComputedStyle(el);
    // Store original styles for restoration
    originalElementStyles[index] = {
      color: styles.color,
      backgroundColor: styles.backgroundColor
    };
    
    // No style modifications anymore - we preserve the original theme
  });

  return { originalStyles, originalElementStyles };
};

/**
 * Restore original styles after PDF generation
 * 
 * @param element - The root element to restore styles for
 * @param originalStyles - The original styles of the root element
 * @param originalElementStyles - The original styles of all child elements
 */
export const restoreOriginalStyles = (
  element: HTMLElement,
  originalStyles: CSSStyleDeclaration,
  originalElementStyles: Record<number, ElementStyles>
): void => {
  // Restore original styles to the root element
  element.style.backgroundColor = originalStyles.backgroundColor;
  element.style.color = originalStyles.color;
  
  // Restore original styles to all child elements
  const allElements = element.querySelectorAll('*');
  allElements.forEach((el, index) => {
    if (originalElementStyles[index]) {
      (el as HTMLElement).style.color = originalElementStyles[index].color;
      (el as HTMLElement).style.backgroundColor = originalElementStyles[index].backgroundColor;
    }
  });
};
