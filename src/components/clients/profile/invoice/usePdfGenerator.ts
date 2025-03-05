
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
      // Capture the element with better quality
      const canvas = await html2canvas(elementRef.current, {
        scale: 3, // Higher scale for better quality
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: true,
        // Improve text rendering
        letterRendering: true
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
      // Capture the element with better quality
      const canvas = await html2canvas(elementRef.current, {
        scale: 3, // Higher scale for better quality
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: true,
        // Improve text rendering
        letterRendering: true
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
