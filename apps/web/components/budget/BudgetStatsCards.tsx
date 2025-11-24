import { TrendingDown, TrendingUp, Package } from "lucide-react";
import { getCurrencySymbol } from "@/lib/currency";
import { BudgetCard } from "./BudgetCard";

interface BudgetContributor {
  id: number;
  name: string;
  amount: string;
}

interface BudgetStatsCardsProps {
  baseCurrency: string;
  allocatedBudget: number;
  totalSpent: number;
  totalPlanned: number;
  actualRemaining: number;
  projectedRemaining: number;
  percentageSpent: number;
  lastUpdated: Date | null;
  budgetContributors: BudgetContributor[];
  topCategories: Array<[string, number]>;
}

export function BudgetStatsCards({
  baseCurrency,
  allocatedBudget,
  totalSpent,
  totalPlanned,
  actualRemaining,
  projectedRemaining,
  percentageSpent,
  lastUpdated,
  budgetContributors,
  topCategories,
}: BudgetStatsCardsProps) {
  const renderTopCategories = () => (
    <div className="space-y-1 mt-3 pt-3 border-t">
      <div className="flex items-center gap-2 text-xs font-medium mb-2">
        <Package className="size-3" />
        <span>Top Categories</span>
      </div>
      {topCategories.map(([category, amount]) => {
        const percentage = (amount / allocatedBudget) * 100;
        return (
          <div key={category} className="flex justify-between text-xs">
            <span className="text-muted-foreground truncate">{category}</span>
            <span className="font-medium ml-2">{percentage.toFixed(1)}%</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <BudgetCard
        label="Allocated Budget"
        value={
          <>
            {getCurrencySymbol(baseCurrency)}
            {allocatedBudget.toFixed(2)}
          </>
        }
      >
        {budgetContributors.length > 0 && (
          <div className="space-y-2">
            <div className="grid gap-1.5">
              {budgetContributors.map((contributor) => {
                const percentage =
                  (parseFloat(contributor.amount) / allocatedBudget) * 100;
                return (
                  <div
                    key={contributor.id}
                    className="flex justify-between text-xs"
                  >
                    <span className="text-muted-foreground">
                      {contributor.name}
                    </span>
                    <span className="font-medium">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </BudgetCard>

      <BudgetCard
        label="Total Spent"
        value={
          <>
            {getCurrencySymbol(baseCurrency)}
            {totalSpent.toFixed(2)}
          </>
        }
        valueClassName="text-red-600 dark:text-red-400"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <TrendingDown className="size-4" />
          <span>{percentageSpent.toFixed(1)}% of budget</span>
        </div>
        {topCategories.length > 0 && renderTopCategories()}
      </BudgetCard>

      <BudgetCard
        label="Planned Budget"
        value={
          <>
            {getCurrencySymbol(baseCurrency)}
            {totalPlanned.toFixed(2)}
          </>
        }
        valueClassName="text-orange-600 dark:text-orange-400"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <TrendingDown className="size-4" />
          <span>{percentageSpent.toFixed(1)}% of budget</span>
        </div>
        {topCategories.length > 0 && renderTopCategories()}
      </BudgetCard>

      <BudgetCard
        label="Remaining"
        value={
          <>
            {getCurrencySymbol(baseCurrency)}
            {actualRemaining.toFixed(2)}
          </>
        }
        valueClassName={
          actualRemaining >= 0
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }
      >
        {actualRemaining !== projectedRemaining && (
          <p className="text-sm text-muted-foreground mt-1">
            Projected: {getCurrencySymbol(baseCurrency)}
            {projectedRemaining.toFixed(2)}
          </p>
        )}

        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="size-4" />
            <span>
              {actualRemaining >= 0 ? "Still available" : "Over budget"}
            </span>
          </div>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-2">
              Rates updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </BudgetCard>
    </div>
  );
}
