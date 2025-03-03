
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui/card';
import { RefreshCcw, X } from 'lucide-react';

interface ErrorDetailStateProps {
  onClose: () => void;
}

const ErrorDetailState: React.FC<ErrorDetailStateProps> = ({ onClose }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Transaction Details</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center py-8">
        <p className="text-red-500">Error loading transaction details</p>
        <Button variant="outline" onClick={() => window.location.reload()} className="mt-4">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
};

export default ErrorDetailState;
