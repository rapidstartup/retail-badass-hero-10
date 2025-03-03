
import React from "react";
import { ArrowLeft, Edit, X, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Customer } from "@/types/index";

interface ClientProfileHeaderProps {
  customer: Customer;
  isEditing: boolean;
  isSaving: boolean;
  handleGoBack: () => void;
  handleEditCustomer: () => void;
  handleCancelEdit: () => void;
  handleSubmit: () => void;
}

const ClientProfileHeader: React.FC<ClientProfileHeaderProps> = ({
  customer,
  isEditing,
  isSaving,
  handleGoBack,
  handleEditCustomer,
  handleCancelEdit,
  handleSubmit,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleGoBack}
          className="border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <h1 className="text-3xl font-bold">Edit Client</h1>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold">
              {customer.first_name} {customer.last_name}
            </h1>
            {customer.tier && (
              <Badge variant={customer.tier === 'Gold' ? 'default' : customer.tier === 'Silver' ? 'outline' : 'secondary'}>
                {customer.tier}
              </Badge>
            )}
          </>
        )}
      </div>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button 
              variant="outline" 
              onClick={handleCancelEdit}
              className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              disabled={isSaving}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-theme-accent hover:bg-theme-accent-hover text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </>
        ) : (
          <Button 
            variant="outline" 
            onClick={handleEditCustomer}
            className="border-theme-accent text-theme-accent hover:bg-theme-accent hover:text-white"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default ClientProfileHeader;
