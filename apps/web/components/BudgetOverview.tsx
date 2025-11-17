import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Wallet, TrendingDown, TrendingUp, Users, Package } from "lucide-react";
import { getCurrencySymbol } from "@/lib/currency";

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
}: BudgetOverviewProps) {
  // Calculate category breakdown
  const categoryBreakdown = entries.reduce((acc, entry) => {
    if (entry.isPlanned) return acc;
    const converted = convertToBaseCurrency(entry.total, entry.currency);
    const category = getCategoryLabel(entry.category);
    acc[category] = (acc[category] || 0) + converted;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryBreakdown)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const totalBudget = parseFloat(allocatedBudget) || 0;
  const spentPercentage = Math.min((totalSpent / totalBudget) * 100, 100);
  const plannedPercentage = Math.min((totalPlanned / totalBudget) * 100, 100);

  // Determine bar color based on spending level
  const getBarColor = () => {
    if (spentPercentage >= 90) return "bg-red-500";
    if (spentPercentage >= 75) return "bg-orange-500";
    if (spentPercentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6 mb-6">
      {/* Budget Health Bar */}
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Budget Health</CardDescription>
          <CardTitle className="text-xl">
            {getCurrencySymbol(baseCurrency)}
            {totalSpent.toFixed(2)} / {getCurrencySymbol(baseCurrency)}
            {totalBudget.toFixed(2)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative h-8 w-full bg-muted rounded-full overflow-hidden">
            {/* Spent amount (solid bar) */}
            <div
              className={`absolute left-0 top-0 h-full ${getBarColor()} transition-all duration-500 ease-out flex items-center justify-end pr-2`}
              style={{ width: `${spentPercentage}%` }}
            >
              {spentPercentage > 10 && (
                <span className="text-xs font-bold text-white drop-shadow">
                  {spentPercentage.toFixed(0)}%
                </span>
              )}
            </div>
            {/* Planned amount (striped overlay) */}
            {totalPlanned > 0 && (
              <div
                className="absolute left-0 top-0 h-full bg-orange-500/40 transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(
                    spentPercentage + plannedPercentage,
                    100
                  )}%`,
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)",
                }}
              />
            )}
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${getBarColor()}`} />
              <span className="text-muted-foreground">
                Spent: {percentageSpent.toFixed(1)}%
              </span>
            </div>
            {totalPlanned > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-orange-500/40" />
                <span className="text-muted-foreground">
                  Planned: {plannedPercentage.toFixed(1)}%
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span
                className={`font-medium ${
                  actualRemaining >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {actualRemaining >= 0 ? "+" : ""}
                {getCurrencySymbol(baseCurrency)}
                {actualRemaining.toFixed(2)} left
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Cards */}
      <div className="grid gap-6 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Allocated Budget</CardDescription>
            <CardTitle className="text-3xl">
              {getCurrencySymbol(baseCurrency)}
              {parseFloat(allocatedBudget).toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {budgetContributors.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Users className="size-4" />
                  <span>Contributors</span>
                </div>
                {budgetContributors.map((contributor) => {
                  const percentage =
                    (parseFloat(contributor.amount) / totalBudget) * 100;
                  return (
                    <div
                      key={contributor.id}
                      className="flex justify-between text-sm"
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
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="size-4" />
                <span>Total available</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Spent</CardDescription>
            <CardTitle className="text-3xl text-red-600 dark:text-red-400">
              {getCurrencySymbol(baseCurrency)}
              {totalSpent.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <TrendingDown className="size-4" />
              <span>{percentageSpent.toFixed(1)}% of budget</span>
            </div>
            {topCategories.length > 0 && (
              <div className="space-y-1 mt-3 pt-3 border-t">
                <div className="flex items-center gap-2 text-xs font-medium mb-2">
                  <Package className="size-3" />
                  <span>Top Categories</span>
                </div>
                {topCategories.map(([category, amount]) => {
                  const percentage = (amount / totalBudget) * 100;
                  return (
                    <div
                      key={category}
                      className="flex justify-between text-xs"
                    >
                      <span className="text-muted-foreground truncate">
                        {category}
                      </span>
                      <span className="font-medium ml-2">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Planned Budget</CardDescription>
            <CardTitle className="text-3xl text-orange-600 dark:text-orange-400">
              {getCurrencySymbol(baseCurrency)}
              {totalPlanned.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="size-4" />
              <span>Reserved for planned items</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Remaining</CardDescription>
            <CardTitle
              className={`text-3xl ${
                actualRemaining >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {getCurrencySymbol(baseCurrency)}
              {actualRemaining.toFixed(2)}
            </CardTitle>
            {actualRemaining !== projectedRemaining && (
              <p className="text-sm text-muted-foreground mt-1">
                Projected: {getCurrencySymbol(baseCurrency)}
                {projectedRemaining.toFixed(2)}
              </p>
            )}
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
