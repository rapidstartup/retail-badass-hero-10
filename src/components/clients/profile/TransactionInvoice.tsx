
import React, { useRef } from 'react';
import { Transaction } from "@/types/transaction";
import { useStore } from "@/hooks/useStore";
import { useSettings } from "@/contexts/SettingsContext";
import { Customer } from "@/types/index";

// Import refactored components
import InvoiceStoreInfo from './invoice/InvoiceStoreInfo';
import InvoiceCustomerInfo from './invoice/InvoiceCustomerInfo';
import InvoiceTransactionDetails from './invoice/InvoiceTransactionDetails';
import InvoiceActionButtons from './invoice/InvoiceActionButtons';
import InvoiceSendDialog from './invoice/InvoiceSendDialog';
import { usePdfGenerator } from './invoice/usePdfGenerator';
import { useInvoiceEmail } from './invoice/useInvoiceEmail';

interface TransactionInvoiceProps {
  transaction: Transaction;
  customerDetails?: Customer | null;
}

const TransactionInvoice: React.FC<TransactionInvoiceProps> = ({ 
  transaction,
  customerDetails
}) => {
  const { store } = useStore();
  const { settings } = useSettings();
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  // Custom hooks to handle PDF and email functionality
  const { isGenerating, generatePDF, downloadPdf } = usePdfGenerator();
  const { 
    isSendDialogOpen, 
    setIsSendDialogOpen,
    isSending,
    emailRecipient,
    emailSubject,
    emailMessage,
    handleRecipientChange,
    handleSubjectChange,
    handleMessageChange,
    initializeEmailData,
    sendInvoice
  } = useInvoiceEmail();

  // Initialize email data when transaction changes
  React.useEffect(() => {
    if (transaction) {
      initializeEmailData(
        customerDetails?.email || transaction.customers?.email || '',
        `Receipt from ${store?.store_name || 'NextPOS'} - #${transaction.id.slice(0, 8)}`
      );
    }
  }, [transaction, store?.store_name, customerDetails]);
  
  // Handle download button click
  const handleDownloadInvoice = async () => {
    await downloadPdf(invoiceRef, `receipt-${transaction.id.slice(0, 8)}.pdf`);
  };

  // Handle print function
  const handlePrintInvoice = () => {
    if (invoiceRef.current) {
      const printContents = invoiceRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      
      // Create a print-friendly version
      document.body.innerHTML = `
        <html>
          <head>
            <title>Print Invoice</title>
            <style>
              body { font-family: Arial, sans-serif; color: #333; background-color: white; }
              .invoice-container { padding: 20px; max-width: 800px; margin: 0 auto; background-color: white; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; color: #333; }
              th { background-color: #f2f2f2; }
            </style>
          </head>
          <body>
            <div class="invoice-container">${printContents}</div>
          </body>
        </html>
      `;
      
      window.print();
      document.body.innerHTML = originalContents;
    }
  };

  // Handle send invoice button click
  const handleSendInvoice = async () => {
    if (!emailRecipient) {
      return;
    }
    
    // Generate PDF and send email
    const pdfBase64 = await generatePDF(invoiceRef);
    await sendInvoice(pdfBase64, store?.store_name || 'NextPOS');
  };

  // Get the appropriate background color based on the current theme
  const backgroundColor = settings.theme === 'light' 
    ? settings.lightModeColors.background 
    : settings.darkModeColors.background;

  // Get the appropriate text color based on the current theme
  const textColor = settings.theme === 'light'
    ? settings.lightModeColors.text
    : settings.darkModeColors.text;

  return (
    <div className="space-y-6">
      {/* Invoice Content - Wrapped in a ref for PDF generation */}
      <div 
        ref={invoiceRef} 
        className="theme-container-bg p-6 space-y-6 rounded-lg border border-border"
        style={{ 
          backgroundColor: backgroundColor, 
          color: textColor
        }}
      >
        {/* Store Information */}
        <InvoiceStoreInfo 
          storeName={store?.store_name || 'Store Name'} 
          storeAddress={store?.store_address} 
          storePhone={store?.store_phone} 
          logoUrl={settings.logoUrl}
        />

        {/* Customer Information */}
        <InvoiceCustomerInfo 
          firstName={customerDetails?.first_name || transaction.customers?.first_name} 
          lastName={customerDetails?.last_name || transaction.customers?.last_name} 
          email={customerDetails?.email || transaction.customers?.email} 
          phone={customerDetails?.phone || transaction.customers?.phone}
        />

        {/* Transaction Details */}
        <InvoiceTransactionDetails 
          transactionId={transaction.id}
          transactionDate={transaction.created_at || ''} 
          paymentMethod={transaction.payment_method} 
          items={transaction.items} 
          subtotal={transaction.subtotal} 
          tax={transaction.tax} 
          total={transaction.total} 
        />
      </div>

      {/* Action Buttons */}
      <InvoiceActionButtons 
        onDownload={handleDownloadInvoice} 
        onSend={() => setIsSendDialogOpen(true)} 
        onPrint={handlePrintInvoice}
        isGenerating={isGenerating} 
        isSending={isSending} 
      />

      {/* Send Invoice Dialog */}
      <InvoiceSendDialog 
        open={isSendDialogOpen} 
        onOpenChange={setIsSendDialogOpen} 
        recipientEmail={emailRecipient} 
        onRecipientEmailChange={handleRecipientChange} 
        emailSubject={emailSubject} 
        onEmailSubjectChange={handleSubjectChange} 
        emailMessage={emailMessage} 
        onEmailMessageChange={handleMessageChange} 
        onSend={handleSendInvoice} 
        isSending={isSending} 
      />
    </div>
  );
};

export default TransactionInvoice;
