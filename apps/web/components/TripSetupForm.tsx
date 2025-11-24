"use client";

import { useState, useMemo, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@repo/backend/convex";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plane, UserPlus, X, Search, Loader2, Users } from "lucide-react";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TripSetupFormProps {
  tripTitle: string;
  allocatedBudget: string;
  baseCurrency: string;
  onTripTitleChange: (value: string) => void;
  onAllocatedBudgetChange: (value: string) => void;
  onBaseCurrencyChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
}

export function TripSetupForm({
  tripTitle,
  allocatedBudget,
  baseCurrency,
  onTripTitleChange,
  onAllocatedBudgetChange,
  onBaseCurrencyChange,
  onSubmit,
  onCancel,
}: TripSetupFormProps) {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<
    Array<{ id: string; name: string; email: string; imageUrl?: string }>
  >([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Fetch friends from Convex
  const friends = useQuery(api.friends.getFriends) ?? [];

  // Search for users to add as friends
  const searchResults =
    useQuery(
      api.friends.searchUsers,
      searchQuery.length >= 2 ? { searchQuery } : "skip",
    ) ?? [];

  // Combine friends and search results, filter out already invited
  const availableUsers = searchQuery.length >= 2 ? searchResults : friends;

  const handleAddInvite = useCallback(
    (friend: (typeof friends)[0] | (typeof searchResults)[0]) => {
      setInvitedUsers((prev) => [...prev, friend]);
      setSearchQuery("");
    },
    [],
  );

  const handleRemoveInvite = useCallback((userId: string) => {
    setInvitedUsers((prev) => prev.filter((u) => u.id !== userId));
  }, []);

  // Memoize filtered friends to avoid recalculation
  const filteredFriends = useMemo(
    () =>
      availableUsers.filter(
        (user) => !invitedUsers.some((invited) => invited.id === user.id),
      ),
    [availableUsers, invitedUsers],
  );

  const isLoading =
    friends === undefined ||
    (searchQuery.length >= 2 && searchResults === undefined);

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8 space-y-4 text-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Create Your Trip
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Start planning and tracking your adventure
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        {/* Trip Members Section */}
        <div className="space-y-4 rounded-2xl border bg-card p-6">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            <Label className="text-base font-semibold">Trip Members</Label>
            <span className="text-sm text-muted-foreground">
              ({invitedUsers.length + 1})
            </span>
          </div>

          {/* Avatar Stack */}
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {/* Current User Avatar */}
              <div
                className="ring-2 ring-background rounded-full"
                title={`${user?.fullName || "You"} (Owner)`}
              >
                <Avatar
                  src={user?.imageUrl}
                  alt={user?.fullName || "User"}
                  size="md"
                  fallback={user?.firstName?.[0] || "U"}
                />
              </div>

              {/* Invited Users Avatars - Stacked */}
              {invitedUsers.slice(0, 3).map((invitedUser, index) => (
                <div
                  key={invitedUser.id}
                  className="h-10 w-10 rounded-full bg-muted flex items-center justify-center ring-2 ring-background -ml-3 hover:z-10 transition-all cursor-pointer hover:ring-destructive"
                  style={{ zIndex: invitedUsers.length - index }}
                  onClick={() => handleRemoveInvite(invitedUser.id)}
                  title={`${invitedUser.name} - Click to remove`}
                >
                  <span className="text-sm font-medium">
                    {invitedUser.name[0].toUpperCase()}
                  </span>
                </div>
              ))}

              {/* Show count if more than 3 */}
              {invitedUsers.length > 3 && (
                <div
                  className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-background -ml-3 text-xs font-medium text-primary"
                  style={{ zIndex: 0 }}
                  title={`${invitedUsers.length - 3} more collaborators`}
                >
                  +{invitedUsers.length - 3}
                </div>
              )}

              {/* Add Button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-10 w-10 rounded-full p-0 -ml-3 hover:z-20 transition-all"
                onClick={() => setIsInviteModalOpen(true)}
                title="Invite collaborator"
              >
                <UserPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Invited Users List - Expandable */}
          {invitedUsers.length > 0 && (
            <div className="pt-1">
              <details className="group">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors list-none flex items-center gap-1">
                  <span className="group-open:rotate-90 transition-transform">
                    ▶
                  </span>
                  {invitedUsers.length} collaborator
                  {invitedUsers.length !== 1 ? "s" : ""} invited
                </summary>
                <div className="space-y-1.5 mt-2">
                  {invitedUsers.map((invitedUser) => (
                    <div
                      key={invitedUser.id}
                      className="flex items-center justify-between p-2 bg-muted/30 rounded-md group/item hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {invitedUser.name[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm">{invitedUser.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInvite(invitedUser.id)}
                        className="h-7 w-7 p-0 opacity-0 group-hover/item:opacity-100 transition-opacity"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Trip Details */}
        <div className="space-y-6 rounded-2xl border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="tripTitle" className="text-base font-semibold">
              Trip Name
            </Label>
            <Input
              id="tripTitle"
              type="text"
              value={tripTitle}
              onChange={(e) => onTripTitleChange(e.target.value)}
              placeholder="e.g., Tokyo Adventure 2025"
              className="h-12 text-base"
              required
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="baseCurrency" className="text-base font-semibold">
                Base Currency
              </Label>
              <Select value={baseCurrency} onValueChange={onBaseCurrencyChange}>
                <SelectTrigger id="baseCurrency" className="h-12 text-base">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      <span className="flex items-center gap-2">
                        <span className={`fi fi-${curr.countryCode}`} />
                        <span>
                          {curr.symbol} {curr.code} - {curr.name}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="allocatedBudget"
                className="text-base font-semibold"
              >
                Budget{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  (Optional)
                </span>
              </Label>
              <Input
                id="allocatedBudget"
                type="number"
                value={allocatedBudget}
                onChange={(e) => onAllocatedBudgetChange(e.target.value)}
                placeholder="0.00"
                className="h-12 text-base"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              className="h-12 flex-1 text-base"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" className="h-12 flex-1 text-base">
            Start Tracking
          </Button>
        </div>
      </form>

      {/* Invite Modal */}
      <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Collaborators</DialogTitle>
            <DialogDescription>
              Add friends to collaborate on your trip
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Search Friends */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Search className="size-4" />
                {searchQuery.length >= 2
                  ? "Search Results"
                  : "Search Friends by Name or Email"}
              </Label>
              <div className="relative">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type at least 2 characters..."
                  className="pr-10"
                  autoFocus
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Friends List */}
            <div className="space-y-2">
              {filteredFriends.length > 0 ? (
                <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-muted/30 rounded-md">
                  {filteredFriends.map((friend) => (
                    <button
                      key={friend.id}
                      type="button"
                      onClick={() => handleAddInvite(friend)}
                      className="group w-full flex items-center gap-3 p-2.5 bg-background rounded-lg hover:bg-muted/50 transition-colors text-left border border-transparent hover:border-border"
                    >
                      <Avatar
                        src={friend.imageUrl}
                        alt={friend.name}
                        size="sm"
                        fallback={friend.name[0].toUpperCase()}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {friend.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {friend.email}
                        </p>
                      </div>
                      <UserPlus className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              ) : searchQuery.length >= 2 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No users found matching &quot;{searchQuery}&quot;
                </p>
              ) : searchQuery.length > 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Type at least 2 characters to search
                </p>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {friends.length === 0
                    ? "No friends yet. Search for users to add!"
                    : "Your friends will appear here"}
                </p>
              )}
            </div>

            {/* Invited List */}
            {invitedUsers.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Invited ({invitedUsers.length})
                </Label>
                <div className="max-h-32 overflow-y-auto space-y-1.5 p-2 bg-muted/30 rounded-md">
                  {invitedUsers.map((invitedUser) => (
                    <div
                      key={invitedUser.id}
                      className="flex items-center justify-between p-1.5 bg-background rounded group hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {invitedUser.name[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm">{invitedUser.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInvite(invitedUser.id)}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
