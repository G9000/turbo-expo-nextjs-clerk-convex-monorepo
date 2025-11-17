import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BudgetEntry {
  id: number;
  name: string;
  total: number;
  currency: string;
  category: string;
  date: string; // ISO date string (YYYY-MM-DD)
  dateTo?: string; // Optional end date for hotels (check-out date)
  isPlanned?: boolean; // True for planned/budgeted expenses (not yet spent)
}

interface BudgetContributor {
  id: number;
  name: string;
  amount: string;
}

interface Activity {
  id: number;
  title: string;
  description?: string;
  time?: string;
  dayIndex: number;
  notes?: string;
  images?: string[];
  completed?: boolean;
  remindMe?: boolean; // Enable reminders for this activity
  category?: string; // Category: transport, food, activities, etc.
}

interface TripState {
  // Trip Setup
  tripTitle: string;
  allocatedBudget: string;
  baseCurrency: string;
  tripStarted: boolean;
  budgetContributors: BudgetContributor[];

  // Entries
  entries: BudgetEntry[];
  customCategories: string[];

  // Itinerary
  tripStartDate: string; // ISO date string
  tripEndDate: string; // ISO date string
  activities: Activity[];

  // Actions
  setTripTitle: (title: string) => void;
  setAllocatedBudget: (budget: string) => void;
  setBaseCurrency: (currency: string) => void;
  startTrip: () => void;
  addEntry: (entry: BudgetEntry) => void;
  updateEntry: (id: number, entry: BudgetEntry) => void;
  deleteEntry: (id: number) => void;
  addCustomCategory: (category: string) => void;
  addBudgetContributor: (contributor: BudgetContributor) => void;
  updateBudgetContributor: (id: number, contributor: BudgetContributor) => void;
  deleteBudgetContributor: (id: number) => void;
  setTripDates: (startDate: string, endDate: string) => void;
  addActivity: (activity: Activity) => void;
  updateActivity: (id: number, activity: Activity) => void;
  deleteActivity: (id: number) => void;
  resetTrip: () => void;
}

export type { BudgetContributor, Activity };

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      // Initial state
      tripTitle: "",
      allocatedBudget: "",
      baseCurrency: "USD",
      tripStarted: false,
      entries: [],
      customCategories: [],
      budgetContributors: [],
      tripStartDate: "",
      tripEndDate: "",
      activities: [],

      // Actions
      setTripTitle: (title) => set({ tripTitle: title }),
      setAllocatedBudget: (budget) => set({ allocatedBudget: budget }),
      setBaseCurrency: (currency) => set({ baseCurrency: currency }),
      startTrip: () => set({ tripStarted: true }),

      addEntry: (entry) =>
        set((state) => ({ entries: [...state.entries, entry] })),

      updateEntry: (id, entry) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? entry : e)),
        })),

      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),

      addCustomCategory: (category) =>
        set((state) => {
          if (!state.customCategories.includes(category)) {
            return { customCategories: [...state.customCategories, category] };
          }
          return state;
        }),

      addBudgetContributor: (contributor) =>
        set((state) => ({
          budgetContributors: [...state.budgetContributors, contributor],
        })),

      updateBudgetContributor: (id, contributor) =>
        set((state) => ({
          budgetContributors: state.budgetContributors.map((c) =>
            c.id === id ? contributor : c
          ),
        })),

      deleteBudgetContributor: (id) =>
        set((state) => ({
          budgetContributors: state.budgetContributors.filter(
            (c) => c.id !== id
          ),
        })),

      setTripDates: (startDate, endDate) =>
        set({ tripStartDate: startDate, tripEndDate: endDate }),

      addActivity: (activity) =>
        set((state) => ({ activities: [...state.activities, activity] })),

      updateActivity: (id, activity) =>
        set((state) => ({
          activities: state.activities.map((a) => (a.id === id ? activity : a)),
        })),

      deleteActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((a) => a.id !== id),
        })),

      resetTrip: () =>
        set({
          tripTitle: "",
          allocatedBudget: "",
          baseCurrency: "USD",
          tripStarted: false,
          entries: [],
          customCategories: [],
          budgetContributors: [],
          tripStartDate: "",
          tripEndDate: "",
          activities: [],
        }),
    }),
    {
      name: "trip-budget-storage",
    }
  )
);
