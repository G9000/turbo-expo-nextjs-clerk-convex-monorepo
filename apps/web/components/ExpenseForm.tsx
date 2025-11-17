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

interface ExpenseFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingEntry: number | null;
  name: string;
  total: string;
  currency: string;
  category: string;
  date: string;
  dateTo: string;
  isPlanned: boolean;
  showCustomCategory: boolean;
  customCategoryInput: string;
  categories: ReadonlyArray<{
    readonly value: string;
    readonly label: string;
    readonly icon?: unknown;
  }>;
  customCategories: string[];
  onNameChange: (value: string) => void;
  onTotalChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onIsPlannedChange: (value: boolean) => void;
  onShowCustomCategoryChange: (value: boolean) => void;
  onCustomCategoryInputChange: (value: string) => void;
  onAddCustomCategory: () => void;
  onSubmit: (e: React.FormEvent) => void;
  getDateLabel: (category: string, isEndDate?: boolean) => string;
}

export function ExpenseForm({
  isOpen,
  onOpenChange,
  editingEntry,
  name,
  total,
  currency,
  category,
  date,
  dateTo,
  isPlanned,
  showCustomCategory,
  customCategoryInput,
  categories,
  customCategories,
  onNameChange,
  onTotalChange,
  onCurrencyChange,
  onCategoryChange,
  onDateChange,
  onDateToChange,
  onIsPlannedChange,
  onShowCustomCategoryChange,
  onCustomCategoryInputChange,
  onAddCustomCategory,
  onSubmit,
  getDateLabel,
}: ExpenseFormProps) {
  return (
    <div className="mb-6">
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full sm:w-auto">
            <Plus className="h-5 w-5 mr-2" />
            Add New Expense
          </Button>
        </DialogTrigger>
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
          <form onSubmit={onSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total">Total</Label>
              <Input
                id="total"
                type="number"
                step="0.01"
                value={total}
                onChange={(e) => onTotalChange(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={onCurrencyChange}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.code} - {curr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">
                {getDateLabel(category)}
                {isPlanned && (
                  <span className="text-xs text-muted-foreground ml-1">
                    (optional)
                  </span>
                )}
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                required={!isPlanned}
              />
            </div>

            {(category === "hotel" || category === "flight") && (
              <div className="space-y-2">
                <Label htmlFor="dateTo">{getDateLabel(category, true)}</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo || ""}
                  onChange={(e) => onDateToChange(e.target.value)}
                  min={date}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              {!showCustomCategory ? (
                <>
                  <Select value={category} onValueChange={onCategoryChange}>
                    <SelectTrigger id="category">
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
                    size="sm"
                    onClick={() => onShowCustomCategoryChange(true)}
                    className="w-full mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom Category
                  </Button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter custom category"
                    value={customCategoryInput}
                    onChange={(e) =>
                      onCustomCategoryInputChange(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onAddCustomCategory();
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={onAddCustomCategory}>
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onShowCustomCategoryChange(false);
                      onCustomCategoryInputChange("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="isPlanned"
                checked={isPlanned}
                onCheckedChange={(checked) =>
                  onIsPlannedChange(checked as boolean)
                }
              />
              <Label
                htmlFor="isPlanned"
                className="text-sm font-normal cursor-pointer"
              >
                This is a planned/budgeted expense (not yet spent)
              </Label>
            </div>

            <Button type="submit" className="w-full">
              {editingEntry ? "Update Expense" : "Add Expense"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
