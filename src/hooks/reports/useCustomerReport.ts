
import { useQuery } from "@tanstack/react-query";

export const useCustomerReport = () => {
  // Sample customer data (same as in the original hook)
  const topCustomers = [
    { name: "John Doe", spent: 1245.67, visits: 12 },
    { name: "Jane Smith", spent: 987.45, visits: 8 },
    { name: "Bob Johnson", spent: 754.32, visits: 5 },
    { name: "Alice Brown", spent: 643.21, visits: 4 },
    { name: "Charlie Wilson", spent: 512.98, visits: 3 },
  ];

  return {
    topCustomers,
    isLoading: false
  };
};
