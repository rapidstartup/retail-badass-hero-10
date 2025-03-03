
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ClientSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
  loading: boolean;
}

const ClientSearchBar: React.FC<ClientSearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  onSearch, 
  loading 
}) => {
  return (
    <div className="flex gap-2 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 theme-section-bg border"
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
      </div>
      <Button 
        onClick={onSearch} 
        disabled={loading} 
        className="bg-theme-accent hover:bg-theme-accent-hover text-white"
      >
        {loading ? "Searching..." : "Search"}
      </Button>
    </div>
  );
};

export default ClientSearchBar;
