
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Send, Loader2 } from "lucide-react";

interface InvoiceActionButtonsProps {
  onDownload: () => void;
  onSend: () => void;
  isGenerating: boolean;
  isSending: boolean;
}

const InvoiceActionButtons: React.FC<InvoiceActionButtonsProps> = ({
  onDownload,
  onSend,
  isGenerating,
  isSending
}) => {
  return (
    <div className="flex justify-end space-x-4">
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
        Download PDF
      </Button>
      <Button
        onClick={onSend}
        className="flex items-center gap-2"
        disabled={isGenerating || isSending}
      >
        <Send className="h-4 w-4" />
        Send Invoice
      </Button>
    </div>
  );
};

export default InvoiceActionButtons;
