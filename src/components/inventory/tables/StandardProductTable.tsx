
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";

interface ProductItem {
  id: string;
  name: string;
  price: number;
  category: string | null;
  stock: number | null;
  has_variants: boolean;
}

interface StandardProductTableProps {
  products: ProductItem[];
  lowStockThreshold: number;
  loading: boolean;
}

export default function StandardProductTable({ 
  products, 
  lowStockThreshold, 
  loading 
}: StandardProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
              No standard products found
            </TableCell>
          </TableRow>
        ) : (
          products.slice(0, 5).map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.category || "Uncategorized"}</TableCell>
              <TableCell>{formatCurrency(item.price)}</TableCell>
              <TableCell>{item.stock ?? 0}</TableCell>
              <TableCell>
                {item.stock === null || item.stock <= 0 ? (
                  <Badge variant="destructive">Out of Stock</Badge>
                ) : item.stock <= lowStockThreshold ? (
                  <Badge variant="destructive">Low Stock</Badge>
                ) : (
                  <Badge variant="default">In Stock</Badge>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
