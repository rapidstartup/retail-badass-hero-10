
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatCurrency, formatDateTime } from "@/utils/formatters";
import type { Transaction } from "@/types/index";

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
  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);
    
    let startPage = Math.max(1, pagination.page - halfVisible);
    let endPage = Math.min(pagination.totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    // First page
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationLink disabled>...</PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={pagination.page === i} 
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Last page
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationLink disabled>...</PaginationLink>
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => onPageChange(pagination.totalPages)}>
            {pagination.totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <Card className="theme-container-bg border">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          Recent purchases and payments 
          {pagination.totalCount > 0 && ` (${pagination.totalCount} total)`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-6 w-6 border-t-2 border-b-2 border-theme-accent rounded-full"></div>
          </div>
        ) : transactions.length === 0 ? (
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
      {pagination.totalPages > 1 && (
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 pt-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="pageSize">Show:</Label>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value))}
            >
              <SelectTrigger id="pageSize" className="w-[80px]">
                <SelectValue placeholder={pagination.pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                  aria-disabled={pagination.page === 1}
                  className={pagination.page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                  aria-disabled={pagination.page === pagination.totalPages}
                  className={pagination.page === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  );
};

export default ClientTransactionHistory;
