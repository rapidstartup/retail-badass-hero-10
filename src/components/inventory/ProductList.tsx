
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, AlertCircle } from "lucide-react";
import { Product } from "@/types/inventory";
import { formatCurrency } from "@/utils/formatters";

interface ProductListProps {
  products: Product[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  // Function to get stock status
  const getStockStatus = (stock: number | null) => {
    if (stock === null) return { status: "unknown", label: "Unknown" };
    if (stock <= 0) return { status: "out", label: "Out of Stock" };
    if (stock < 5) return { status: "low", label: "Low Stock" };
    return { status: "in", label: "In Stock" };
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>List of all products in inventory</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead>Variants</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                No products found. Add some products to get started.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {product.name}
                    {product.description && (
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {product.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.category ? (
                      <Badge variant="outline">{product.category}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(product.price)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        stockStatus.status === "in"
                          ? "default"
                          : stockStatus.status === "low"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {stockStatus.status === "low" && (
                        <AlertCircle className="h-3 w-3 mr-1 inline" />
                      )}
                      {product.stock !== null ? product.stock : "—"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.variants && product.variants.length > 0 ? (
                      <Badge>{product.variants.length}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onEdit(product.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductList;
