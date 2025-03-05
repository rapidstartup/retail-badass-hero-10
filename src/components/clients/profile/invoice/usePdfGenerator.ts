
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from "sonner";

export const usePdfGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async (elementRef: React.RefObject<HTMLDivElement>): Promise<string | null> => {
    if (!elementRef.current) return null;
    
    setIsGenerating(true);
    
    try {
      // Save the current element styles
      const originalStyles = window.getComputedStyle(elementRef.current);
      
      // Temporarily enforce light theme styles for PDF generation
      elementRef.current.style.backgroundColor = 'white';
      elementRef.current.style.color = '#333';
      
      // Find all child elements and ensure they have light theme colors
      const allElements = elementRef.current.querySelectorAll('*');
      const originalElementStyles: { [key: string]: { color: string, backgroundColor: string } } = {};
      
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
      
      // Capture the element with better quality
      const canvas = await html2canvas(elementRef.current, {
        scale: 3, // Higher scale for better quality
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: true
      });
      
      // Restore original styles
      elementRef.current.style.backgroundColor = originalStyles.backgroundColor;
      elementRef.current.style.color = originalStyles.color;
      
      allElements.forEach((el, index) => {
        if (originalElementStyles[index]) {
          (el as HTMLElement).style.color = originalElementStyles[index].color;
          (el as HTMLElement).style.backgroundColor = originalElementStyles[index].backgroundColor;
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0); // Use maximum quality
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions for proper aspect ratio
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image with margins for better appearance
      const margin = 10; // 10mm margin
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth - (margin * 2), imgHeight - (margin * 2));
      
      // Add page numbers if multiple pages
      if (imgHeight > pageHeight) {
        let heightLeft = imgHeight;
        let position = 0;
        // Remove first page that was automatically added
        // Add pages as needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, margin + position, imgWidth - (margin * 2), imgHeight - (margin * 2));
          heightLeft -= pageHeight;
        }
      }
      
      return pdf.output('datauristring').split(',')[1]; // Return base64 data
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPdf = async (elementRef: React.RefObject<HTMLDivElement>, filename: string): Promise<boolean> => {
    if (!elementRef.current) return false;
    
    setIsGenerating(true);
    
    try {
      // Save the current element styles
      const originalStyles = window.getComputedStyle(elementRef.current);
      
      // Temporarily enforce light theme styles for PDF generation
      elementRef.current.style.backgroundColor = 'white';
      elementRef.current.style.color = '#333';
      
      // Find all child elements and ensure they have light theme colors
      const allElements = elementRef.current.querySelectorAll('*');
      const originalElementStyles: { [key: string]: { color: string, backgroundColor: string } } = {};
      
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
      
      // Capture the element with better quality
      const canvas = await html2canvas(elementRef.current, {
        scale: 3, // Higher scale for better quality
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: true
      });
      
      // Restore original styles
      elementRef.current.style.backgroundColor = originalStyles.backgroundColor;
      elementRef.current.style.color = originalStyles.color;
      
      allElements.forEach((el, index) => {
        if (originalElementStyles[index]) {
          (el as HTMLElement).style.color = originalElementStyles[index].color;
          (el as HTMLElement).style.backgroundColor = originalElementStyles[index].backgroundColor;
        }
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0); // Use maximum quality
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions for proper aspect ratio
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image with margins for better appearance
      const margin = 10; // 10mm margin
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth - (margin * 2), imgHeight - (margin * 2));
      
      // Add metadata to the PDF
      pdf.setProperties({
        title: filename,
        subject: 'Invoice',
        author: 'NextPOS',
        creator: 'NextPOS'
      });
      
      // Download PDF
      pdf.save(filename);
      toast.success('Invoice downloaded successfully');
      return true;
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice. Please try again.');
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatePDF,
    downloadPdf
  };
};
