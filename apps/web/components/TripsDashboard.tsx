"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plane,
  Plus,
  Calendar,
  DollarSign,
  MapPin,
  Trash2,
} from "lucide-react";
import { getCurrencySymbol } from "@/lib/currency";

interface Trip {
  _id: string;
  title: string;
  baseCurrency: string;
  allocatedBudget?: number;
  startDate?: string;
  endDate?: string;
  createdAt: number;
}

interface TripsDashboardProps {
  trips: Trip[];
  onCreateTrip: () => void;
  onDeleteTrip: (tripId: string) => void;
}

export function TripsDashboard({
  trips,
  onCreateTrip,
  onDeleteTrip,
}: TripsDashboardProps) {
  const router = useRouter();
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDateRange = (startDate?: string, endDate?: string) => {
    if (!startDate && !endDate) return "Dates not set";
    if (!endDate) return `From ${formatDate(startDate)}`;
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  if (trips.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-2xl space-y-8 text-center">
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md">
            <Image
              src="/images/dashboard-empty.jpg"
              alt="Start your adventure"
              fill
              className="object-cover"
              priority
            />
          </div>

          <h2 className="text-5xl font-bold">Ready for Your Next Adventure?</h2>

          <Button onClick={onCreateTrip} size="lg" className="w-full max-w-xs">
            Create Your First Trip
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold">
              <Plane className="size-8 text-primary" />
              My Trips
            </h1>
            <p className="mt-1 text-muted-foreground">
              Manage and track your travel budgets
            </p>
          </div>
          <Button onClick={onCreateTrip} size="lg">
            <Plus className="mr-2 size-5" />
            Create Trip
          </Button>
        </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Card
              key={trip._id}
              className="group relative transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => router.push(`/trips/${trip._id}`)}
                  >
                    <CardTitle className="line-clamp-2 text-xl transition-colors group-hover:text-primary">
                      {trip.title}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingTripId(trip._id);
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                    <div className="rounded-lg bg-primary/10 p-2">
                      <MapPin className="size-5 text-primary" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent
                className="cursor-pointer space-y-3"
                onClick={() => router.push(`/trips/${trip._id}`)}
              >
                {/* Budget */}
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Budget:</span>
                  <span className="font-semibold">
                    {trip.allocatedBudget
                      ? `${getCurrencySymbol(trip.baseCurrency)}${trip.allocatedBudget.toLocaleString()}`
                      : "Not set"}
                  </span>
                </div>

                {/* Dates */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span className="truncate text-muted-foreground">
                    {getDateRange(trip.startDate, trip.endDate)}
                  </span>
                </div>

                {/* Created date */}
                <div className="border-t pt-2">
                  <span className="text-xs text-muted-foreground">
                    Created {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deletingTripId !== null}
          onOpenChange={(open) => !open && setDeletingTripId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Trip</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this trip? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeletingTripId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deletingTripId) {
                    onDeleteTrip(deletingTripId);
                    setDeletingTripId(null);
                  }
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
