"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@repo/backend/convex";
import { Id } from "@repo/backend/convex/dataModel";
import { useCurrency } from "@/contexts/CurrencyContext";
import { createCurrencyConverter } from "@/lib/currency-conversion";
import { useBudgetCalculations } from "@/hooks/useBudgetCalculations";
import { useBudgetAlerts } from "@/hooks/useBudgetAlerts";
import { useActivityReminders } from "@/hooks/useActivityReminders";
import { useExpenseForm } from "@/hooks/useExpenseForm";
import { getCategoryLabel } from "@/lib/categories";
import { TripHeader } from "@/components/TripHeader";
import { BudgetOverview } from "@/components/budget/BudgetOverview";
import { ExpenseManager } from "@/components/ExpenseManager";
import { TripSettingsDialog } from "@/components/TripSettingsDialog";
import { ItineraryBoard } from "@/components/ItineraryBoard";
import { toast } from "sonner";

export default function TripPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.tripId as Id<"trips">;

  const {
    exchangeRates,
    isLoading: isRatesLoading,
    lastUpdated,
    refreshRates,
  } = useCurrency();
  const [isTripSettingsOpen, setIsTripSettingsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("budget");

  // Convex queries
  const trip = useQuery(api.trips.getTrip, { tripId });
  const expenses = useQuery(api.trips.getTripExpenses, { tripId }) || [];
  const contributors =
    useQuery(api.trips.getTripContributors, { tripId }) || [];
  const customCategories =
    useQuery(api.trips.getTripCustomCategories, { tripId }) || [];
  const activities = useQuery(api.trips.getTripActivities, { tripId }) || [];

  // Convex mutations
  const updateTripMutation = useMutation(api.mutations.updateTrip);
  const addExpenseMutation = useMutation(api.mutations.addExpense);
  const updateExpenseMutation = useMutation(api.mutations.updateExpense);
  const deleteExpenseMutation = useMutation(api.mutations.deleteExpense);
  const addContributorMutation = useMutation(
    api.mutations.addBudgetContributor,
  );
  const deleteContributorMutation = useMutation(
    api.mutations.deleteBudgetContributor,
  );
  const addCustomCategoryMutation = useMutation(
    api.mutations.addCustomCategory,
  );
  const addActivityMutation = useMutation(api.mutations.addActivity);
  const updateActivityMutation = useMutation(api.mutations.updateActivity);
  const deleteActivityMutation = useMutation(api.mutations.deleteActivity);

  const baseCurrency = trip?.baseCurrency || "USD";
  const expenseForm = useExpenseForm(baseCurrency);
  const convertToBaseCurrency = createCurrencyConverter(
    baseCurrency,
    exchangeRates,
  );

  // Transform expenses to match the interface expected by hooks
  const transformedEntries = expenses.map((exp) => ({
    id: exp._id as unknown as number,
    name: exp.name,
    total: exp.total,
    currency: exp.currency,
    category: exp.category,
    date: exp.date,
    dateTo: exp.dateTo,
    isPlanned: exp.isPlanned,
  }));

  const budgetCalcs = useBudgetCalculations(
    transformedEntries,
    trip?.allocatedBudget?.toString() || "0",
    convertToBaseCurrency,
  );

  // Alert systems
  useBudgetAlerts(
    budgetCalcs.totalSpent,
    budgetCalcs.totalPlanned,
    trip?.allocatedBudget?.toString() || "0",
    baseCurrency,
  );

  useActivityReminders(
    activities.map((act) => ({
      id: act._id as unknown as number,
      title: act.title,
      description: act.description,
      time: act.time,
      dayIndex: act.dayIndex,
      notes: act.notes,
      completed: act.completed,
      remindMe: act.remindMe,
      category: act.category,
    })),
    trip?.startDate || "",
    trip?.endDate || "",
  );

  // Refresh exchange rates when base currency changes
  useEffect(() => {
    if (baseCurrency) {
      refreshRates(baseCurrency);
    }
  }, [baseCurrency, refreshRates]);

  // Redirect if trip not found or unauthorized
  useEffect(() => {
    if (trip === null) {
      toast.error("Trip not found or you don't have access");
      router.push("/");
    }
  }, [trip, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!expenseForm.name || !expenseForm.total) return;

    try {
      if (expenseForm.editingEntry) {
        // Update existing expense
        await updateExpenseMutation({
          expenseId: expenseForm.editingEntry as unknown as Id<"expenses">,
          name: expenseForm.name,
          total: parseFloat(expenseForm.total),
          currency: expenseForm.currency,
          category: expenseForm.category,
          date: expenseForm.date,
          dateTo: expenseForm.dateTo,
          isPlanned: expenseForm.isPlanned,
        });
        toast.success("Expense updated!");
      } else {
        // Add new expense
        await addExpenseMutation({
          tripId,
          name: expenseForm.name,
          total: parseFloat(expenseForm.total),
          currency: expenseForm.currency,
          category: expenseForm.category,
          date: expenseForm.date,
          dateTo: expenseForm.dateTo,
          isPlanned: expenseForm.isPlanned,
        });
        toast.success("Expense added!");
      }

      expenseForm.resetForm();
    } catch (error) {
      console.error("Error saving expense:", error);
      toast.error("Failed to save expense");
    }
  };

  const handleAddCustomCategory = async () => {
    if (expenseForm.customCategoryInput.trim()) {
      try {
        const newCategory = expenseForm.customCategoryInput
          .trim()
          .toLowerCase();
        await addCustomCategoryMutation({
          tripId,
          name: newCategory,
        });
        expenseForm.setCategory(newCategory);
        expenseForm.setCustomCategoryInput("");
        expenseForm.setShowCustomCategory(false);
        toast.success("Category added!");
      } catch (error) {
        console.error("Error adding category:", error);
        toast.error("Failed to add category");
      }
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      await deleteExpenseMutation({
        expenseId: id as unknown as Id<"expenses">,
      });
      toast.success("Expense deleted!");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const handleAddContributor = async (contributor: {
    name: string;
    amount: string;
  }) => {
    try {
      await addContributorMutation({
        tripId,
        name: contributor.name,
        amount: parseFloat(contributor.amount),
      });
      toast.success("Contributor added!");
    } catch (error) {
      console.error("Error adding contributor:", error);
      toast.error("Failed to add contributor");
    }
  };

  const handleDeleteContributor = async (id: number) => {
    try {
      await deleteContributorMutation({
        contributorId: id as unknown as Id<"budgetContributors">,
      });
      toast.success("Contributor removed!");
    } catch (error) {
      console.error("Error deleting contributor:", error);
      toast.error("Failed to remove contributor");
    }
  };

  const handleUpdateTrip = async (updates: {
    title?: string;
    allocatedBudget?: string;
    baseCurrency?: string;
  }) => {
    try {
      await updateTripMutation({
        tripId,
        title: updates.title,
        allocatedBudget: updates.allocatedBudget
          ? parseFloat(updates.allocatedBudget)
          : undefined,
        baseCurrency: updates.baseCurrency,
      });
    } catch (error) {
      console.error("Error updating trip:", error);
      toast.error("Failed to update trip");
    }
  };

  const handleSetTripDates = async (startDate: string, endDate: string) => {
    try {
      await updateTripMutation({
        tripId,
        startDate,
        endDate,
      });
      toast.success("Trip dates updated!");
    } catch (error) {
      console.error("Error updating trip dates:", error);
      toast.error("Failed to update trip dates");
    }
  };

  const handleAddActivity = async (activity: any) => {
    try {
      await addActivityMutation({
        tripId,
        title: activity.title,
        description: activity.description,
        time: activity.time,
        dayIndex: activity.dayIndex,
        notes: activity.notes,
        category: activity.category,
        remindMe: activity.remindMe || false,
      });
      toast.success("Activity added!");
    } catch (error) {
      console.error("Error adding activity:", error);
      toast.error("Failed to add activity");
    }
  };

  const handleUpdateActivity = async (id: number, activity: any) => {
    try {
      await updateActivityMutation({
        activityId: id as unknown as Id<"activities">,
        title: activity.title,
        description: activity.description,
        time: activity.time,
        dayIndex: activity.dayIndex,
        notes: activity.notes,
        category: activity.category,
        completed: activity.completed,
        remindMe: activity.remindMe,
      });
      toast.success("Activity updated!");
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("Failed to update activity");
    }
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      await deleteActivityMutation({
        activityId: id as unknown as Id<"activities">,
      });
      toast.success("Activity deleted!");
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error("Failed to delete activity");
    }
  };

  // Loading state
  if (trip === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trip...</p>
        </div>
      </div>
    );
  }

  // Trip not found
  if (trip === null) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen container mx-auto py-10 grid gap-8">
      <TripHeader
        tripTitle={trip.title}
        baseCurrency={baseCurrency}
        isLoading={isRatesLoading}
        currentTab={currentTab}
        tripStartDate={trip.startDate || ""}
        tripEndDate={trip.endDate || ""}
        tripId={trip._id}
        onTabChange={setCurrentTab}
        onRefreshRates={() => refreshRates(baseCurrency)}
        onBaseCurrencyChange={(currency) =>
          handleUpdateTrip({ baseCurrency: currency })
        }
        onEditTrip={() => setIsTripSettingsOpen(true)}
        onExportData={() => {
          const data = {
            trip,
            expenses,
            contributors,
            customCategories,
            activities,
            totalSpent: budgetCalcs.totalSpent,
            totalPlanned: budgetCalcs.totalPlanned,
            actualRemaining: budgetCalcs.actualRemaining,
            projectedRemaining: budgetCalcs.projectedRemaining,
            exchangeRates,
            lastUpdated,
          };
          console.log("Trip Data:", data);
          alert("Data logged to console! Check browser DevTools.");
        }}
      />

      <TripSettingsDialog
        isOpen={isTripSettingsOpen}
        onOpenChange={setIsTripSettingsOpen}
        tripTitle={trip.title}
        allocatedBudget={trip.allocatedBudget?.toString() || ""}
        baseCurrency={baseCurrency}
        budgetContributors={contributors.map((c) => ({
          id: c._id as unknown as number,
          name: c.name,
          amount: c.amount.toString(),
        }))}
        onTripTitleChange={(title) => handleUpdateTrip({ title })}
        onAllocatedBudgetChange={(budget) =>
          handleUpdateTrip({ allocatedBudget: budget })
        }
        onBaseCurrencyChange={(currency) =>
          handleUpdateTrip({ baseCurrency: currency })
        }
        onAddContributor={handleAddContributor}
        onDeleteContributor={handleDeleteContributor}
        onSave={() => setIsTripSettingsOpen(false)}
      />

      {currentTab === "budget" && (
        <>
          <BudgetOverview
            baseCurrency={baseCurrency}
            allocatedBudget={trip.allocatedBudget?.toString() || "0"}
            totalSpent={budgetCalcs.totalSpent}
            totalPlanned={budgetCalcs.totalPlanned}
            actualRemaining={budgetCalcs.actualRemaining}
            projectedRemaining={budgetCalcs.projectedRemaining}
            percentageSpent={budgetCalcs.percentageSpent}
            lastUpdated={lastUpdated}
            budgetContributors={contributors.map((c) => ({
              id: c._id as unknown as number,
              name: c.name,
              amount: c.amount.toString(),
            }))}
            entries={transformedEntries}
            convertToBaseCurrency={convertToBaseCurrency}
            getCategoryLabel={getCategoryLabel}
            onSetBudget={(amount) =>
              handleUpdateTrip({ allocatedBudget: amount.toString() })
            }
          />

          {/* {transformedEntries.length > 0 && (
            <ExpenseChart
              baseCurrency={baseCurrency}
              totalSpent={budgetCalcs.totalSpent}
              totalPlanned={budgetCalcs.totalPlanned}
              actualRemaining={budgetCalcs.actualRemaining}
              entries={transformedEntries}
              convertToBaseCurrency={convertToBaseCurrency}
              getCategoryLabel={getCategoryLabel}
            />
          )} */}

          <ExpenseManager
            entries={transformedEntries}
            baseCurrency={baseCurrency}
            convertToBaseCurrency={convertToBaseCurrency}
            customCategories={customCategories}
            expenseFormState={{
              isDialogOpen: expenseForm.isDialogOpen,
              editingEntry: expenseForm.editingEntry,
              name: expenseForm.name,
              total: expenseForm.total,
              currency: expenseForm.currency,
              category: expenseForm.category,
              date: expenseForm.date,
              dateTo: expenseForm.dateTo,
              isPlanned: expenseForm.isPlanned,
              showCustomCategory: expenseForm.showCustomCategory,
              customCategoryInput: expenseForm.customCategoryInput,
            }}
            expenseFormActions={{
              setIsDialogOpen: expenseForm.setIsDialogOpen,
              loadEntryForEdit: expenseForm.loadEntryForEdit,
              setName: expenseForm.setName,
              setTotal: expenseForm.setTotal,
              setCurrency: expenseForm.setCurrency,
              setCategory: expenseForm.setCategory,
              setDate: expenseForm.setDate,
              setDateTo: expenseForm.setDateTo,
              setIsPlanned: expenseForm.setIsPlanned,
              setShowCustomCategory: expenseForm.setShowCustomCategory,
              setCustomCategoryInput: expenseForm.setCustomCategoryInput,
            }}
            onAddCustomCategory={handleAddCustomCategory}
            onSubmit={handleSubmit}
            onDeleteEntry={handleDeleteExpense}
          />
        </>
      )}

      {currentTab === "itinerary" && (
        <ItineraryBoard
          tripStartDate={trip.startDate || ""}
          tripEndDate={trip.endDate || ""}
          activities={activities.map((act) => ({
            id: act._id as unknown as number,
            title: act.title,
            description: act.description,
            time: act.time,
            dayIndex: act.dayIndex,
            notes: act.notes,
            completed: act.completed,
            remindMe: act.remindMe,
            category: act.category,
          }))}
          onSetTripDates={handleSetTripDates}
          onAddActivity={handleAddActivity}
          onUpdateActivity={handleUpdateActivity}
          onDeleteActivity={handleDeleteActivity}
        />
      )}
    </div>
  );
}
