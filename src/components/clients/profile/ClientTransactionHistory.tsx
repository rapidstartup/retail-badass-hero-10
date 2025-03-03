
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import type { Transaction } from "@/types/index";

interface ClientTransactionHistoryProps {
  transactions: Transaction[];
}

const ClientTransactionHistory: React.FC<ClientTransactionHistoryProps> = ({ transactions }) => {
  return (
    <Card className="theme-container-bg border">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Recent purchases and payments</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No transactions found for this client.
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {transactions.map((transaction) => (
              <AccordionItem key={transaction.id} value={transaction.id}>
                <AccordionTrigger className="px-4 py-3 theme-section-bg hover:bg-theme-section-selected rounded-md my-1">
                  <div className="flex justify-between w-full items-center pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-sm">
                          {transaction.created_at ? formatDateTime(transaction.created_at) : 'Unknown date'}
                        </span>
                        <Badge variant={transaction.status === 'completed' ? 'success' : transaction.status === 'open' ? 'secondary' : 'outline'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold">{formatCurrency(transaction.total)}</span>
                      <div className="text-xs text-muted-foreground">
                        {transaction.payment_method || 'No payment method'}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <div className="space-y-4">
                    <div className="border rounded-md overflow-hidden theme-section-bg">
                      <Table>
                        <TableHeader className="bg-theme-section-bg">
                          <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transaction.items && typeof transaction.items === 'object' ? 
                            Object.values(transaction.items).map((item: any, index) => (
                              <TableRow key={index} className="hover:bg-theme-section-selected">
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-right">{item.quantity}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.quantity * item.price)}</TableCell>
                              </TableRow>
                            )) : 
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-muted-foreground">
                                No items available
                              </TableCell>
                            </TableRow>
                          }
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(transaction.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax:</span>
                      <span>{formatCurrency(transaction.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(transaction.total)}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientTransactionHistory;
