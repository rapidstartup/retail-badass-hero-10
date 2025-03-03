
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch distinct product categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("category")
          .not("category", "is", null)
          .order("category");
          
        if (error) {
          console.error("Error fetching categories:", error);
          return;
        }
        
        // Extract unique categories and add "All" at the beginning
        const uniqueCategories = ["All"];
        data.forEach(item => {
          if (item.category && !uniqueCategories.includes(item.category)) {
            uniqueCategories.push(item.category);
          }
        });
        
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Unexpected error fetching categories:", error);
      }
    };
    
    fetchCategories();
  }, []);

  return {
    categories,
    activeCategory,
    setActiveCategory
  };
};
