import { getCurrencySymbol } from "@/lib/currency";

interface BudgetHealthBarProps {
  baseCurrency: string;
  totalPlanned: number;
  actualRemaining?: number;
  percentageSpent: number;
  spentPercentage: number;
  plannedPercentage: number;
}

export function BudgetHealthBar({
  baseCurrency,
  totalPlanned,
  actualRemaining,
  spentPercentage,
  plannedPercentage,
}: BudgetHealthBarProps) {
  const getBarColor = () => {
    if (spentPercentage >= 90) return "bg-red-500";
    if (spentPercentage >= 75) return "bg-orange-500";
    if (spentPercentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="p-4 bg-background rounded-lg border border-border grid gap-5">
      <div className="grid gap-1">
        <span className="font-mono text-xs leading-2 font-bold text-muted-foreground">
          Total Available
        </span>
        <div
          className={`text-4xl font-mono font-bold ${
            actualRemaining !== undefined && actualRemaining >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {getCurrencySymbol(baseCurrency)}
          {actualRemaining !== undefined ? actualRemaining.toFixed(2) : "0.00"}
        </div>
      </div>
      <div className="space-y-3">
        <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
          {spentPercentage > 0 && (
            <div
              className={`absolute left-0 top-0 h-full ${getBarColor()} transition-all duration-500 ease-out`}
              style={{ width: `${spentPercentage}%` }}
            />
          )}

          {totalPlanned > 0 && (
            <div
              className="absolute left-0 top-0 h-full bg-orange-500/40"
              style={{
                width: `${Math.min(spentPercentage + plannedPercentage, 100)}%`,
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)",
              }}
            />
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {totalPlanned > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-500/40" />
              <span>Planned: {plannedPercentage.toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
