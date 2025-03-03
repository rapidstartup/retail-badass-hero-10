
import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// No longer need to extend BadgeProps with a custom variant since we've added it to the original component
export function CustomBadge({ className, variant = "default", ...props }: BadgeProps) {
  return <Badge className={className} variant={variant} {...props} />;
}
