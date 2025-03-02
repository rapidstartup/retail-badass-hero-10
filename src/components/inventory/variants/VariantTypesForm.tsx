
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { VariantType } from "@/hooks/useProductVariants/types";

interface VariantTypesFormProps {
  variantTypes: VariantType[];
  setVariantTypes: (types: VariantType[]) => void;
}

const VariantTypesForm = ({ variantTypes, setVariantTypes }: VariantTypesFormProps) => {
  const [newTypeName, setNewTypeName] = React.useState('');
  const [newTypeValue, setNewTypeValue] = React.useState('');
  
  const handleAddType = () => {
    if (!newTypeName || !newTypeValue) return;
    
    // Check if type already exists
    const existingTypeIndex = variantTypes.findIndex(t => t.name === newTypeName);
    
    if (existingTypeIndex >= 0) {
      // Update existing type with new values
      const updatedTypes = [...variantTypes];
      updatedTypes[existingTypeIndex] = {
        ...updatedTypes[existingTypeIndex],
        values: [...updatedTypes[existingTypeIndex].values, newTypeValue]
      };
      setVariantTypes(updatedTypes);
    } else {
      // Add new type
      setVariantTypes([
        ...variantTypes,
        { name: newTypeName, values: [newTypeValue] }
      ]);
    }
    
    // Reset form
    setNewTypeValue('');
  };
  
  const handleRemoveTypeValue = (typeName: string, valueToRemove: string) => {
    const updatedTypes = variantTypes.map(type => {
      if (type.name === typeName) {
        return {
          ...type,
          values: type.values.filter(value => value !== valueToRemove)
        };
      }
      return type;
    });
    
    // Remove type if no values left
    const filteredTypes = updatedTypes.filter(type => type.values.length > 0);
    setVariantTypes(filteredTypes);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type Name</label>
          <select 
            className="w-full px-3 py-2 border rounded-md"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
          >
            <option value="">Select or type new...</option>
            <option value="color">Color</option>
            <option value="size">Size</option>
            <option value="flavor">Flavor</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Value</label>
          <Input
            placeholder="Value"
            value={newTypeValue}
            onChange={(e) => setNewTypeValue(e.target.value)}
          />
        </div>
        
        <div className="flex items-end">
          <Button
            type="button"
            onClick={handleAddType}
            disabled={!newTypeName || !newTypeValue}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Variant
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Current Variant Types</h4>
        
        {variantTypes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No variant types defined</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {variantTypes.map((type, typeIndex) => (
              <div key={typeIndex} className="border rounded-md p-3">
                <h5 className="font-medium mb-2 capitalize">{type.name}</h5>
                <div className="flex flex-wrap gap-2">
                  {type.values.map((value, valueIndex) => (
                    <div key={valueIndex} className="bg-muted px-2 py-1 rounded-md flex items-center text-sm">
                      {value}
                      <button
                        onClick={() => handleRemoveTypeValue(type.name, value)}
                        className="ml-1 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantTypesForm;
