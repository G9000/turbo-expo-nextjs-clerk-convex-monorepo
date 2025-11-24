import { useQuery, useMutation } from "convex/react";
import { api } from "../../../packages/backend/convex/_generated/api";
import { Id } from "../../../packages/backend/convex/_generated/dataModel";

/**
 * Hook to get and manage the current trip
 * This assumes the user has one active trip at a time (most recent)
 */
export function useCurrentTrip() {
  const currentTrip = useQuery(api.trips.getCurrentTrip);
  const createTrip = useMutation(api.mutations.createTrip);
  const updateTrip = useMutation(api.mutations.updateTrip);

  return {
    trip: currentTrip,
    isLoading: currentTrip === undefined,
    createTrip,
    updateTrip,
  };
}

/**
 * Hook to get and manage expenses for a trip
 */
export function useTripExpenses(tripId: Id<"trips"> | undefined) {
  const expenses = useQuery(
    api.trips.getTripExpenses,
    tripId ? { tripId } : "skip",
  );
  const addExpense = useMutation(api.mutations.addExpense);
  const updateExpense = useMutation(api.mutations.updateExpense);
  const deleteExpense = useMutation(api.mutations.deleteExpense);

  return {
    expenses: expenses ?? [],
    isLoading: expenses === undefined,
    addExpense,
    updateExpense,
    deleteExpense,
  };
}

/**
 * Hook to get and manage activities for a trip
 */
export function useTripActivities(tripId: Id<"trips"> | undefined) {
  const activities = useQuery(
    api.trips.getTripActivities,
    tripId ? { tripId } : "skip",
  );
  const addActivity = useMutation(api.mutations.addActivity);
  const updateActivity = useMutation(api.mutations.updateActivity);
  const deleteActivity = useMutation(api.mutations.deleteActivity);

  return {
    activities: activities ?? [],
    isLoading: activities === undefined,
    addActivity,
    updateActivity,
    deleteActivity,
  };
}

/**
 * Hook to get and manage budget contributors for a trip
 */
export function useTripContributors(tripId: Id<"trips"> | undefined) {
  const contributors = useQuery(
    api.trips.getTripContributors,
    tripId ? { tripId } : "skip",
  );
  const addContributor = useMutation(api.mutations.addBudgetContributor);
  const deleteContributor = useMutation(api.mutations.deleteBudgetContributor);

  return {
    contributors: contributors ?? [],
    isLoading: contributors === undefined,
    addContributor,
    deleteContributor,
  };
}

/**
 * Hook to get and manage participants for a trip
 */
export function useTripParticipants(tripId: Id<"trips"> | undefined) {
  const participants = useQuery(
    api.trips.getTripParticipants,
    tripId ? { tripId } : "skip",
  );

  return {
    participants: participants ?? [],
    isLoading: participants === undefined,
  };
}

/**
 * Hook to get and manage custom categories for a trip
 */
export function useTripCustomCategories(tripId: Id<"trips"> | undefined) {
  const categories = useQuery(
    api.trips.getTripCustomCategories,
    tripId ? { tripId } : "skip",
  );
  const addCategory = useMutation(api.mutations.addCustomCategory);

  return {
    categories: categories ?? [],
    isLoading: categories === undefined,
    addCategory,
  };
}
