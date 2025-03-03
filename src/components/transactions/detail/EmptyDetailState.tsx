
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const EmptyDetailState: React.FC = () => {
  return (
    <Card className="h-full">
      <CardContent className="flex items-center justify-center h-full p-6">
        <div className="text-center text-muted-foreground">
          <p>Select a transaction to view details</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyDetailState;
