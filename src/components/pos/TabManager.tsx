
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Check, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TabManagerProps {
  tabEnabled: boolean;
  tabThreshold: number;
  onCheckoutTab?: (tabId: string) => void;
}

export function TabManager({ tabEnabled, tabThreshold, onCheckoutTab }: TabManagerProps) {
  const [tabs, setTabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch open tabs
  const fetchOpenTabs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("*, customers(first_name, last_name, email)")
        .eq("status", "open")
        .eq("payment_method", "tab");
        
      if (error) throw error;
      setTabs(data || []);
    } catch (error) {
      console.error("Error fetching tabs:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch of tabs
  useEffect(() => {
    if (tabEnabled) {
      fetchOpenTabs();
    }
  }, [tabEnabled]);
  
  // Set up realtime subscription to listen for new tabs
  useEffect(() => {
    if (!tabEnabled) return;
    
    const channel = supabase
      .channel('public:transactions')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'transactions', filter: "status=eq.open" }, 
        () => {
          fetchOpenTabs();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tabEnabled]);
  
  const handleRefresh = () => {
    fetchOpenTabs();
  };
  
  const handleCheckoutTab = (tabId: string) => {
    if (onCheckoutTab) {
      onCheckoutTab(tabId);
    }
  };
  
  if (!tabEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tab Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Tabs Disabled</AlertTitle>
            <AlertDescription>
              Tab system is currently disabled in settings.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Open Tabs</CardTitle>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : tabs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No open tabs</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {tabs.map((tab) => (
                <div key={tab.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">
                        {tab.customers?.first_name} {tab.customers?.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {tab.customers?.email || "No email"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={tab.total >= tabThreshold ? "destructive" : "default"}
                      >
                        {formatCurrency(tab.total)}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">
                      Opened: {new Date(tab.created_at).toLocaleString()}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleCheckoutTab(tab.id)}
                      className="h-7"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Checkout
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        
        {tabs.some(tab => tab.total >= tabThreshold) && (
          <Alert className="mt-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Attention Required</AlertTitle>
            <AlertDescription>
              Some tabs have exceeded the threshold of {formatCurrency(tabThreshold)}.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
