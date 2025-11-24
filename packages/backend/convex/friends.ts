import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Get all accepted friends for the current user
 * Returns user details for each friend
 */
export const getFriends = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    // Get all accepted friendships where user is either userId or friendId
    const sentFriendships = await ctx.db
      .query("friendships")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", clerkId).eq("status", "accepted"),
      )
      .collect();

    const receivedFriendships = await ctx.db
      .query("friendships")
      .withIndex("by_friend_and_status", (q) =>
        q.eq("friendId", clerkId).eq("status", "accepted"),
      )
      .collect();

    // Collect all friend IDs
    const friendIds = [
      ...sentFriendships.map((f) => f.friendId),
      ...receivedFriendships.map((f) => f.userId),
    ];

    // Get user details for all friends
    const friends = await Promise.all(
      friendIds.map(async (friendClerkId) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", friendClerkId))
          .first();

        return user
          ? {
              id: user._id,
              clerkId: user.clerkId,
              name: user.name,
              email: user.email,
              imageUrl: user.imageUrl,
            }
          : null;
      }),
    );

    // Filter out null values (users that don't exist)
    return friends.filter((f) => f !== null);
  },
});

/**
 * Get pending friend requests (incoming)
 */
export const getPendingRequests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    // Get pending requests where current user is the friendId (receiver)
    const pendingRequests = await ctx.db
      .query("friendships")
      .withIndex("by_friend_and_status", (q) =>
        q.eq("friendId", clerkId).eq("status", "pending"),
      )
      .collect();

    // Get user details for each requester
    const requests = await Promise.all(
      pendingRequests.map(async (friendship) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", friendship.userId))
          .first();

        return user
          ? {
              friendshipId: friendship._id,
              id: user._id,
              clerkId: user.clerkId,
              name: user.name,
              email: user.email,
              imageUrl: user.imageUrl,
              createdAt: friendship.createdAt,
            }
          : null;
      }),
    );

    return requests.filter((r) => r !== null);
  },
});

/**
 * Get sent friend requests (outgoing)
 */
export const getSentRequests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    // Get pending requests where current user is the userId (sender)
    const sentRequests = await ctx.db
      .query("friendships")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", clerkId).eq("status", "pending"),
      )
      .collect();

    // Get user details for each recipient
    const requests = await Promise.all(
      sentRequests.map(async (friendship) => {
        const user = await ctx.db
          .query("users")
          .withIndex("by_clerk_id", (q) => q.eq("clerkId", friendship.friendId))
          .first();

        return user
          ? {
              friendshipId: friendship._id,
              id: user._id,
              clerkId: user.clerkId,
              name: user.name,
              email: user.email,
              imageUrl: user.imageUrl,
              createdAt: friendship.createdAt,
            }
          : null;
      }),
    );

    return requests.filter((r) => r !== null);
  },
});

/**
 * Search for users to add as friends
 * Excludes current friends, pending requests, and self
 */
export const searchUsers = query({
  args: {
    searchQuery: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;
    const query = args.searchQuery.toLowerCase().trim();

    if (query.length < 2) {
      return [];
    }

    // Get all users
    const allUsers = await ctx.db.query("users").collect();

    // Get all existing friendships (any status) for the current user
    const existingFriendships = await ctx.db
      .query("friendships")
      .withIndex("by_user", (q) => q.eq("userId", clerkId))
      .collect();

    const receivedFriendships = await ctx.db
      .query("friendships")
      .withIndex("by_friend", (q) => q.eq("friendId", clerkId))
      .collect();

    // Create a set of user IDs to exclude
    const excludeIds = new Set([
      clerkId, // Exclude self
      ...existingFriendships.map((f) => f.friendId),
      ...receivedFriendships.map((f) => f.userId),
    ]);

    // Filter and search users
    const results = allUsers
      .filter(
        (user) =>
          !excludeIds.has(user.clerkId) &&
          (user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)),
      )
      .slice(0, 10) // Limit to 10 results
      .map((user) => ({
        id: user._id,
        clerkId: user.clerkId,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      }));

    return results;
  },
});

/**
 * Send a friend request
 */
export const sendFriendRequest = mutation({
  args: {
    friendClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    // Can't send friend request to yourself
    if (clerkId === args.friendClerkId) {
      throw new Error("Cannot send friend request to yourself");
    }

    // Check if friendship already exists (in either direction)
    const existingFriendship = await ctx.db
      .query("friendships")
      .withIndex("by_users", (q) =>
        q.eq("userId", clerkId).eq("friendId", args.friendClerkId),
      )
      .first();

    const reverseFriendship = await ctx.db
      .query("friendships")
      .withIndex("by_users", (q) =>
        q.eq("userId", args.friendClerkId).eq("friendId", clerkId),
      )
      .first();

    if (existingFriendship || reverseFriendship) {
      throw new Error("Friendship already exists or pending");
    }

    // Verify the friend user exists
    const friendUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.friendClerkId))
      .first();

    if (!friendUser) {
      throw new Error("User not found");
    }

    // Create friend request
    const friendshipId = await ctx.db.insert("friendships", {
      userId: clerkId,
      friendId: args.friendClerkId,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return friendshipId;
  },
});

/**
 * Accept a friend request
 */
export const acceptFriendRequest = mutation({
  args: {
    friendshipId: v.id("friendships"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    // Get the friendship
    const friendship = await ctx.db.get(args.friendshipId);

    if (!friendship) {
      throw new Error("Friend request not found");
    }

    // Verify that the current user is the recipient
    if (friendship.friendId !== clerkId) {
      throw new Error("Not authorized to accept this request");
    }

    // Verify the request is still pending
    if (friendship.status !== "pending") {
      throw new Error("Request is not pending");
    }

    // Update status to accepted
    await ctx.db.patch(args.friendshipId, {
      status: "accepted",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Reject/cancel a friend request
 */
export const rejectFriendRequest = mutation({
  args: {
    friendshipId: v.id("friendships"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    // Get the friendship
    const friendship = await ctx.db.get(args.friendshipId);

    if (!friendship) {
      throw new Error("Friend request not found");
    }

    // Verify that the current user is either the sender or recipient
    if (friendship.userId !== clerkId && friendship.friendId !== clerkId) {
      throw new Error("Not authorized to reject this request");
    }

    // Delete the friendship
    await ctx.db.delete(args.friendshipId);

    return { success: true };
  },
});

/**
 * Remove a friend (unfriend)
 */
export const removeFriend = mutation({
  args: {
    friendClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    // Find the friendship in either direction
    const friendship =
      (await ctx.db
        .query("friendships")
        .withIndex("by_users", (q) =>
          q.eq("userId", clerkId).eq("friendId", args.friendClerkId),
        )
        .first()) ||
      (await ctx.db
        .query("friendships")
        .withIndex("by_users", (q) =>
          q.eq("userId", args.friendClerkId).eq("friendId", clerkId),
        )
        .first());

    if (!friendship) {
      throw new Error("Friendship not found");
    }

    // Delete the friendship
    await ctx.db.delete(friendship._id);

    return { success: true };
  },
});

/**
 * Block a user
 */
export const blockUser = mutation({
  args: {
    userClerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    // Find existing friendship
    const existingFriendship =
      (await ctx.db
        .query("friendships")
        .withIndex("by_users", (q) =>
          q.eq("userId", clerkId).eq("friendId", args.userClerkId),
        )
        .first()) ||
      (await ctx.db
        .query("friendships")
        .withIndex("by_users", (q) =>
          q.eq("userId", args.userClerkId).eq("friendId", clerkId),
        )
        .first());

    if (existingFriendship) {
      // Update to blocked
      await ctx.db.patch(existingFriendship._id, {
        status: "blocked",
        userId: clerkId, // Ensure blocker is the userId
        friendId: args.userClerkId,
        updatedAt: Date.now(),
      });
    } else {
      // Create new blocked relationship
      await ctx.db.insert("friendships", {
        userId: clerkId,
        friendId: args.userClerkId,
        status: "blocked",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});
