"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Users } from "lucide-react";
import { SUPPORTED_CURRENCIES, getCurrencySymbol } from "@/lib/currency";
import type { BudgetContributor } from "@/store/useTripStore";

interface TripSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tripTitle: string;
  allocatedBudget: string;
  baseCurrency: string;
  budgetContributors: BudgetContributor[];
  onTripTitleChange: (value: string) => void;
  onAllocatedBudgetChange: (value: string) => void;
  onBaseCurrencyChange: (value: string) => void;
  onAddContributor: (contributor: BudgetContributor) => void;
  onDeleteContributor: (id: number) => void;
  onSave: () => void;
}

export function TripSettingsDialog({
  isOpen,
  onOpenChange,
  tripTitle,
  allocatedBudget,
  baseCurrency,
  budgetContributors,
  onTripTitleChange,
  onAllocatedBudgetChange,
  onBaseCurrencyChange,
  onAddContributor,
  onDeleteContributor,
  onSave,
}: TripSettingsDialogProps) {
  const [contributorName, setContributorName] = useState("");
  const [contributorAmount, setContributorAmount] = useState("");

  const handleAddContributor = () => {
    if (contributorName.trim() && contributorAmount) {
      onAddContributor({
        id: Date.now(),
        name: contributorName.trim(),
        amount: contributorAmount,
      });
      setContributorName("");
      setContributorAmount("");
    }
  };

  const totalContributed = budgetContributors.reduce(
    (sum, c) => sum + parseFloat(c.amount || "0"),
    0,
  );

  useEffect(() => {
    if (budgetContributors.length > 0) {
      onAllocatedBudgetChange(totalContributed.toFixed(2));
    }
  }, [totalContributed, budgetContributors.length, onAllocatedBudgetChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Trip Settings</DialogTitle>
          <DialogDescription>
            Edit trip details and manage budget contributors
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="space-y-6"
        >
          {/* Trip Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-tripTitle">Trip Name</Label>
            <Input
              id="edit-tripTitle"
              type="text"
              value={tripTitle}
              onChange={(e) => onTripTitleChange(e.target.value)}
              placeholder="e.g., Tokyo Adventure 2025"
              required
            />
          </div>

          {/* Base Currency */}
          <div className="space-y-2">
            <Label htmlFor="edit-baseCurrency">Base Currency</Label>
            <Select value={baseCurrency} onValueChange={onBaseCurrencyChange}>
              <SelectTrigger id="edit-baseCurrency">
                <SelectValue placeholder="Select base currency" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CURRENCIES.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code}>
                    <span className="flex items-center gap-2">
                      <span className={`fi fi-${curr.countryCode}`} />
                      <span>
                        {curr.symbol} {curr.code} - {curr.name}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget Contributors Section */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Budget Contributors</h3>
            </div>

            {/* List of Contributors */}
            {budgetContributors.length > 0 && (
              <div className="space-y-2">
                {budgetContributors.map((contributor) => (
                  <div
                    key={contributor.id}
                    className="flex items-center gap-2 p-3 bg-muted"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{contributor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {getCurrencySymbol(baseCurrency)}
                        {parseFloat(contributor.amount).toFixed(2)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteContributor(contributor.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-primary/10 font-semibold">
                  <span>Total Budget</span>
                  <span>
                    {getCurrencySymbol(baseCurrency)}
                    {totalContributed.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Add Contributor Form */}
            <div className="space-y-3 p-4 border bg-card">
              <h4 className="font-medium">Add Contributor</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="contributor-name">Name</Label>
                  <Input
                    id="contributor-name"
                    type="text"
                    value={contributorName}
                    onChange={(e) => setContributorName(e.target.value)}
                    placeholder="e.g., John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contributor-amount">Amount</Label>
                  <Input
                    id="contributor-amount"
                    type="number"
                    step="0.01"
                    value={contributorAmount}
                    onChange={(e) => setContributorAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <Button
                type="button"
                onClick={handleAddContributor}
                variant="outline"
                size="sm"
                className="w-full"
                disabled={!contributorName.trim() || !contributorAmount}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contributor
              </Button>
            </div>

            {/* Manual Budget Input (if no contributors) */}
            {budgetContributors.length === 0 && (
              <div className="space-y-2">
                <Label htmlFor="edit-allocatedBudget">Total Budget</Label>
                <Input
                  id="edit-allocatedBudget"
                  type="number"
                  step="0.01"
                  value={allocatedBudget}
                  onChange={(e) => onAllocatedBudgetChange(e.target.value)}
                  placeholder="Enter your total budget"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Add contributors above to split the budget automatically
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
