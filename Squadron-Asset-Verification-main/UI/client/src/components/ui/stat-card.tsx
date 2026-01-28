import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
  variant?: "default" | "primary" | "warning" | "destructive";
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp, 
  className,
  variant = "default" 
}: StatCardProps) {
  
  const variants = {
    default: "bg-card text-card-foreground border-border",
    primary: "bg-primary text-primary-foreground border-primary/20",
    warning: "bg-orange-50 text-orange-900 border-orange-100",
    destructive: "bg-red-50 text-red-900 border-red-100",
  };

  const iconVariants = {
    default: "bg-primary/10 text-primary",
    primary: "bg-white/20 text-white",
    warning: "bg-orange-100 text-orange-600",
    destructive: "bg-red-100 text-red-600",
  };

  return (
    <Card className={cn("shadow-sm hover:shadow-md transition-shadow duration-200", variants[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <div className={cn("p-2 rounded-lg", iconVariants[variant])}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          {trend && (
            <p className={cn("text-xs flex items-center gap-1 opacity-70", trendUp ? "text-green-500" : "text-red-500")}>
              {trendUp ? "+" : ""}{trend} from last month
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
