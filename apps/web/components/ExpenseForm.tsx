"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

interface ExpenseFormState {
  name: string;
  total: string;
  currency: string;
  category: string;
  date: string;
  dateTo: string;
  isPlanned: boolean;
  showCustomCategory: boolean;
  customCategoryInput: string;
}

interface ExpenseFormActions {
  onNameChange: (value: string) => void;
  onTotalChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onIsPlannedChange: (value: boolean) => void;
  onShowCustomCategoryChange: (value: boolean) => void;
  onCustomCategoryInputChange: (value: string) => void;
}

interface ExpenseFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingEntry: number | null;
  formState: ExpenseFormState;
  formActions: ExpenseFormActions;
  categories: ReadonlyArray<{
    readonly value: string;
    readonly label: string;
    readonly icon?: unknown;
  }>;
  customCategories: string[];
  onAddCustomCategory: () => void;
  onSubmit: (e: React.FormEvent) => void;
  getDateLabel: (category: string, isEndDate?: boolean) => string;
}

export function ExpenseForm({
  isOpen,
  onOpenChange,
  editingEntry,
  formState,
  formActions,
  categories,
  customCategories,
  onAddCustomCategory,
  onSubmit,
  getDateLabel,
}: ExpenseFormProps) {
  const {
    name,
    total,
    currency,
    category,
    date,
    dateTo,
    isPlanned,
    showCustomCategory,
    customCategoryInput,
  } = formState;

  const {
    onNameChange,
    onTotalChange,
    onCurrencyChange,
    onCategoryChange,
    onDateChange,
    onDateToChange,
    onIsPlannedChange,
    onShowCustomCategoryChange,
    onCustomCategoryInputChange,
  } = formActions;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingEntry ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
          <DialogDescription>
            {editingEntry
              ? "Update the expense details"
              : "Record a new expense for your trip"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="font-mono text-xs font-bold text-muted-foreground uppercase"
            >
              Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g. Dinner at Mario's"
              required
              className="rounded-xl h-12 px-3 py-2 text-lg"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label
                htmlFor="total"
                className="font-mono text-xs font-bold text-muted-foreground uppercase"
              >
                Total
              </Label>
              <Input
                id="total"
                type="number"
                step="0.01"
                value={total}
                onChange={(e) => onTotalChange(e.target.value)}
                placeholder="0.00"
                required
                className="rounded-xl h-12 px-3 py-2 text-lg font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="currency"
                className="font-mono text-xs font-bold text-muted-foreground uppercase"
              >
                Currency
              </Label>
              <Select value={currency} onValueChange={onCurrencyChange}>
                <SelectTrigger
                  id="currency"
                  className="rounded-xl !h-12 px-3 py-2 text-lg w-full"
                >
                  <SelectValue placeholder="Cur" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      <span className="flex items-center gap-2">
                        <span className={`fi fi-${curr.countryCode}`} />
                        <span>{curr.code}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="font-mono text-xs font-bold text-muted-foreground uppercase"
            >
              Category
            </Label>
            {!showCustomCategory ? (
              <div className="space-y-2">
                <Select value={category} onValueChange={onCategoryChange}>
                  <SelectTrigger
                    id="category"
                    className="rounded-xl !h-12 px-3 py-2 text-lg w-full"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                    {customCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onShowCustomCategoryChange(true)}
                  className="w-full text-muted-foreground hover:text-foreground h-12 rounded-xl text-base border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Category
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter custom category"
                  value={customCategoryInput}
                  onChange={(e) => onCustomCategoryInputChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onAddCustomCategory();
                    }
                  }}
                  className="rounded-xl h-12 px-3 py-2 text-lg"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={onAddCustomCategory}
                  className="rounded-xl h-12 w-12 shrink-0"
                >
                  <Plus className="h-6 w-6" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onShowCustomCategoryChange(false);
                    onCustomCategoryInputChange("");
                  }}
                  className="h-12 px-4 rounded-xl text-base"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div
            className={
              category === "hotel" || category === "flight"
                ? "grid grid-cols-2 gap-4"
                : "space-y-2"
            }
          >
            <div className="space-y-2">
              <Label
                htmlFor="date"
                className="font-mono text-xs font-bold text-muted-foreground uppercase"
              >
                {getDateLabel(category)}
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                required={!isPlanned}
                className="rounded-xl h-12 px-3 py-2 text-lg w-full"
              />
            </div>

            {(category === "hotel" || category === "flight") && (
              <div className="space-y-2">
                <Label
                  htmlFor="dateTo"
                  className="font-mono text-xs font-bold text-muted-foreground uppercase"
                >
                  {getDateLabel(category, true)}
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo || ""}
                  onChange={(e) => onDateToChange(e.target.value)}
                  min={date}
                  className="rounded-xl h-12 px-3 py-2 text-lg w-full"
                />
              </div>
            )}
          </div>

          <label
            htmlFor="isPlanned"
            className={`rounded-xl border p-4 cursor-pointer transition-colors block ${
              isPlanned
                ? "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900"
                : "bg-card hover:bg-accent/50"
            }`}
          >
            <div className="flex items-start space-x-3">
              <Checkbox
                id="isPlanned"
                checked={isPlanned}
                onCheckedChange={(checked) =>
                  onIsPlannedChange(checked as boolean)
                }
                className="mt-1"
              />
              <div className="grid gap-1.5">
                <span className="font-semibold text-sm">Planned Expense</span>
                <p className="text-sm text-muted-foreground">
                  Mark this if you haven&apos;t spent the money yet. It will be
                  counted towards your planned budget.
                </p>
              </div>
            </div>
          </label>

          <Button
            type="submit"
            className="w-full rounded-xl h-12 text-lg font-medium"
          >
            {editingEntry ? "Update Expense" : "Add Expense"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
