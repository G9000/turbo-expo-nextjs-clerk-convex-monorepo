"use client";

import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../packages/backend/convex/_generated/api";
import { useEffect } from "react";

export function UserProfile() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const convexUser = useQuery(api.users.getCurrentUser);
  const ensureUser = useMutation(api.users.ensureCurrentUser);

  // Ensure user exists in Convex database on mount
  useEffect(() => {
    if (clerkLoaded && clerkUser && convexUser === null) {
      ensureUser();
    }
  }, [clerkLoaded, clerkUser, convexUser, ensureUser]);

  if (!clerkLoaded) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (!clerkUser) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
      {clerkUser.imageUrl && (
        <img
          src={clerkUser.imageUrl}
          alt={clerkUser.fullName || "User"}
          className="w-10 h-10 rounded-full"
        />
      )}
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 dark:text-white">
          {clerkUser.fullName || clerkUser.emailAddresses[0]?.emailAddress}
        </span>
        {convexUser && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Synced to database ✓
          </span>
        )}
      </div>
    </div>
  );
}
