
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PredictiveTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Predictive Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Predictive analytics are being calculated...</p>
          <p className="mt-2">This feature is coming soon!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveTab;
