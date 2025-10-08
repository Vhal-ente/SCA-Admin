import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({ title, value, icon, trend, className }: StatCardProps) => {
  return (
    <Card className={cn("p-6 bg-gradient-card border-border hover:shadow-glow transition-all duration-300", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-sm mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mb-2">{value}</h3>
          {trend && (
            <p className={cn(
              "text-sm font-medium",
              trend.isPositive ? "text-primary" : "text-destructive"
            )}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </Card>
  );
};
