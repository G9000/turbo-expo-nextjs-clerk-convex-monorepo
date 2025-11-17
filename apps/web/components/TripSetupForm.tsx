"use client";

import { useState } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Plane, UserPlus, X } from "lucide-react";
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
}

export function TripSetupForm({
  tripTitle,
  allocatedBudget,
  baseCurrency,
  onTripTitleChange,
  onAllocatedBudgetChange,
  onBaseCurrencyChange,
  onSubmit,
}: TripSetupFormProps) {
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [invitedUsers, setInvitedUsers] = useState<
    Array<{ id: string; name: string; email: string; imageUrl?: string }>
  >([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Placeholder friends data - will be replaced with actual Convex query
  const friendsList = [
    {
      id: "user_1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      imageUrl: undefined,
    },
    {
      id: "user_2",
      name: "Mike Chen",
      email: "mike@example.com",
      imageUrl: undefined,
    },
    {
      id: "user_3",
      name: "Emma Wilson",
      email: "emma@example.com",
      imageUrl: undefined,
    },
    {
      id: "user_4",
      name: "David Brown",
      email: "david@example.com",
      imageUrl: undefined,
    },
  ];

  // Filter friends based on search query
  const filteredFriends = friendsList.filter(
    (friend) =>
      !invitedUsers.some((invited) => invited.id === friend.id) &&
      (friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.email.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleAddInvite = (friend: (typeof friendsList)[0]) => {
    setInvitedUsers([...invitedUsers, friend]);
    setSearchQuery("");
  };

  const handleRemoveInvite = (userId: string) => {
    setInvitedUsers(invitedUsers.filter((u) => u.id !== userId));
  };

  return (
    <div className="flex h-full items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Plane className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Start Your Trip Budget</CardTitle>
          <CardDescription>
            Enter your trip details to begin tracking expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Trip Members Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Trip Members
              </Label>

              {/* Avatar Stack */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {/* Current User Avatar */}
                  {user?.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.fullName || "User"}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full ring-2 ring-background"
                      title={`${user.fullName || "You"} (Owner)`}
                    />
                  ) : (
                    <div
                      className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center ring-2 ring-background"
                      title={`${user?.fullName || "You"} (Owner)`}
                    >
                      <span className="text-sm font-semibold text-primary">
                        {user?.firstName?.[0] || "U"}
                      </span>
                    </div>
                  )}

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
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tripTitle">Trip Name</Label>
                <Input
                  id="tripTitle"
                  type="text"
                  value={tripTitle}
                  onChange={(e) => onTripTitleChange(e.target.value)}
                  placeholder="e.g., Tokyo Adventure 2025"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="baseCurrency">Base Currency</Label>
                <Select
                  value={baseCurrency}
                  onValueChange={onBaseCurrencyChange}
                >
                  <SelectTrigger id="baseCurrency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code}>
                        {curr.symbol} {curr.code} - {curr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Start Tracking
            </Button>
          </form>
        </CardContent>
      </Card>

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
                <UserPlus className="h-4 w-4" />
                Search Friends
              </Label>
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
              />
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
                      className="w-full flex items-center gap-3 p-2 bg-background rounded hover:bg-muted/50 transition-colors text-left"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-primary">
                          {friend.name[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {friend.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {friend.email}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchQuery ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No friends found matching &quot;{searchQuery}&quot;
                </p>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No friends available
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
