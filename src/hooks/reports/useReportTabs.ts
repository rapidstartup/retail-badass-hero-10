
import { useState } from "react";

export const useReportTabs = () => {
  const [activeTab, setActiveTab] = useState("sales");
  
  return {
    activeTab,
    setActiveTab
  };
};
