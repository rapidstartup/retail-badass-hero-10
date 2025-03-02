
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, X, Search, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

// Mock customer data
const mockCustomers = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "555-1234", total_spend: 842.50 },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "555-5678", total_spend: 1245.75 },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", phone: "555-9012", total_spend: 563.25 },
  { id: "4", name: "Alice Brown", email: "alice@example.com", phone: "555-3456", total_spend: 1890.00 },
  { id: "5", name: "Charlie Wilson", email: "charlie@example.com", phone: "555-7890", total_spend: 420.50 },
];

interface POSCustomerSearchProps {
  selectedCustomer: any | null;
  setSelectedCustomer: (customer: any | null) => void;
}

const POSCustomerSearch: React.FC<POSCustomerSearchProps> = ({ 
  selectedCustomer, 
  setSelectedCustomer 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );
  
  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsOpen(false);
  };

  return (
    <div>
      {selectedCustomer ? (
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-md">
          <User size={16} className="text-primary" />
          <span className="font-medium">{selectedCustomer.name}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground"
            onClick={() => setSelectedCustomer(null)}
          >
            <X size={14} />
          </Button>
        </div>
      ) : (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <User size={16} />
              <span>Customer</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Select Customer</SheetTitle>
            </SheetHeader>
            
            <div className="relative mt-6 mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="mt-4 space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus size={16} />
                <span>Add New Customer</span>
              </Button>
              
              <div className="h-[1px] bg-muted my-4" />
              
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No customers found
                </div>
              ) : (
                filteredCustomers.map(customer => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                      <div className="text-sm text-muted-foreground">{customer.phone}</div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <User size={16} />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};

export default POSCustomerSearch;
