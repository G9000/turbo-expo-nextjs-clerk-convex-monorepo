import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Plus } from "lucide-react";
import { useState } from "react";
import { getCurrencySymbol } from "@/lib/currency";

interface BudgetEmptyStateProps {
  baseCurrency: string;
  onSetBudget: (amount: number) => void;
}

export function BudgetEmptyState({
  baseCurrency,
  onSetBudget,
}: BudgetEmptyStateProps) {
  const [budgetInput, setBudgetInput] = useState("");

  const handleSetBudget = () => {
    const amount = parseFloat(budgetInput);
    if (!isNaN(amount) && amount > 0) {
      onSetBudget(amount);
    }
  };

  const isValidInput = budgetInput && parseFloat(budgetInput) > 0;

  return (
    <div className="rounded-lg bg-background p-5 border border-border">
      <div className="pt-12 pb-12 flex flex-col items-center justify-center text-center">
        <div className="rounded-full bg-foreground/10 p-4 mb-4">
          <Wallet className="size-8 text-foreground/60" />
        </div>
        <div className="text-xl mb-2">No Budget Set</div>
        <p className="mb-6 max-w-sm">
          Set your trip budget to start tracking expenses and manage your
          spending across categories.
        </p>
        <div className="flex gap-2 w-full max-w-sm items-center">
          <span className="text-lg font-medium text-foreground/70">
            {getCurrencySymbol(baseCurrency)}
          </span>
          <Input
            type="number"
            placeholder="0.00"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSetBudget();
              }
            }}
            className="rounded-xl h-10 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&]:m-0 flex-1"
          />
          <Button
            onClick={handleSetBudget}
            disabled={!isValidInput}
            className="rounded-xl bg-foreground text-background hover:bg-foreground/90 px-4 py-2 h-10 gap-2"
          >
            <Plus className="size-4" />
            <span>Set</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
