import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { getCurrencySymbol } from "@/lib/currency";

const ALERT_THRESHOLDS = [
  {
    level: 50,
    message: "You've spent 50% of your budget",
    type: "info" as const,
  },
  {
    level: 75,
    message: "Warning: 75% of budget spent!",
    type: "warning" as const,
  },
  {
    level: 90,
    message: "Alert: 90% of budget spent!",
    type: "warning" as const,
  },
  { level: 100, message: "Budget exceeded!", type: "error" as const },
];

const PROJECTED_THRESHOLD = 1000; // Special ID for projected budget warning

export function useBudgetAlerts(
  totalSpent: number,
  totalPlanned: number,
  allocatedBudget: string,
  baseCurrency: string,
) {
  const alertedThresholds = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!allocatedBudget || parseFloat(allocatedBudget) === 0) return;

    const budget = parseFloat(allocatedBudget);
    const spentPercentage = (totalSpent / budget) * 100;
    const projectedPercentage = ((totalSpent + totalPlanned) / budget) * 100;

    // Check spending thresholds
    ALERT_THRESHOLDS.forEach((threshold) => {
      if (
        spentPercentage >= threshold.level &&
        !alertedThresholds.current.has(threshold.level)
      ) {
        alertedThresholds.current.add(threshold.level);
        toast[threshold.type](threshold.message, {
          description: `Current spending: ${spentPercentage.toFixed(
            1,
          )}% (${getCurrencySymbol(baseCurrency)}${totalSpent.toFixed(2)})`,
          duration: 5000,
        });
      }
    });

    // Check projected budget warning
    if (
      projectedPercentage >= 100 &&
      !alertedThresholds.current.has(PROJECTED_THRESHOLD)
    ) {
      alertedThresholds.current.add(PROJECTED_THRESHOLD);
      toast.warning("Projected budget will exceed limit!", {
        description: `With planned expenses: ${projectedPercentage.toFixed(
          1,
        )}% (${getCurrencySymbol(baseCurrency)}${(
          totalSpent + totalPlanned
        ).toFixed(2)})`,
        duration: 5000,
      });
    }

    // Reset alerts if spending drops below threshold
    ALERT_THRESHOLDS.forEach((threshold) => {
      if (spentPercentage < threshold.level - 5) {
        alertedThresholds.current.delete(threshold.level);
      }
    });
    if (projectedPercentage < 95) {
      alertedThresholds.current.delete(PROJECTED_THRESHOLD);
    }
  }, [totalSpent, totalPlanned, allocatedBudget, baseCurrency]);
}
