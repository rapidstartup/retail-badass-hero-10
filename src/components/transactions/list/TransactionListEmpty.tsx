
import React from "react";

const TransactionListEmpty: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <p className="text-muted-foreground">No transactions found</p>
    </div>
  );
};

export default TransactionListEmpty;
