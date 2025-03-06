
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/formatters";

interface VariantItem {
  id: string;
  product_id: string;
  sku: string | null;
  price: number;
  stock_count: number | null;
  color: string | null;
  size: string | null;
  flavor: string | null;
  product_name: string;
}

interface VariantProductTableProps {
  variants: VariantItem[];
  lowStockThreshold: number;
}

export default function VariantProductTable({ 
  variants, 
  lowStockThreshold 
}: VariantProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Variant</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {variants.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
              No variants found
            </TableCell>
          </TableRow>
        ) : (
          variants.slice(0, 5).map((variant) => {
            // Construct variant display name from attributes
            const variantAttributes = [];
            if (variant.color) variantAttributes.push(variant.color);
            if (variant.size) variantAttributes.push(variant.size);
            if (variant.flavor) variantAttributes.push(variant.flavor);
            
            const variantDisplay = variantAttributes.length > 0 
              ? variantAttributes.join(' / ') 
              : 'Default';
              
            return (
              <TableRow key={variant.id}>
                <TableCell className="font-medium">{variant.product_name}</TableCell>
                <TableCell>{variantDisplay}</TableCell>
                <TableCell>{variant.sku || "N/A"}</TableCell>
                <TableCell>{formatCurrency(variant.price)}</TableCell>
                <TableCell>{variant.stock_count ?? 0}</TableCell>
                <TableCell>
                  {variant.stock_count === null || variant.stock_count <= 0 ? (
                    <Badge variant="destructive">Out of Stock</Badge>
                  ) : variant.stock_count <= lowStockThreshold ? (
                    <Badge variant="destructive">Low Stock</Badge>
                  ) : (
                    <Badge variant="default">In Stock</Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
