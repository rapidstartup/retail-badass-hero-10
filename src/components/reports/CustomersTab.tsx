
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";

interface Customer {
  name: string;
  spent: number;
  visits: number;
}

interface CustomersTabProps {
  topCustomers: Customer[];
}

const CustomersTab: React.FC<CustomersTabProps> = ({ topCustomers }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead className="text-right">Visits</TableHead>
              <TableHead className="text-right">Avg. Per Visit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCustomers.map((customer, index) => (
              <TableRow key={index}>
                <TableCell>{customer.name}</TableCell>
                <TableCell className="text-right">{formatCurrency(customer.spent)}</TableCell>
                <TableCell className="text-right">{customer.visits}</TableCell>
                <TableCell className="text-right">{formatCurrency(customer.spent / customer.visits)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CustomersTab;
