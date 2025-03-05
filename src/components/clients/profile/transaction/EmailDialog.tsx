
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Transaction } from "@/types/transaction";

interface EmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  recipientEmail: string;
  onRecipientEmailChange: (email: string) => void;
  emailSubject: string;
  onEmailSubjectChange: (subject: string) => void;
  emailMessage: string;
  onEmailMessageChange: (message: string) => void;
  onSendEmail: () => void;
  isSending: boolean;
}

const EmailDialog: React.FC<EmailDialogProps> = ({
  open,
  onOpenChange,
  transaction,
  recipientEmail,
  onRecipientEmailChange,
  emailSubject,
  onEmailSubjectChange,
  emailMessage,
  onEmailMessageChange,
  onSendEmail,
  isSending
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Receipt Email</DialogTitle>
          <DialogDescription>
            Send a receipt for transaction #{transaction?.id.slice(0, 8)} to the customer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient-email">Recipient Email</Label>
            <Input
              id="recipient-email"
              value={recipientEmail}
              onChange={(e) => onRecipientEmailChange(e.target.value)}
              type="email"
              placeholder="customer@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email-subject">Subject</Label>
            <Input
              id="email-subject"
              value={emailSubject}
              onChange={(e) => onEmailSubjectChange(e.target.value)}
              placeholder="Your Receipt"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email-message">Message</Label>
            <Textarea
              id="email-message"
              value={emailMessage}
              onChange={(e) => onEmailMessageChange(e.target.value)}
              rows={3}
              placeholder="Thank you for your business. Please find your receipt attached."
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSendEmail}
            disabled={isSending}
          >
            {isSending ? "Sending..." : "Send Email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;
