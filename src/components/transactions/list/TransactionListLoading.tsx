
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionListLoading: React.FC = () => {
  return (
    <div className="p-4">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionListLoading;
