import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new trip
export const createTrip = mutation({
  args: {
    title: v.string(),
    allocatedBudget: v.optional(v.number()),
    baseCurrency: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // Get user data from users table
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    const now = Date.now();
    const tripId = await ctx.db.insert("trips", {
      userId: identity.subject,
      title: args.title,
      allocatedBudget: args.allocatedBudget ?? 0, // Default to 0 if not provided
      baseCurrency: args.baseCurrency,
      startDate: args.startDate,
      endDate: args.endDate,
      createdAt: now,
      updatedAt: now,
    });

    // Add creator as a participant with owner role
    await ctx.db.insert("participants", {
      tripId,
      userId: identity.subject,
      role: "owner",
      status: "accepted",
      createdAt: now,
    });

    return tripId;
  },
});

// Update a trip
export const updateTrip = mutation({
  args: {
    tripId: v.id("trips"),
    title: v.optional(v.string()),
    allocatedBudget: v.optional(v.number()),
    baseCurrency: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const trip = await ctx.db.get(args.tripId);
    if (!trip || trip.userId !== identity.subject) {
      throw new Error("Trip not found or unauthorized");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;
    if (args.allocatedBudget !== undefined)
      updates.allocatedBudget = args.allocatedBudget;
    if (args.baseCurrency !== undefined)
      updates.baseCurrency = args.baseCurrency;
    if (args.startDate !== undefined) updates.startDate = args.startDate;
    if (args.endDate !== undefined) updates.endDate = args.endDate;

    await ctx.db.patch(args.tripId, updates);
    return args.tripId;
  },
});

// Delete a trip (soft delete)
export const deleteTrip = mutation({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const trip = await ctx.db.get(args.tripId);
    if (!trip || trip.userId !== identity.subject) {
      throw new Error("Trip not found or unauthorized");
    }

    // Soft delete: mark as deleted instead of actually deleting
    await ctx.db.patch(args.tripId, {
      isDeleted: true,
      deletedAt: Date.now(),
      updatedAt: Date.now(),
    });

    return args.tripId;
  },
});

// Add an expense
export const addExpense = mutation({
  args: {
    tripId: v.id("trips"),
    name: v.string(),
    total: v.number(),
    currency: v.string(),
    category: v.string(),
    date: v.string(),
    dateTo: v.optional(v.string()),
    isPlanned: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const trip = await ctx.db.get(args.tripId);
    if (!trip || trip.userId !== identity.subject) {
      throw new Error("Trip not found or unauthorized");
    }

    const now = Date.now();
    const expenseId = await ctx.db.insert("expenses", {
      tripId: args.tripId,
      userId: identity.subject,
      name: args.name,
      total: args.total,
      currency: args.currency,
      category: args.category,
      date: args.date,
      dateTo: args.dateTo,
      isPlanned: args.isPlanned,
      createdAt: now,
      updatedAt: now,
    });

    return expenseId;
  },
});

// Update an expense
export const updateExpense = mutation({
  args: {
    expenseId: v.id("expenses"),
    name: v.optional(v.string()),
    total: v.optional(v.number()),
    currency: v.optional(v.string()),
    category: v.optional(v.string()),
    date: v.optional(v.string()),
    dateTo: v.optional(v.string()),
    isPlanned: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const expense = await ctx.db.get(args.expenseId);
    if (!expense || expense.userId !== identity.subject) {
      throw new Error("Expense not found or unauthorized");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.name !== undefined) updates.name = args.name;
    if (args.total !== undefined) updates.total = args.total;
    if (args.currency !== undefined) updates.currency = args.currency;
    if (args.category !== undefined) updates.category = args.category;
    if (args.date !== undefined) updates.date = args.date;
    if (args.dateTo !== undefined) updates.dateTo = args.dateTo;
    if (args.isPlanned !== undefined) updates.isPlanned = args.isPlanned;

    await ctx.db.patch(args.expenseId, updates);
    return args.expenseId;
  },
});

// Delete an expense
export const deleteExpense = mutation({
  args: { expenseId: v.id("expenses") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const expense = await ctx.db.get(args.expenseId);
    if (!expense || expense.userId !== identity.subject) {
      throw new Error("Expense not found or unauthorized");
    }

    await ctx.db.delete(args.expenseId);
  },
});

// Add a budget contributor
export const addBudgetContributor = mutation({
  args: {
    tripId: v.id("trips"),
    name: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const trip = await ctx.db.get(args.tripId);
    if (!trip || trip.userId !== identity.subject) {
      throw new Error("Trip not found or unauthorized");
    }

    const contributorId = await ctx.db.insert("budgetContributors", {
      tripId: args.tripId,
      userId: identity.subject,
      name: args.name,
      amount: args.amount,
      createdAt: Date.now(),
    });

    return contributorId;
  },
});

// Delete a budget contributor
export const deleteBudgetContributor = mutation({
  args: { contributorId: v.id("budgetContributors") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const contributor = await ctx.db.get(args.contributorId);
    if (!contributor || contributor.userId !== identity.subject) {
      throw new Error("Contributor not found or unauthorized");
    }

    await ctx.db.delete(args.contributorId);
  },
});

// Add a custom category
export const addCustomCategory = mutation({
  args: {
    tripId: v.id("trips"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const trip = await ctx.db.get(args.tripId);
    if (!trip || trip.userId !== identity.subject) {
      throw new Error("Trip not found or unauthorized");
    }

    const categoryId = await ctx.db.insert("customCategories", {
      tripId: args.tripId,
      userId: identity.subject,
      name: args.name,
      createdAt: Date.now(),
    });

    return categoryId;
  },
});

// Add an activity
export const addActivity = mutation({
  args: {
    tripId: v.id("trips"),
    title: v.string(),
    description: v.optional(v.string()),
    time: v.optional(v.string()),
    dayIndex: v.number(),
    notes: v.optional(v.string()),
    category: v.optional(v.string()),
    remindMe: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const trip = await ctx.db.get(args.tripId);
    if (!trip || trip.userId !== identity.subject) {
      throw new Error("Trip not found or unauthorized");
    }

    const now = Date.now();
    const activityId = await ctx.db.insert("activities", {
      tripId: args.tripId,
      userId: identity.subject,
      title: args.title,
      description: args.description,
      time: args.time,
      dayIndex: args.dayIndex,
      notes: args.notes,
      category: args.category,
      completed: false,
      remindMe: args.remindMe,
      createdAt: now,
      updatedAt: now,
    });

    return activityId;
  },
});

// Update an activity
export const updateActivity = mutation({
  args: {
    activityId: v.id("activities"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    time: v.optional(v.string()),
    dayIndex: v.optional(v.number()),
    notes: v.optional(v.string()),
    category: v.optional(v.string()),
    completed: v.optional(v.boolean()),
    remindMe: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const activity = await ctx.db.get(args.activityId);
    if (!activity || activity.userId !== identity.subject) {
      throw new Error("Activity not found or unauthorized");
    }

    const updates: any = { updatedAt: Date.now() };
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.time !== undefined) updates.time = args.time;
    if (args.dayIndex !== undefined) updates.dayIndex = args.dayIndex;
    if (args.notes !== undefined) updates.notes = args.notes;
    if (args.category !== undefined) updates.category = args.category;
    if (args.completed !== undefined) updates.completed = args.completed;
    if (args.remindMe !== undefined) updates.remindMe = args.remindMe;

    await ctx.db.patch(args.activityId, updates);
    return args.activityId;
  },
});

// Delete an activity
export const deleteActivity = mutation({
  args: { activityId: v.id("activities") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const activity = await ctx.db.get(args.activityId);
    if (!activity || activity.userId !== identity.subject) {
      throw new Error("Activity not found or unauthorized");
    }

    await ctx.db.delete(args.activityId);
  },
});
