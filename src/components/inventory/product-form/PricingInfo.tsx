
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { DollarSign } from 'lucide-react';
import { ProductFormData } from './types';

interface PricingInfoProps {
  form: UseFormReturn<ProductFormData>;
}

const PricingInfo: React.FC<PricingInfoProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="number" 
                  min={0} 
                  step="0.01" 
                  placeholder="0.00" 
                  className="pl-10" 
                  {...field}
                  value={field.value === undefined ? '' : field.value} 
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                    field.onChange(value);
                  }}
                />
              </div>
            </FormControl>
            <FormDescription>The selling price of the product</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cost</FormLabel>
            <FormControl>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="number" 
                  min={0} 
                  step="0.01" 
                  placeholder="0.00" 
                  className="pl-10" 
                  {...field}
                  value={field.value === undefined ? '' : field.value} 
                  onChange={(e) => {
                    const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                    field.onChange(value);
                  }}
                />
              </div>
            </FormControl>
            <FormDescription>Your purchase cost (not shown to customers)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PricingInfo;
