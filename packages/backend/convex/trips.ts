import { query } from "./_generated/server";
import { v } from "convex/values";

// Get all trips for the current user
export const getUserTrips = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const trips = await ctx.db
      .query("trips")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    return trips;
  },
});

// Get a specific trip by ID
export const getTrip = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const trip = await ctx.db.get(args.tripId);

    // Ensure the trip belongs to the current user
    if (!trip || trip.userId !== identity.subject) {
      return null;
    }

    return trip;
  },
});

// Get the current active trip for the user (most recent)
export const getCurrentTrip = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const trips = await ctx.db
      .query("trips")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .first();

    return trips;
  },
});

// Get all expenses for a trip
export const getTripExpenses = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Verify user owns the trip
    const trip = await ctx.db.get(args.tripId);
    if (!trip || trip.userId !== identity.subject) {
      return [];
    }

    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
      .order("desc")
      .collect();

    return expenses;
  },
});

// Get budget contributors for a trip
export const getTripContributors = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Verify user owns the trip
    const trip = await ctx.db.get(args.tripId);
    if (!trip || trip.userId !== identity.subject) {
      return [];
    }

    const contributors = await ctx.db
      .query("budgetContributors")
      .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
      .collect();

    return contributors;
  },
});

// Get custom categories for a trip
export const getTripCustomCategories = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Verify user owns the trip
    const trip = await ctx.db.get(args.tripId);
    if (!trip || trip.userId !== identity.subject) {
      return [];
    }

    const categories = await ctx.db
      .query("customCategories")
      .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
      .collect();

    return categories;
  },
});

// Get activities for a trip
export const getTripActivities = query({
  args: { tripId: v.id("trips") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Verify user owns the trip
    const trip = await ctx.db.get(args.tripId);
    if (!trip || trip.userId !== identity.subject) {
      return [];
    }

    const activities = await ctx.db
      .query("activities")
      .withIndex("by_trip", (q) => q.eq("tripId", args.tripId))
      .order("asc")
      .collect();

    return activities;
  },
});

// Get activities for a specific day
export const getTripActivitiesByDay = query({
  args: {
    tripId: v.id("trips"),
    dayIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    // Verify user owns the trip
    const trip = await ctx.db.get(args.tripId);
    if (!trip || trip.userId !== identity.subject) {
      return [];
    }

    const activities = await ctx.db
      .query("activities")
      .withIndex("by_trip_and_day", (q) =>
        q.eq("tripId", args.tripId).eq("dayIndex", args.dayIndex),
      )
      .collect();

    return activities;
  },
});
