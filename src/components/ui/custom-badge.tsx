
import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CustomBadgeProps extends BadgeProps {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

export function CustomBadge({ className, variant = "default", ...props }: CustomBadgeProps) {
  if (variant === "success") {
    return (
      <Badge 
        className={cn("bg-green-500 text-white hover:bg-green-600", className)} 
        {...props} 
      />
    );
  }
  
  return <Badge className={className} variant={variant} {...props} />;
}
