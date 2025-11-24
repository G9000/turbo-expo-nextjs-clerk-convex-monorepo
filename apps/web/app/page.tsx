"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@repo/backend/convex";
import { Id } from "@repo/backend/convex/dataModel";
import { TripSetupForm } from "@/components/TripSetupForm";
import { TripsDashboard } from "@/components/TripsDashboard";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [tripTitle, setTripTitle] = useState("");
  const [allocatedBudget, setAllocatedBudget] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("USD");

  // Convex queries
  const trips = useQuery(api.trips.getUserTrips);

  // Convex mutations
  const createTripMutation = useMutation(api.mutations.createTrip);
  const deleteTripMutation = useMutation(api.mutations.deleteTrip);

  const handleTripStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tripTitle && baseCurrency) {
      try {
        // Call Convex mutation to create trip in database
        const tripId = await createTripMutation({
          title: tripTitle,
          baseCurrency: baseCurrency,
          allocatedBudget: parseFloat(allocatedBudget) || undefined,
        });

        console.log("Trip created with ID:", tripId);
        toast.success("Trip created successfully!");

        // Reset form
        setTripTitle("");
        setAllocatedBudget("");
        setBaseCurrency("USD");
        setIsCreatingTrip(false);

        // Redirect to the trip page
        router.push(`/trips/${tripId}`);
      } catch (error) {
        console.error("Error creating trip:", error);
        toast.error("Failed to create trip. Please try again.");
      }
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    try {
      await deleteTripMutation({ tripId: tripId as Id<"trips"> });
      toast.success("Trip deleted successfully!");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip. Please try again.");
    }
  };

  // Loading state
  if (trips === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trips...</p>
        </div>
      </div>
    );
  }

  // Show create trip form instead of dashboard
  if (isCreatingTrip) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <TripSetupForm
          tripTitle={tripTitle}
          allocatedBudget={allocatedBudget}
          baseCurrency={baseCurrency}
          onTripTitleChange={setTripTitle}
          onAllocatedBudgetChange={setAllocatedBudget}
          onBaseCurrencyChange={setBaseCurrency}
          onSubmit={handleTripStart}
          onCancel={() => {
            setTripTitle("");
            setAllocatedBudget("");
            setBaseCurrency("USD");
            setIsCreatingTrip(false);
          }}
        />
      </div>
    );
  }

  return (
    <TripsDashboard
      trips={trips}
      onCreateTrip={() => setIsCreatingTrip(true)}
      onDeleteTrip={handleDeleteTrip}
    />
  );
}
