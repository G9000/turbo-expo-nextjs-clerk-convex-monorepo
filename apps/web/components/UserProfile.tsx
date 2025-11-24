"use client";

import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@repo/backend/convex";
import { useEffect } from "react";
import { Avatar } from "./Avatar";

export function UserProfile() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const convexUser = useQuery(api.users.getCurrentUser);
  const ensureUser = useMutation(api.users.ensureCurrentUser);

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

  const displayName =
    clerkUser.fullName || clerkUser.emailAddresses[0]?.emailAddress || "User";

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
      <Avatar src={clerkUser.imageUrl} alt={displayName} size="md" />
      <div className="flex flex-col min-w-0 flex-1">
        <span className="font-medium text-gray-900 dark:text-white truncate text-sm">
          {displayName}
        </span>
      </div>
    </div>
  );
}
