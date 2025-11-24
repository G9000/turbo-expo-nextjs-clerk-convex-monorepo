import { BudgetEmptyState } from "./BudgetEmptyState";
import { BudgetHealthBar } from "./BudgetHealthBar";
import { BudgetStatsCards } from "./BudgetStatsCards";

interface BudgetContributor {
  id: number;
  name: string;
  amount: string;
}

interface BudgetOverviewProps {
  baseCurrency: string;
  allocatedBudget: string;
  totalSpent: number;
  totalPlanned: number;
  actualRemaining: number;
  projectedRemaining: number;
  percentageSpent: number;
  lastUpdated: Date | null;
  budgetContributors: BudgetContributor[];
  entries: Array<{
    id: number;
    name: string;
    total: number;
    currency: string;
    category: string;
    isPlanned?: boolean;
  }>;
  convertToBaseCurrency: (amount: number, fromCurrency: string) => number;
  getCategoryLabel: (category: string) => string;
  onSetBudget?: (amount: number) => void;
}

export function BudgetOverview({
  baseCurrency,
  allocatedBudget,
  totalSpent,
  totalPlanned,
  actualRemaining,
  projectedRemaining,
  percentageSpent,
  lastUpdated,
  budgetContributors,
  entries,
  convertToBaseCurrency,
  getCategoryLabel,
  onSetBudget,
}: BudgetOverviewProps) {
  const totalBudget = parseFloat(allocatedBudget) || 0;

  // Empty state when no budget is set
  if (totalBudget === 0) {
    return (
      <div className="space-y-6 mb-6">
        <BudgetEmptyState
          baseCurrency={baseCurrency}
          onSetBudget={onSetBudget || (() => {})}
        />
      </div>
    );
  }

  // Calculate category breakdown
  const categoryBreakdown = entries.reduce(
    (acc, entry) => {
      if (entry.isPlanned) return acc;
      const converted = convertToBaseCurrency(entry.total, entry.currency);
      const category = getCategoryLabel(entry.category);
      acc[category] = (acc[category] || 0) + converted;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const spentPercentage =
    totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
  const plannedPercentage =
    totalBudget > 0 ? Math.min((totalPlanned / totalBudget) * 100, 100) : 0;

  return (
    <div className="space-y-6 mb-6">
      <BudgetHealthBar
        baseCurrency={baseCurrency}
        totalPlanned={totalPlanned}
        actualRemaining={actualRemaining}
        percentageSpent={percentageSpent}
        spentPercentage={spentPercentage}
        plannedPercentage={plannedPercentage}
      />

      <BudgetStatsCards
        baseCurrency={baseCurrency}
        allocatedBudget={totalBudget}
        totalSpent={totalSpent}
        totalPlanned={totalPlanned}
        actualRemaining={actualRemaining}
        projectedRemaining={projectedRemaining}
        percentageSpent={percentageSpent}
        lastUpdated={lastUpdated}
        budgetContributors={budgetContributors}
        topCategories={topCategories}
      />
    </div>
  );
}
