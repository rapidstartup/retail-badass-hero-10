
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

const TransactionListError: React.FC = () => {
  return (
    <div className="p-4 text-center">
      <p className="text-red-500">Error loading transactions</p>
      <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
        <RefreshCcw className="mr-2 h-4 w-4" />
        Retry
      </Button>
    </div>
  );
};

export default TransactionListError;
