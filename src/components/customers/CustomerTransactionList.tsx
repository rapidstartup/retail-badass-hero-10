
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Download, Eye } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface Transaction {
  id: string;
  items: any[];
  status: string;
  total: number;
  tax: number;
  subtotal: number;
  payment_method: string | null;
  created_at: string | null;
}

export interface CustomerTransactionListProps {
  customerId: string;
}

export const CustomerTransactionList: React.FC<CustomerTransactionListProps> = ({ customerId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    // Mock data - would normally fetch from API
    setTimeout(() => {
      setTransactions([
        {
          id: "tr_1",
          items: [{ name: "Product 1", quantity: 2, price: 25 }, { name: "Product 2", quantity: 1, price: 15 }],
          status: "completed",
          total: 65,
          tax: 5,
          subtotal: 60,
          payment_method: "card",
          created_at: "2023-06-15T14:30:00Z"
        },
        {
          id: "tr_2",
          items: [{ name: "Product 3", quantity: 1, price: 99 }],
          status: "completed",
          total: 107,
          tax: 8,
          subtotal: 99,
          payment_method: "cash",
          created_at: "2023-06-10T11:20:00Z"
        },
        {
          id: "tr_3",
          items: [{ name: "Product 4", quantity: 3, price: 20 }],
          status: "refunded",
          total: 65,
          tax: 5,
          subtotal: 60,
          payment_method: "card",
          created_at: "2023-06-05T09:45:00Z"
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [customerId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "pending":
        return <Badge>Pending</Badge>;
      case "refunded":
        return <Badge variant="destructive">Refunded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethod = (method: string | null) => {
    if (!method) return "—";
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Transaction History</CardTitle>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Calendar className="h-4 w-4" />
                  {date ? format(date, "MMM dd, yyyy") : "Filter Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No transactions found for this customer
          </div>
        ) : (
          <div className="overflow-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.created_at)}</TableCell>
                    <TableCell>
                      {transaction.items?.length || 0} item{transaction.items?.length === 1 ? '' : 's'}
                    </TableCell>
                    <TableCell>{formatCurrency(transaction.total)}</TableCell>
                    <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    <TableCell>{getPaymentMethod(transaction.payment_method)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerTransactionList;
