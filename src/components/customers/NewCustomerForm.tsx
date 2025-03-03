
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createCustomer } from "@/api/customerApi";

export interface NewCustomerFormProps {
  onCancel: () => void;
  onSuccess: (newCustomer: any) => void;
}

const NewCustomerForm: React.FC<NewCustomerFormProps> = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name) {
      toast.error("First and last name are required");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newCustomer = await createCustomer(formData);
      if (newCustomer) {
        toast.success("Customer created successfully");
        onSuccess(newCustomer);
      } else {
        toast.error("Failed to create customer");
      }
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("An error occurred while creating the customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name*</Label>
            <Input
              id="first_name"
              name="first_name"
              placeholder="John"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name*</Label>
            <Input
              id="last_name"
              name="last_name"
              placeholder="Doe"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any additional information about this customer..."
            value={formData.notes}
            onChange={handleChange}
            rows={3}
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Customer"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default NewCustomerForm;
