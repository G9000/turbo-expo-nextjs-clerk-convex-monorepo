"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Wallet, Pencil, Trash2 } from "lucide-react";
import { getCurrencySymbol } from "@/lib/currency";

interface ExpenseListProps {
  entries: Array<{
    id: number;
    name: string;
    total: number;
    currency: string;
    category: string;
    date: string;
    dateTo?: string;
    isPlanned?: boolean;
  }>;
  baseCurrency: string;
  convertToBaseCurrency: (amount: number, fromCurrency: string) => number;
  getCategoryIcon: (category: string) => React.ReactElement;
  getCategoryLabel: (category: string) => string;
  onEditEntry: (entry: ExpenseListProps["entries"][0]) => void;
  onDeleteEntry: (id: number) => void;
}

export function ExpenseList({
  entries,
  baseCurrency,
  convertToBaseCurrency,
  getCategoryIcon,
  getCategoryLabel,
  onEditEntry,
  onDeleteEntry,
}: ExpenseListProps) {
  const actualEntries = entries.filter((e) => !e.isPlanned);
  const plannedEntries = entries.filter((e) => e.isPlanned);

  const renderEntries = (filteredEntries: typeof entries) => {
    if (filteredEntries.length === 0) {
      return null;
    }

    const categories = Array.from(
      new Set(filteredEntries.map((e) => e.category))
    );

    return (
      <Accordion
        type="multiple"
        defaultValue={categories}
        className="space-y-2"
      >
        {categories.map((category) => {
          const categoryEntries = filteredEntries.filter(
            (e) => e.category === category
          );
          const categoryTotal = categoryEntries.reduce((sum, entry) => {
            return sum + convertToBaseCurrency(entry.total, entry.currency);
          }, 0);

          return (
            <AccordionItem
              key={category}
              value={category}
              className="border bg-card"
            >
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10">
                      {getCategoryIcon(category)}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-base">
                        {getCategoryLabel(category)}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {categoryEntries.length}{" "}
                        {categoryEntries.length === 1
                          ? "transaction"
                          : "transactions"}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-bold ${
                      categoryEntries[0]?.isPlanned
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {!categoryEntries[0]?.isPlanned && "-"}
                    {getCurrencySymbol(baseCurrency)}
                    {categoryTotal.toFixed(2)}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2 pt-2">
                  {categoryEntries.map((entry) => (
                    <Card
                      key={entry.id}
                      className={`border-l-4 ${
                        entry.isPlanned
                          ? "border-l-orange-500 bg-orange-50/50 dark:bg-orange-950/20"
                          : "border-l-red-500"
                      }`}
                    >
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium truncate">
                                  {entry.name}
                                </h3>
                                {entry.isPlanned && (
                                  <span className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium shrink-0">
                                    PLANNED
                                  </span>
                                )}
                              </div>
                              {entry.date && (
                                <p className="text-sm text-muted-foreground">
                                  {(entry.category === "hotel" ||
                                    entry.category === "flight") &&
                                  entry.dateTo ? (
                                    <>
                                      {new Date(entry.date).toLocaleDateString(
                                        "en-US",
                                        {
                                          month: "short",
                                          day: "numeric",
                                        }
                                      )}
                                      {" - "}
                                      {new Date(
                                        entry.dateTo
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </>
                                  ) : (
                                    new Date(entry.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      }
                                    )
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-2">
                            <div>
                              <p
                                className={`font-semibold whitespace-nowrap ${
                                  entry.isPlanned
                                    ? "text-orange-600 dark:text-orange-400"
                                    : "text-red-600 dark:text-red-400"
                                }`}
                              >
                                {!entry.isPlanned && "-"}
                                {getCurrencySymbol(entry.currency)}
                                {entry.total.toFixed(2)}
                              </p>
                              {entry.currency !== baseCurrency && (
                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                  ≈ {getCurrencySymbol(baseCurrency)}
                                  {convertToBaseCurrency(
                                    entry.total,
                                    entry.currency
                                  ).toFixed(2)}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEditEntry(entry)}
                              className="flex-shrink-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteEntry(entry.id)}
                              className="text-destructive hover:text-destructive flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
        <CardDescription>
          {actualEntries.length} transactions • {plannedEntries.length} planned
        </CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No entries yet. Add your first expense above!</p>
          </div>
        ) : (
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transactions">
                Transactions ({actualEntries.length})
              </TabsTrigger>
              <TabsTrigger value="planned">
                Planned ({plannedEntries.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="mt-4">
              {actualEntries.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No actual transactions yet.</p>
                </div>
              ) : (
                <div className="max-h-[800px] overflow-y-auto pr-2">
                  {renderEntries(actualEntries)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="planned" className="mt-4">
              {plannedEntries.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No planned expenses yet.</p>
                </div>
              ) : (
                <div className="max-h-[800px] overflow-y-auto pr-2">
                  {renderEntries(plannedEntries)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
