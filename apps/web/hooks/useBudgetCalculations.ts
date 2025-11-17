import { useMemo } from "react";

interface Entry {
  total: number;
  currency: string;
  isPlanned?: boolean;
}

interface BudgetCalculations {
  totalSpent: number;
  totalPlanned: number;
  actualRemaining: number;
  projectedRemaining: number;
  percentageSpent: number;
}

export function useBudgetCalculations(
  entries: Entry[],
  allocatedBudget: string,
  convertToBaseCurrency: (amount: number, currency: string) => number,
): BudgetCalculations {
  return useMemo(() => {
    const totalSpent = entries
      .filter((entry) => !entry.isPlanned)
      .reduce((sum, entry) => {
        const convertedAmount = convertToBaseCurrency(
          entry.total,
          entry.currency,
        );
        return sum + convertedAmount;
      }, 0);

    const totalPlanned = entries
      .filter((entry) => entry.isPlanned)
      .reduce((sum, entry) => {
        const convertedAmount = convertToBaseCurrency(
          entry.total,
          entry.currency,
        );
        return sum + convertedAmount;
      }, 0);

    const budget = parseFloat(allocatedBudget || "0");
    const actualRemaining = budget - totalSpent;
    const projectedRemaining = budget - totalSpent - totalPlanned;
    const percentageSpent = budget ? (totalSpent / budget) * 100 : 0;

    return {
      totalSpent,
      totalPlanned,
      actualRemaining,
      projectedRemaining,
      percentageSpent,
    };
  }, [entries, allocatedBudget, convertToBaseCurrency]);
}
