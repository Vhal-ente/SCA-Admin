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
    <Card className={cn("p-6 bg-card border-0 rounded-none shadow-none hover:bg-secondary transition-colors duration-200", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-3">{title}</p>
          <h3 className="text-3xl font-semibold tracking-tight text-foreground mb-2">{value}</h3>
          {trend && (
            <p className={cn(
              "text-sm font-medium",
              trend.isPositive ? "text-primary" : "text-destructive"
            )}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className="w-11 h-11 rounded-sm border border-border bg-secondary flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </Card>
  );
};
