
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

interface ErrorDetailStateProps {
  onRetry: () => void;
}

const ErrorDetailState: React.FC<ErrorDetailStateProps> = ({ onRetry }) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
        <div className="text-center text-muted-foreground">
          <p className="text-red-500">Error loading transaction details</p>
        </div>
        <Button variant="outline" onClick={onRetry}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorDetailState;
