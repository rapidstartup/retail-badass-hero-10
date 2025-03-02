
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VariantTypeManagerProps {
  variantTypes: Map<string, string[]>;
  setVariantTypes: React.Dispatch<React.SetStateAction<Map<string, string[]>>>;
}

const VariantTypeManager: React.FC<VariantTypeManagerProps> = ({
  variantTypes,
  setVariantTypes,
}) => {
  const [newVariantType, setNewVariantType] = useState("");
  const [newVariantValue, setNewVariantValue] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const addVariantType = () => {
    if (!newVariantType.trim()) return;
    
    // Check if type already exists
    if (variantTypes.has(newVariantType)) {
      return;
    }
    
    // Add new type with empty values array
    const updatedTypes = new Map(variantTypes);
    updatedTypes.set(newVariantType, []);
    setVariantTypes(updatedTypes);
    setSelectedType(newVariantType);
    setNewVariantType("");
  };

  const removeVariantType = (type: string) => {
    const updatedTypes = new Map(variantTypes);
    updatedTypes.delete(type);
    setVariantTypes(updatedTypes);
    
    if (selectedType === type) {
      setSelectedType(updatedTypes.size > 0 ? Array.from(updatedTypes.keys())[0] : null);
    }
  };

  const addVariantValue = () => {
    if (!selectedType || !newVariantValue.trim()) return;
    
    const currentValues = variantTypes.get(selectedType) || [];
    
    // Check if value already exists
    if (currentValues.includes(newVariantValue)) {
      return;
    }
    
    // Add new value to the selected type
    const updatedTypes = new Map(variantTypes);
    updatedTypes.set(selectedType, [...currentValues, newVariantValue]);
    setVariantTypes(updatedTypes);
    setNewVariantValue("");
  };

  const removeVariantValue = (type: string, value: string) => {
    const currentValues = variantTypes.get(type) || [];
    const updatedValues = currentValues.filter(v => v !== value);
    
    const updatedTypes = new Map(variantTypes);
    updatedTypes.set(type, updatedValues);
    setVariantTypes(updatedTypes);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-row space-x-2">
        <Input
          placeholder="Add variant type (e.g. Color, Size)"
          value={newVariantType}
          onChange={(e) => setNewVariantType(e.target.value)}
          className="flex-1"
        />
        <Button onClick={addVariantType} size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add Type
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Variant Types List */}
        <div className="border rounded-md p-4 space-y-2">
          <h3 className="text-sm font-medium mb-2">Variant Types</h3>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {Array.from(variantTypes.keys()).map((type) => (
                <div
                  key={type}
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer ${
                    selectedType === type ? "bg-accent/20" : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  <div className="flex items-center">
                    <span>{type}</span>
                    <Badge className="ml-2" variant="outline">
                      {variantTypes.get(type)?.length || 0} values
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeVariantType(type);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {variantTypes.size === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No variant types added yet
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Variant Values */}
        <div className="border rounded-md p-4 space-y-2">
          <h3 className="text-sm font-medium mb-2">
            {selectedType ? `Values for "${selectedType}"` : "Select a type to add values"}
          </h3>
          
          {selectedType && (
            <div className="flex space-x-2 mb-2">
              <Input
                placeholder={`Add value for ${selectedType} (e.g. Red, XL)`}
                value={newVariantValue}
                onChange={(e) => setNewVariantValue(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addVariantValue} size="sm">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          )}
          
          <ScrollArea className="h-[160px]">
            <div className="flex flex-wrap gap-2">
              {selectedType &&
                (variantTypes.get(selectedType) || []).map((value) => (
                  <Badge key={value} variant="secondary" className="flex items-center gap-1 p-1">
                    {value}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => removeVariantValue(selectedType, value)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              {selectedType && (variantTypes.get(selectedType) || []).length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4 w-full">
                  No values added for "{selectedType}" yet
                </div>
              )}
              {!selectedType && (
                <div className="text-sm text-muted-foreground text-center py-4 w-full">
                  Select a variant type from the left to add values
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default VariantTypeManager;
