
import React, { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import { Transaction } from "@/types/index";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowDownLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ClientTransactionHistoryProps {
  transactions: Transaction[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  loading: boolean;
}

const ClientTransactionHistory: React.FC<ClientTransactionHistoryProps> = ({
  transactions,
  pagination,
  onPageChange,
  onPageSizeChange,
  loading
}) => {
  const { page, pageSize, totalPages, totalCount } = pagination;
  
  const startItem = ((page - 1) * pageSize) + 1;
  const endItem = Math.min(page * pageSize, totalCount);
  
  // States for refund dialog
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  // Handler to open refund dialog
  const handleRefundClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setRefundAmount(transaction.total.toString());
    setIsRefundDialogOpen(true);
  };

  // Handler to process refund
  const handleProcessRefund = async () => {
    if (!selectedTransaction) return;
    
    const amount = parseFloat(refundAmount);
    
    // Validate refund amount
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid refund amount");
      return;
    }
    
    if (amount > selectedTransaction.total) {
      toast.error("Refund amount cannot exceed the transaction total");
      return;
    }
    
    setIsProcessingRefund(true);
    
    try {
      // Update transaction status to refunded and record refund amount
      const { error } = await supabase
        .from('transactions')
        .update({
          status: 'refunded',
          refund_amount: amount,
          refund_date: new Date().toISOString()
        })
        .eq('id', selectedTransaction.id);
      
      if (error) throw error;
      
      // Handle different payment methods
      const paymentMethod = selectedTransaction.payment_method;
      let refundMessage = "";
      
      if (paymentMethod === 'cash') {
        refundMessage = `Please issue a cash refund of ${formatCurrency(amount)} to the customer.`;
      } else if (paymentMethod === 'card') {
        refundMessage = `Card refund of ${formatCurrency(amount)} has been processed.`;
      } else if (paymentMethod === 'tab') {
        refundMessage = `${formatCurrency(amount)} has been credited back to the customer's tab.`;
      } else {
        refundMessage = `Refund of ${formatCurrency(amount)} has been processed.`;
      }
      
      toast.success(refundMessage);
      
      // Close the dialog and refresh
      setIsRefundDialogOpen(false);
      setSelectedTransaction(null);
      setRefundAmount("");
      
      // Trigger a refresh of the transaction list
      // This would normally come from the parent component, but for now we'll
      // rely on the user refreshing the page
    } catch (error) {
      console.error("Error processing refund:", error);
      toast.error("Failed to process refund. Please try again.");
    } finally {
      setIsProcessingRefund(false);
    }
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-pulse">Loading transactions...</div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No transactions found for this client.
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDateTime(transaction.created_at)}</TableCell>
                  <TableCell>{formatCurrency(transaction.total)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      transaction.status === 'open' ? 'bg-yellow-100 text-yellow-800' : 
                      transaction.status === 'refunded' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.payment_method || "—"}</TableCell>
                  <TableCell className="text-right">
                    {transaction.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRefundClick(transaction)}
                        className="flex items-center gap-1"
                      >
                        <ArrowDownLeft className="h-4 w-4" />
                        Refund
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startItem} to {endItem} of {totalCount} transactions
            </div>
            
            <div className="flex items-center space-x-2">
              <Select 
                value={pageSize.toString()} 
                onValueChange={(value) => onPageSizeChange(parseInt(value))}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page <= 1}
                  aria-disabled={page <= 1}
                  className={page <= 1 ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages}
                  aria-disabled={page >= totalPages}
                  className={page >= totalPages ? "opacity-50 cursor-not-allowed" : ""}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Refund Dialog */}
          <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Process Refund</DialogTitle>
                <DialogDescription>
                  Enter the amount to refund. The maximum refund amount is {selectedTransaction && formatCurrency(selectedTransaction.total)}.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="refund-amount">Refund Amount</Label>
                  <Input
                    id="refund-amount"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={selectedTransaction?.total}
                    placeholder="Enter refund amount"
                  />
                </div>
                
                {selectedTransaction?.payment_method === 'cash' && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
                    Note: Cash refunds must be processed manually at the register.
                  </div>
                )}
                
                {selectedTransaction?.payment_method === 'card' && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-md">
                    Note: Card refunds will be processed back to the original payment method.
                  </div>
                )}
                
                {selectedTransaction?.payment_method === 'tab' && (
                  <div className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-md">
                    Note: The refunded amount will be credited back to the customer's tab.
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRefundDialogOpen(false)}
                  disabled={isProcessingRefund}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleProcessRefund}
                  disabled={isProcessingRefund}
                >
                  {isProcessingRefund ? "Processing..." : "Process Refund"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ClientTransactionHistory;
