
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package } from 'lucide-react';

interface FormHeaderProps {
  isEditing: boolean;
}

const FormHeader: React.FC<FormHeaderProps> = ({ isEditing }) => {
  return (
    <CardHeader className="bg-muted/30 rounded-t-lg border-b border-border/30">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        <CardTitle className="text-xl">{isEditing ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </div>
      <CardDescription>
        {isEditing ? 'Update product information in your inventory' : 'Add a new product to your inventory'}
      </CardDescription>
    </CardHeader>
  );
};

export default FormHeader;
