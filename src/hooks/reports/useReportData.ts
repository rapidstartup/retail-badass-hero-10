
import { useState } from "react";
import { DateRange } from "react-day-picker";

export const useReportData = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  // Handler for date range changes that correctly types the data
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateRange({
        from: range.from,
        to: range.to || range.from
      });
    }
  };

  // Sample data for demonstration
  const topProducts = [
    { name: "Coffee", quantity: 152, revenue: 456 },
    { name: "Tea", quantity: 98, revenue: 294 },
    { name: "Sandwich", quantity: 64, revenue: 384 },
    { name: "Cookie", quantity: 87, revenue: 174 },
    { name: "Muffin", quantity: 45, revenue: 135 },
  ];

  const dailySales = [
    { date: new Date("2023-05-01"), sales: 345.67 },
    { date: new Date("2023-05-02"), sales: 412.89 },
    { date: new Date("2023-05-03"), sales: 298.45 },
    { date: new Date("2023-05-04"), sales: 512.34 },
    { date: new Date("2023-05-05"), sales: 389.75 },
  ];

  const topCustomers = [
    { name: "John Doe", spent: 1245.67, visits: 12 },
    { name: "Jane Smith", spent: 987.45, visits: 8 },
    { name: "Bob Johnson", spent: 754.32, visits: 5 },
    { name: "Alice Brown", spent: 643.21, visits: 4 },
    { name: "Charlie Wilson", spent: 512.98, visits: 3 },
  ];

  const inventoryStatus = [
    { product: "Coffee Beans", stock: 24, reorderLevel: 10, status: "Good" as const },
    { product: "Tea Bags", stock: 8, reorderLevel: 15, status: "Low" as const },
    { product: "Cups", stock: 150, reorderLevel: 50, status: "Good" as const },
    { product: "Milk", stock: 3, reorderLevel: 5, status: "Low" as const },
    { product: "Sugar", stock: 2, reorderLevel: 5, status: "Critical" as const },
  ];

  return {
    activeTab,
    setActiveTab,
    dateRange,
    handleDateRangeChange,
    topProducts,
    dailySales,
    topCustomers,
    inventoryStatus
  };
};
