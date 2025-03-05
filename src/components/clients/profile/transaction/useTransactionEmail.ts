
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Transaction } from "@/types/transaction";

export const useTransactionEmail = () => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [emailSubject, setEmailSubject] = useState("Your Receipt");
  const [emailMessage, setEmailMessage] = useState(
    "Thank you for your business. Please find your receipt attached."
  );
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleEmailClick = (transaction: Transaction, defaultEmail?: string) => {
    setSelectedTransaction(transaction);
    
    // Prioritize the customer email from the transaction
    const customerEmail = transaction.customers?.email || defaultEmail || "";
    
    // Set the email recipient to the customer's email address
    setRecipientEmail(customerEmail);
    
    // Set transaction-specific subject
    setEmailSubject(`Receipt for transaction #${transaction.id.slice(0, 8)}`);
    
    // Open the email dialog
    setIsEmailDialogOpen(true);
  };

  const generatePDF = async (elementId: string): Promise<string> => {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error("Element not found");
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const pdf = new jsPDF({
        format: "a4",
        unit: "mm",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      
      // Convert PDF to base64
      const pdfBase64 = pdf.output("datauristring");
      return pdfBase64.split(",")[1]; // Remove the data URI prefix
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  const handleSendEmail = async (invoiceElementId: string) => {
    if (!selectedTransaction) return;
    
    if (!recipientEmail) {
      toast.error("Please enter a recipient email address");
      return;
    }
    
    setIsSendingEmail(true);
    
    try {
      // Generate PDF from the invoice element
      const pdfBase64 = await generatePDF(invoiceElementId);
      
      // Send email via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("send-invoice", {
        body: {
          pdfBase64,
          recipientEmail,
          subject: emailSubject,
          message: emailMessage,
          storeName: "NextPOS" // You might want to make this dynamic from settings
        }
      });
      
      if (error) throw error;
      
      toast.success("Receipt email sent successfully");
      setIsEmailDialogOpen(false);
      
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send receipt email. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return {
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    selectedTransaction,
    recipientEmail,
    setRecipientEmail,
    emailSubject,
    setEmailSubject,
    emailMessage,
    setEmailMessage,
    isSendingEmail,
    handleEmailClick,
    handleSendEmail
  };
};
