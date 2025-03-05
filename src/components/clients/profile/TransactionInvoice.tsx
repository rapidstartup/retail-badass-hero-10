
import React, { useState, useRef } from 'react';
import { FileText, Send, Download, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Transaction } from "@/types/transaction";
import { useStore } from "@/hooks/useStore";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TransactionInvoiceProps {
  transaction: Transaction;
}

const TransactionInvoice: React.FC<TransactionInvoiceProps> = ({ transaction }) => {
  const { store } = useStore();
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState(transaction.customers?.email || '');
  const [emailSubject, setEmailSubject] = useState(`Receipt from ${store?.store_name || 'NextPOS'} - #${transaction.id.slice(0, 8)}`);
  const [emailMessage, setEmailMessage] = useState('Thank you for your business. Please find your receipt attached.');
  
  const invoiceRef = useRef<HTMLDivElement>(null);

  const generatePDF = async (): Promise<string | null> => {
    if (!invoiceRef.current) return null;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      return pdf.output('datauristring').split(',')[1]; // Return base64 data
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadInvoice = async () => {
    setIsGenerating(true);
    try {
      if (!invoiceRef.current) {
        throw new Error('Invoice element not found');
      }
      
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Download PDF
      pdf.save(`receipt-${transaction.id.slice(0, 8)}.pdf`);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendInvoice = async () => {
    if (!emailRecipient) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setIsSending(true);
    
    try {
      // Generate PDF
      const pdfBase64 = await generatePDF();
      
      if (!pdfBase64) {
        throw new Error('Failed to generate PDF');
      }
      
      // Send email with PDF attachment using Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('send-invoice', {
        body: {
          pdfBase64,
          recipientEmail: emailRecipient,
          subject: emailSubject,
          message: emailMessage,
          storeName: store?.store_name
        }
      });
      
      if (error) throw error;
      
      setIsSendDialogOpen(false);
      toast.success('Invoice sent successfully');
    } catch (error) {
      console.error('Error sending invoice:', error);
      toast.error('Failed to send invoice. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Invoice Content - Wrapped in a ref for PDF generation */}
      <div ref={invoiceRef} className="theme-container-bg p-6 space-y-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {store?.store_name || 'Store Name'}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <p>{store?.store_address || 'No address provided'}</p>
            <p>{store?.store_phone || 'No phone provided'}</p>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <p>
              {transaction.customers?.first_name} {transaction.customers?.last_name}
            </p>
            {transaction.customers?.email && (
              <p>{transaction.customers.email}</p>
            )}
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Transaction Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p>{formatDateTime(transaction.created_at || '')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Method</p>
                  <p className="capitalize">{transaction.payment_method || 'Not specified'}</p>
                </div>
              </div>

              <Separator />

              {/* Items */}
              <div className="space-y-2">
                <p className="font-medium">Items</p>
                {transaction.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatCurrency(transaction.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>{formatCurrency(transaction.tax)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatCurrency(transaction.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={handleDownloadInvoice}
          className="flex items-center gap-2"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download PDF
        </Button>
        <Button
          onClick={() => setIsSendDialogOpen(true)}
          className="flex items-center gap-2"
          disabled={isGenerating || isSending}
        >
          <Send className="h-4 w-4" />
          Send Invoice
        </Button>
      </div>

      {/* Send Invoice Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Invoice</DialogTitle>
            <DialogDescription>
              Send this invoice as a PDF attachment to an email address.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email-recipient">Recipient Email</Label>
              <Input
                id="email-recipient"
                type="email"
                placeholder="customer@example.com"
                value={emailRecipient}
                onChange={(e) => setEmailRecipient(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email-message">Message</Label>
              <Textarea
                id="email-message"
                rows={4}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsSendDialogOpen(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendInvoice}
              disabled={isSending || !emailRecipient}
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>Send Invoice</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionInvoice;
