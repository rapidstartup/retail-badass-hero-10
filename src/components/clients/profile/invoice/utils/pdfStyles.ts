
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
  
  // Temporarily enforce light theme styles for PDF generation
  element.style.backgroundColor = 'white';
  element.style.color = '#333';
  
  // Find all child elements and ensure they have light theme colors
  const allElements = element.querySelectorAll('*');
  const originalElementStyles: Record<number, ElementStyles> = {};
  
  allElements.forEach((el, index) => {
    const styles = window.getComputedStyle(el);
    // Store original styles for restoration
    originalElementStyles[index] = {
      color: styles.color,
      backgroundColor: styles.backgroundColor
    };
    
    // Apply light theme styles to element
    (el as HTMLElement).style.color = '#333';
    if (styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent') {
      if (styles.backgroundColor.includes('rgba') && parseFloat(styles.backgroundColor.split(',')[3]) < 0.1) {
        // Don't change very transparent backgrounds
      } else {
        (el as HTMLElement).style.backgroundColor = 'white';
      }
    }
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
