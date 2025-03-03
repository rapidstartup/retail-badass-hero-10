
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, UserCircle, RefreshCw } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { searchCustomers } from "@/api/customerApi";
import { formatCurrency } from "@/utils/formatters";

interface CustomerListProps {
  selectedCustomerId: string | null;
  onSelectCustomer: (id: string) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({ 
  selectedCustomerId, 
  onSelectCustomer 
}) => {
  const { customers, loadingCustomers, refreshCustomers } = useCustomer();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(customers);
  const [searching, setSearching] = useState(false);

  // Update search results when customers change
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults(customers);
    }
  }, [customers, searchQuery]);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults(customers);
      return;
    }
    
    setSearching(true);
    const results = await searchCustomers(searchQuery);
    setSearchResults(results);
    setSearching(false);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Customer List</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={refreshCustomers}
            disabled={loadingCustomers}
          >
            <RefreshCw size={16} className={loadingCustomers ? "animate-spin" : ""} />
          </Button>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search customers..."
            className="pl-8 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-9"
            onClick={handleSearch}
            disabled={searching}
          >
            {searching ? <RefreshCw size={14} className="animate-spin" /> : "Search"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[640px] overflow-auto">
          {searchResults.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              {searchQuery ? "No customers matching your search" : "No customers found"}
            </div>
          ) : (
            <div className="divide-y">
              {searchResults.map((customer) => (
                <div
                  key={customer.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedCustomerId === customer.id ? "bg-muted" : ""
                  }`}
                  onClick={() => onSelectCustomer(customer.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {customer.photo_url ? (
                        <img
                          src={customer.photo_url}
                          alt={`${customer.first_name} ${customer.last_name}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircle className="w-10 h-10 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {customer.first_name} {customer.last_name}
                      </h3>
                      {customer.email && (
                        <p className="text-sm text-muted-foreground truncate">{customer.email}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {customer.tier && (
                          <Badge variant={customer.tier === "Gold" ? "default" : (customer.tier === "Silver" ? "secondary" : "outline")}>
                            {customer.tier}
                          </Badge>
                        )}
                        {customer.total_spend !== null && customer.total_spend > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {formatCurrency(customer.total_spend)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
