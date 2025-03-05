
import React, { useRef } from 'react';
import { Transaction } from "@/types/transaction";
import { useStore } from "@/hooks/useStore";

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
}

const TransactionInvoice: React.FC<TransactionInvoiceProps> = ({ transaction }) => {
  const { store } = useStore();
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
        transaction.customers?.email || '',
        `Receipt from ${store?.store_name || 'NextPOS'} - #${transaction.id.slice(0, 8)}`
      );
    }
  }, [transaction, store?.store_name]);
  
  // Handle download button click
  const handleDownloadInvoice = async () => {
    await downloadPdf(invoiceRef, `receipt-${transaction.id.slice(0, 8)}.pdf`);
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

  return (
    <div className="space-y-6">
      {/* Invoice Content - Wrapped in a ref for PDF generation */}
      <div ref={invoiceRef} className="theme-container-bg p-6 space-y-6">
        {/* Store Information */}
        <InvoiceStoreInfo 
          storeName={store?.store_name || 'Store Name'} 
          storeAddress={store?.store_address || 'No address provided'} 
          storePhone={store?.store_phone || 'No phone provided'} 
        />

        {/* Customer Information */}
        <InvoiceCustomerInfo 
          firstName={transaction.customers?.first_name} 
          lastName={transaction.customers?.last_name} 
          email={transaction.customers?.email} 
        />

        {/* Transaction Details */}
        <InvoiceTransactionDetails 
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
