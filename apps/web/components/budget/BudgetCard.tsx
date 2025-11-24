import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BudgetCardProps {
  label: string;
  value: ReactNode;
  valueClassName?: string;
  children?: ReactNode;
  className?: string;
}

export function BudgetCard({
  label,
  value,
  valueClassName,
  children,
  className,
}: BudgetCardProps) {
  return (
    <div
      className={cn(
        "p-4 bg-background rounded-lg border border-border mb-4 grid gap-5 h-fit",
        className,
      )}
    >
      <div className="grid gap-1">
        <span className="font-mono text-xs leading-2 font-bold text-muted-foreground">
          {label}
        </span>
        <div className={cn("text-4xl font-mono font-bold", valueClassName)}>
          {value}
        </div>
      </div>
      {children}
    </div>
  );
}
