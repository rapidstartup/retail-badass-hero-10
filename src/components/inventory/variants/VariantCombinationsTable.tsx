
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit, Save, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface VariantCombination {
  id?: string;
  sku: string;
  price: number;
  stock_count: number;
  color?: string;
  size?: string;
  flavor?: string;
  [key: string]: any;
}

export interface VariantCombinationsTableProps {
  combinations: VariantCombination[];
  onUpdateCombination: (index: number, updates: Partial<VariantCombination>) => void;
  onDeleteCombination: (index: number) => void;
  basePrice: number;
  skuPrefix: string;
  isLoading: boolean;
}

const VariantCombinationsTable = ({
  combinations,
  onUpdateCombination,
  onDeleteCombination,
  basePrice,
  skuPrefix,
  isLoading
}: VariantCombinationsTableProps) => {
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [editValues, setEditValues] = React.useState<Partial<VariantCombination>>({});

  const startEditing = (index: number, combination: VariantCombination) => {
    setEditingIndex(index);
    setEditValues({ ...combination });
  };

  const handleChange = (key: string, value: any) => {
    setEditValues(prev => ({ ...prev, [key]: value }));
  };

  const saveChanges = (index: number) => {
    onUpdateCombination(index, editValues);
    setEditingIndex(null);
    setEditValues({});
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditValues({});
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="w-full h-12" />
        ))}
      </div>
    );
  }

  if (combinations.length === 0) {
    return <p className="text-center py-4 text-muted-foreground">No variants to display</p>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Attributes</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {combinations.map((combination, index) => (
            <TableRow key={combination.id || index}>
              {editingIndex === index ? (
                // Editing mode
                <>
                  <TableCell>
                    <Input 
                      value={editValues.sku || ''} 
                      onChange={(e) => handleChange('sku', e.target.value)} 
                      placeholder={`${skuPrefix}-${index + 1}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {combination.color && 
                        <span className="mr-2">Color: {combination.color}</span>}
                      {combination.size && 
                        <span className="mr-2">Size: {combination.size}</span>}
                      {combination.flavor && 
                        <span>Flavor: {combination.flavor}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      value={editValues.price || basePrice} 
                      onChange={(e) => handleChange('price', Number(e.target.value))} 
                      step="0.01"
                      min="0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      type="number" 
                      value={editValues.stock_count || 0} 
                      onChange={(e) => handleChange('stock_count', Number(e.target.value))} 
                      step="1"
                      min="0"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => saveChanges(index)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={cancelEditing}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                // View mode
                <>
                  <TableCell className="font-mono">{combination.sku || `${skuPrefix}-${index + 1}`}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {combination.color && 
                        <span className="mr-2">Color: {combination.color}</span>}
                      {combination.size && 
                        <span className="mr-2">Size: {combination.size}</span>}
                      {combination.flavor && 
                        <span>Flavor: {combination.flavor}</span>}
                    </div>
                  </TableCell>
                  <TableCell>${combination.price?.toFixed(2) || basePrice.toFixed(2)}</TableCell>
                  <TableCell>{combination.stock_count || 0}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => startEditing(index, combination)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onDeleteCombination(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VariantCombinationsTable;
