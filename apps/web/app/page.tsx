"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@repo/backend/convex";
import { TripSetupForm } from "@/components/TripSetupForm";
import { UserProfile } from "@/components/UserProfile";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [tripTitle, setTripTitle] = useState("");
  const [allocatedBudget, setAllocatedBudget] = useState("");
  const [baseCurrency, setBaseCurrency] = useState("USD");

  // Convex mutations
  const createTripMutation = useMutation(api.mutations.createTrip);

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

        // Redirect to the trip page
        router.push(`/trips/${tripId}`);
      } catch (error) {
        console.error("Error creating trip:", error);
        toast.error("Failed to create trip. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <UserProfile />
      <TripSetupForm
        tripTitle={tripTitle}
        allocatedBudget={allocatedBudget}
        baseCurrency={baseCurrency}
        onTripTitleChange={setTripTitle}
        onAllocatedBudgetChange={setAllocatedBudget}
        onBaseCurrencyChange={setBaseCurrency}
        onSubmit={handleTripStart}
      />
    </div>
  );
}
