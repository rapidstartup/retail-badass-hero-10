
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionActionsProps {
  transactionId: string;
  status: string;
}

const TransactionActions: React.FC<TransactionActionsProps> = ({ 
  transactionId, 
  status 
}) => {
  const handleCompleteTab = async () => {
    if (status !== 'open') return;
    
    toast.success('Tab marked as completed', {
      description: `Transaction ${transactionId.slice(0, 8)} has been completed.`
    });
  };
  
  const handleRefund = async () => {
    if (status !== 'completed') return;
    
    toast.success('Transaction marked as refunded', {
      description: `Transaction ${transactionId.slice(0, 8)} has been refunded.`
    });
  };

  if (status === 'open') {
    return (
      <Button 
        className="w-full" 
        onClick={handleCompleteTab}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Complete Tab
      </Button>
    );
  }
  
  if (status === 'completed') {
    return (
      <Button 
        variant="outline" 
        className="w-full text-red-500 hover:text-red-700" 
        onClick={handleRefund}
      >
        Issue Refund
      </Button>
    );
  }
  
  return null;
};

export default TransactionActions;
