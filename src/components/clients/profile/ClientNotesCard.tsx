
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ClientNotesCardProps {
  notes: string | null;
}

const ClientNotesCard: React.FC<ClientNotesCardProps> = ({ notes }) => {
  if (!notes) return null;
  
  return (
    <Card className="theme-container-bg border">
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{notes}</p>
      </CardContent>
    </Card>
  );
};

export default ClientNotesCard;
