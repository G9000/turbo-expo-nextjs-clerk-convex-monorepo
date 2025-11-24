"use client";

import { ExpenseForm } from "./ExpenseForm";
import { ExpenseList } from "./ExpenseList";
import {
  EXPENSE_CATEGORIES,
  getCategoryIcon,
  getCategoryLabel,
  getDateLabel,
} from "@/lib/categories";

interface ExpenseEntry {
  id: number;
  name: string;
  total: number;
  currency: string;
  category: string;
  date: string;
  dateTo?: string;
  isPlanned?: boolean;
}

interface ExpenseManagerProps {
  entries: ExpenseEntry[];
  baseCurrency: string;
  convertToBaseCurrency: (amount: number, fromCurrency: string) => number;
  customCategories: Array<{ name: string }>;
  expenseFormState: {
    isDialogOpen: boolean;
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
  };
  expenseFormActions: {
    setIsDialogOpen: (value: boolean) => void;
    loadEntryForEdit: (entry: ExpenseEntry) => void;
    setName: (value: string) => void;
    setTotal: (value: string) => void;
    setCurrency: (value: string) => void;
    setCategory: (value: string) => void;
    setDate: (value: string) => void;
    setDateTo: (value: string) => void;
    setIsPlanned: (value: boolean) => void;
    setShowCustomCategory: (value: boolean) => void;
    setCustomCategoryInput: (value: string) => void;
  };
  onAddCustomCategory: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onDeleteEntry: (id: number) => void;
}

export function ExpenseManager({
  entries,
  baseCurrency,
  convertToBaseCurrency,
  customCategories,
  expenseFormState,
  expenseFormActions,
  onAddCustomCategory,
  onSubmit,
  onDeleteEntry,
}: ExpenseManagerProps) {
  return (
    <div className="space-y-5">
      <ExpenseForm
        isOpen={expenseFormState.isDialogOpen}
        onOpenChange={expenseFormActions.setIsDialogOpen}
        editingEntry={expenseFormState.editingEntry}
        formState={{
          name: expenseFormState.name,
          total: expenseFormState.total,
          currency: expenseFormState.currency,
          category: expenseFormState.category,
          date: expenseFormState.date,
          dateTo: expenseFormState.dateTo,
          isPlanned: expenseFormState.isPlanned,
          showCustomCategory: expenseFormState.showCustomCategory,
          customCategoryInput: expenseFormState.customCategoryInput,
        }}
        formActions={{
          onNameChange: expenseFormActions.setName,
          onTotalChange: expenseFormActions.setTotal,
          onCurrencyChange: expenseFormActions.setCurrency,
          onCategoryChange: expenseFormActions.setCategory,
          onDateChange: expenseFormActions.setDate,
          onDateToChange: expenseFormActions.setDateTo,
          onIsPlannedChange: expenseFormActions.setIsPlanned,
          onShowCustomCategoryChange: expenseFormActions.setShowCustomCategory,
          onCustomCategoryInputChange:
            expenseFormActions.setCustomCategoryInput,
        }}
        categories={
          EXPENSE_CATEGORIES as unknown as ReadonlyArray<{
            readonly value: string;
            readonly label: string;
            readonly icon?: unknown;
          }>
        }
        customCategories={customCategories.map((c) => c.name)}
        onAddCustomCategory={onAddCustomCategory}
        onSubmit={onSubmit}
        getDateLabel={getDateLabel}
      />

      <ExpenseList
        entries={entries}
        baseCurrency={baseCurrency}
        convertToBaseCurrency={convertToBaseCurrency}
        getCategoryIcon={getCategoryIcon}
        getCategoryLabel={getCategoryLabel}
        onEditEntry={expenseFormActions.loadEntryForEdit}
        onDeleteEntry={onDeleteEntry}
        onAddExpense={() => expenseFormActions.setIsDialogOpen(true)}
      />
    </div>
  );
}
