
import { useState } from 'react';
import { toast } from "sonner";
import { generateCanvas, createPdfFromCanvas, pdfToBase64 } from './utils/pdfGenerator';

/**
 * Custom hook for PDF generation functionality
 */
export const usePdfGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Generate a PDF from a DOM element and return as base64 string
   * 
   * @param elementRef - React ref to the DOM element to capture
   * @returns Base64 encoded PDF data or null if generation failed
   */
  const generatePDF = async (elementRef: React.RefObject<HTMLDivElement>): Promise<string | null> => {
    if (!elementRef.current) return null;
    
    setIsGenerating(true);
    
    try {
      // Generate canvas with light theme styling
      const { canvas, restoreStyles } = await generateCanvas(elementRef.current);
      
      // Create PDF from canvas
      const pdf = createPdfFromCanvas(canvas);
      
      // Restore original styles
      restoreStyles();
      
      // Convert PDF to base64
      return pdfToBase64(pdf);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Generate and download a PDF from a DOM element
   * 
   * @param elementRef - React ref to the DOM element to capture
   * @param filename - Name for the downloaded PDF file
   * @returns True if download was successful, false otherwise
   */
  const downloadPdf = async (elementRef: React.RefObject<HTMLDivElement>, filename: string): Promise<boolean> => {
    if (!elementRef.current) return false;
    
    setIsGenerating(true);
    
    try {
      // Generate canvas with light theme styling
      const { canvas, restoreStyles } = await generateCanvas(elementRef.current);
      
      // Create PDF from canvas with metadata
      const pdf = createPdfFromCanvas(canvas, { filename, addMetadata: true });
      
      // Restore original styles
      restoreStyles();
      
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
