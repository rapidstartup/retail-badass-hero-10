
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Send, Printer, Loader2 } from "lucide-react";

interface InvoiceActionButtonsProps {
  onDownload: () => void;
  onSend: () => void;
  onPrint?: () => void;
  isGenerating: boolean;
  isSending: boolean;
}

const InvoiceActionButtons: React.FC<InvoiceActionButtonsProps> = ({
  onDownload,
  onSend,
  onPrint,
  isGenerating,
  isSending
}) => {
  return (
    <div className="flex justify-end space-x-3">
      {onPrint && (
        <Button
          variant="outline"
          onClick={onPrint}
          className="flex items-center gap-2"
          disabled={isGenerating}
        >
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">Print</span>
        </Button>
      )}
      
      <Button
        variant="outline"
        onClick={onDownload}
        className="flex items-center gap-2"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">Download PDF</span>
      </Button>
      
      <Button
        onClick={onSend}
        className="flex items-center gap-2"
        disabled={isGenerating || isSending}
      >
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">Send Invoice</span>
      </Button>
    </div>
  );
};

export default InvoiceActionButtons;
