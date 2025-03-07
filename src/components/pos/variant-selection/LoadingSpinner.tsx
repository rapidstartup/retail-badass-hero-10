
import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center py-4">
      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
    </div>
  );
};

export default LoadingSpinner;
