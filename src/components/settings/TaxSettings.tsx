
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import POSNumpad from "@/components/pos/POSNumpad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, X, Pencil, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaxSettingsProps {
  taxRate: number;
  setTaxRate: (rate: number) => void;
}

const TaxSettings: React.FC<TaxSettingsProps> = ({ taxRate, setTaxRate }) => {
  const [showNumpad, setShowNumpad] = useState(false);
  const [inputMode, setInputMode] = useState<"standard" | "numpad">("standard");
  const [taxRules, setTaxRules] = useState<Array<{ id: string; name: string; rate: number; categories: string[] }>>([]);
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleRate, setNewRuleRate] = useState(0);
  const [newRuleCategory, setNewRuleCategory] = useState<string>("");
  
  // Sample categories - in a real app, these would come from your product database
  const availableCategories = ["Food", "Drinks", "Merchandise", "Services", "Electronics"];
  
  const handleValueChange = (value: string) => {
    if (value === "") {
      setTaxRate(0);
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setTaxRate(numValue);
      }
    }
  };
  
  const handleAddRule = () => {
    if (newRuleName.trim() === "") return;
    
    const newRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      rate: newRuleRate,
      categories: newRuleCategory ? [newRuleCategory] : []
    };
    
    setTaxRules([...taxRules, newRule]);
    setNewRuleName("");
    setNewRuleRate(0);
    setNewRuleCategory("");
  };
  
  const handleRemoveRule = (id: string) => {
    setTaxRules(taxRules.filter(rule => rule.id !== id));
  };
  
  const handleStartEdit = (id: string) => {
    setEditingRule(id);
    const rule = taxRules.find(r => r.id === id);
    if (rule) {
      setNewRuleName(rule.name);
      setNewRuleRate(rule.rate);
      setNewRuleCategory(rule.categories[0] || "");
    }
  };
  
  const handleSaveEdit = () => {
    if (!editingRule) return;
    
    setTaxRules(taxRules.map(rule => {
      if (rule.id === editingRule) {
        return {
          ...rule,
          name: newRuleName,
          rate: newRuleRate,
          categories: newRuleCategory ? [newRuleCategory] : []
        };
      }
      return rule;
    }));
    
    setEditingRule(null);
    setNewRuleName("");
    setNewRuleRate(0);
    setNewRuleCategory("");
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Settings</CardTitle>
        <CardDescription>
          Configure tax rates for your transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue={inputMode} onValueChange={(value) => setInputMode(value as "standard" | "numpad")}>
          <TabsList className="mb-4">
            <TabsTrigger value="standard">Standard Input</TabsTrigger>
            <TabsTrigger value="numpad">Numpad Input</TabsTrigger>
          </TabsList>
          
          <TabsContent value="standard">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Default Sales Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <p className="text-sm text-muted-foreground">
                  This is the default tax rate applied when no specific rules match
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="numpad">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="taxRateNumpad">Default Sales Tax Rate (%)</Label>
                <div className="flex items-center">
                  <div className="text-2xl font-medium p-2 bg-muted/30 rounded-md w-full text-right">
                    {taxRate}%
                  </div>
                </div>
                <POSNumpad 
                  initialValue={taxRate.toString()}
                  isPercentage={true}
                  onValueChange={handleValueChange}
                  hideItemName={true}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Product-Specific Tax Rates</h3>
            <Button variant="outline" size="sm" onClick={() => setEditingRule("new")}>
              <Plus className="h-4 w-4 mr-1" />
              Add Rule
            </Button>
          </div>
          
          {editingRule === "new" && (
            <div className="bg-muted/30 p-3 rounded-md space-y-3">
              <h4 className="font-medium">New Tax Rule</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="ruleName">Rule Name</Label>
                  <Input
                    id="ruleName"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    placeholder="e.g. Food Tax"
                  />
                </div>
                <div>
                  <Label htmlFor="ruleRate">Tax Rate (%)</Label>
                  <Input
                    id="ruleRate"
                    type="number"
                    value={newRuleRate}
                    onChange={(e) => setNewRuleRate(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="ruleCategory">Product Category</Label>
                  <Select value={newRuleCategory} onValueChange={setNewRuleCategory}>
                    <SelectTrigger id="ruleCategory">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingRule(null)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleAddRule}>
                  Add Rule
                </Button>
              </div>
            </div>
          )}
          
          {taxRules.length === 0 && editingRule !== "new" ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
              <p>No product-specific tax rules configured</p>
              <p className="text-sm">Add rules to apply different tax rates to specific product categories</p>
            </div>
          ) : (
            <div className="space-y-2">
              {taxRules.map((rule) => (
                <div key={rule.id} className="border rounded-md p-3">
                  {editingRule === rule.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`edit-name-${rule.id}`}>Rule Name</Label>
                          <Input
                            id={`edit-name-${rule.id}`}
                            value={newRuleName}
                            onChange={(e) => setNewRuleName(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-rate-${rule.id}`}>Tax Rate (%)</Label>
                          <Input
                            id={`edit-rate-${rule.id}`}
                            type="number"
                            value={newRuleRate}
                            onChange={(e) => setNewRuleRate(parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-category-${rule.id}`}>Product Category</Label>
                          <Select value={newRuleCategory} onValueChange={setNewRuleCategory}>
                            <SelectTrigger id={`edit-category-${rule.id}`}>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableCategories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingRule(null)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{rule.name}</h4>
                        <div className="text-sm text-muted-foreground flex flex-col sm:flex-row sm:gap-2">
                          <span>Rate: {rule.rate}%</span>
                          {rule.categories.length > 0 && (
                            <span className="sm:before:content-['•'] sm:before:mx-1 sm:before:text-muted-foreground">
                              Categories: {rule.categories.join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => handleStartEdit(rule.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive" 
                          onClick={() => handleRemoveRule(rule.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaxSettings;
