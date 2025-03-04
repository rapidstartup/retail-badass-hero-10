
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VariantOptionCardProps {
  title: string;
  options: string[];
  newOption: string;
  setNewOption: (option: string) => void;
  addOption: () => void;
  removeOption: (option: string) => void;
  placeholder: string;
}

const VariantOptionCard = ({
  title,
  options,
  newOption,
  setNewOption,
  addOption,
  removeOption,
  placeholder
}: VariantOptionCardProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addOption();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-3">
          <Input
            ref={inputRef}
            placeholder={placeholder}
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            size="sm" 
            onClick={() => {
              addOption();
              inputRef.current?.focus();
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <Badge key={option} variant="secondary" className="flex items-center gap-1">
              {option}
              <button 
                onClick={() => removeOption(option)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {options.length === 0 && (
            <p className="text-xs text-muted-foreground">No {title.toLowerCase()} added yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VariantOptionCard;
