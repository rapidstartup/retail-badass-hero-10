
import React from "react";
import { RefreshCw } from "lucide-react";

export default function LoadingIndicator() {
  return (
    <div className="flex items-center justify-center h-[200px]">
      <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
}
