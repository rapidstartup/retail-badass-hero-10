
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, RefreshCw } from "lucide-react";
import { ProductVariant } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface VariantCombination {
  id?: string;
  attributes: Record<string, string>;
  sku: string;
  price: number;
  stock_count: number;
  product_id: string;
}

interface VariantCombinationsTableProps {
  combinations: VariantCombination[];
  basePrice: number;
  skuPrefix: string;
  onUpdateCombination: (index: number, updates: Partial<VariantCombination>) => void;
  onDeleteCombination: (index: number) => void;
  isLoading: boolean;
}

const VariantCombinationsTable: React.FC<VariantCombinationsTableProps> = ({
  combinations,
  basePrice,
  skuPrefix,
  onUpdateCombination,
  onDeleteCombination,
  isLoading
}) => {
  // Get attribute names from first combination for table headers
  const attributeNames = combinations.length > 0
    ? Object.keys(combinations[0].attributes)
    : [];

  return (
    <div className="border rounded-md">
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              {attributeNames.map((name) => (
                <TableHead key={name}>{name}</TableHead>
              ))}
              <TableHead>SKU</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={attributeNames.length + 4} className="h-24 text-center">
                  <RefreshCw className="h-5 w-5 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : combinations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={attributeNames.length + 4} className="h-24 text-center">
                  No variant combinations generated. Add variant types and values first.
                </TableCell>
              </TableRow>
            ) : (
              combinations.map((combination, index) => (
                <TableRow key={index}>
                  {/* Render each attribute value */}
                  {attributeNames.map((name) => (
                    <TableCell key={name}>
                      {combination.attributes[name]}
                    </TableCell>
                  ))}
                  
                  {/* SKU */}
                  <TableCell>
                    <Input
                      value={combination.sku}
                      onChange={(e) => onUpdateCombination(index, { sku: e.target.value })}
                      className="w-full"
                    />
                  </TableCell>
                  
                  {/* Price */}
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={combination.price}
                      onChange={(e) => onUpdateCombination(index, { price: Number(e.target.value) })}
                      className="w-24"
                    />
                  </TableCell>
                  
                  {/* Stock */}
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={combination.stock_count}
                      onChange={(e) => onUpdateCombination(index, { stock_count: Number(e.target.value) })}
                      className="w-24"
                    />
                  </TableCell>
                  
                  {/* Actions */}
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Variant Combination</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this variant combination? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground"
                            onClick={() => onDeleteCombination(index)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default VariantCombinationsTable;
