
import React, { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import type { Customer } from "@/types/index";
import NewClientModal from "@/components/clients/NewClientModal";

interface POSCustomerSearchProps {
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
}

const POSCustomerSearch: React.FC<POSCustomerSearchProps> = ({ 
  selectedCustomer, 
  setSelectedCustomer 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchCustomers = async (search = "") => {
    setLoading(true);
    try {
      let query = supabase.from('customers').select('*');
      
      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
      }
      
      const { data, error } = await query.order('first_name', { ascending: true }).limit(10);
      
      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isOpen) {
      fetchCustomers(searchTerm);
    }
  }, [isOpen, searchTerm]);
  
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsOpen(false);
  };
  
  const handleNewCustomer = () => {
    setIsModalOpen(true);
  };
  
  const handleClientAdded = (newClient: Customer) => {
    setCustomers(prev => [newClient, ...prev]);
    setSelectedCustomer(newClient);
    setIsOpen(false);
  };

  return (
    <div>
      {selectedCustomer ? (
        <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-md">
          <User size={16} className="text-primary" />
          <span className="font-medium">{selectedCustomer.first_name} {selectedCustomer.last_name}</span>
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
          <SheetContent side="right" className="w-[400px] sm:max-w-md theme-container-bg">
            <SheetHeader>
              <SheetTitle>Select Customer</SheetTitle>
            </SheetHeader>
            
            <div className="relative mt-6 mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 theme-section-bg border"
              />
            </div>
            
            <div className="mt-4 space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                onClick={handleNewCustomer}
              >
                <Plus size={16} />
                <span>Add New Customer</span>
              </Button>
              
              <div className="h-[1px] bg-muted my-4" />
              
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading...
                </div>
              ) : customers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No customers found
                </div>
              ) : (
                customers.map(customer => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div>
                      <div className="font-medium">{customer.first_name} {customer.last_name}</div>
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
      
      <NewClientModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
};

export default POSCustomerSearch;
