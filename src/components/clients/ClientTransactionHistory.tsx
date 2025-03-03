
import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Mail } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import type { Transaction } from "@/types/index";

interface ClientTransactionHistoryProps {
  transactions: Transaction[];
}

const ClientTransactionHistory: React.FC<ClientTransactionHistoryProps> = ({
  transactions,
}) => {
  const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);

  const toggleTransaction = (transactionId: string) => {
    setExpandedTransaction(expandedTransaction === transactionId ? null : transactionId);
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "—";
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  const getPaymentMethodLabel = (method: string | null | undefined) => {
    if (!method) return "—";
    
    const methodMap: Record<string, string> = {
      cash: "Cash",
      card: "Card",
      check: "Check",
      tab: "Tab",
      giftcard: "Gift Card",
    };
    
    return methodMap[method.toLowerCase()] || method;
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: Record<string, string> = {
      completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      open: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      refunded: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    
    return statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No transactions found for this client
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <TableRow>
                    <TableCell>{formatDate(transaction.created_at)}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(transaction.total || 0)}
                    </TableCell>
                    <TableCell>{getPaymentMethodLabel(transaction.payment_method)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          transaction.status || "open"
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTransaction(transaction.id)}
                          className="h-8 w-8 p-0"
                        >
                          {expandedTransaction === transaction.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedTransaction === transaction.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <div className="bg-muted/50 p-4">
                          <h4 className="font-medium mb-2">Transaction Details</h4>
                          <div className="space-y-4">
                            {transaction.items && Array.isArray(transaction.items) ? (
                              <div>
                                <h5 className="text-sm font-medium mb-2">Items</h5>
                                <div className="bg-background rounded-md overflow-hidden">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Subtotal</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {transaction.items.map((item: any, index: number) => (
                                        <TableRow key={index}>
                                          <TableCell>{item.name}</TableCell>
                                          <TableCell className="text-right">{item.quantity}</TableCell>
                                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                          <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No item details available</p>
                            )}
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="text-sm font-medium mb-2">Payment Details</h5>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Method:</span>
                                    <span>{getPaymentMethodLabel(transaction.payment_method)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Status:</span>
                                    <span>{transaction.status}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Date:</span>
                                    <span>{formatDate(transaction.created_at)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="text-sm font-medium mb-2">Totals</h5>
                                <div className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal:</span>
                                    <span>{formatCurrency(transaction.subtotal || 0)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax:</span>
                                    <span>{formatCurrency(transaction.tax || 0)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm font-medium">
                                    <span>Total:</span>
                                    <span>{formatCurrency(transaction.total || 0)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientTransactionHistory;
