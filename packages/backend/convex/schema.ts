import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - synced from Clerk
  users: defineTable({
    clerkId: v.string(), // Clerk user ID (from identity.subject)
    email: v.string(),
    name: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // Trips table - main trip information
  trips: defineTable({
    userId: v.string(), // Clerk user ID
    title: v.string(),
    allocatedBudget: v.number(),
    baseCurrency: v.string(),
    startDate: v.optional(v.string()), // ISO date string
    endDate: v.optional(v.string()), // ISO date string
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // Budget contributors for shared trips
  budgetContributors: defineTable({
    tripId: v.id("trips"),
    userId: v.string(), // Owner's Clerk user ID
    name: v.string(),
    amount: v.number(),
    createdAt: v.number(),
  }).index("by_trip", ["tripId"]),

  // Expenses/Budget entries
  expenses: defineTable({
    tripId: v.id("trips"),
    userId: v.string(), // Clerk user ID
    name: v.string(),
    total: v.number(),
    currency: v.string(),
    category: v.string(), // flight, hotel, food, transport, etc.
    date: v.string(), // ISO date string
    dateTo: v.optional(v.string()), // Optional end date for hotels/flights
    isPlanned: v.boolean(), // True for planned/budgeted expenses
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_trip", ["tripId"])
    .index("by_user", ["userId"])
    .index("by_trip_and_date", ["tripId", "date"]),

  // Custom expense categories
  customCategories: defineTable({
    tripId: v.id("trips"),
    userId: v.string(), // Clerk user ID
    name: v.string(),
    createdAt: v.number(),
  }).index("by_trip", ["tripId"]),

  // Itinerary activities
  activities: defineTable({
    tripId: v.id("trips"),
    userId: v.string(), // Clerk user ID
    title: v.string(),
    description: v.optional(v.string()),
    time: v.optional(v.string()), // HH:MM format
    dayIndex: v.number(), // Which day of the trip (1-based)
    notes: v.optional(v.string()),
    completed: v.boolean(),
    remindMe: v.boolean(),
    category: v.optional(v.string()), // transport, food, activities, etc.
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_trip", ["tripId"])
    .index("by_trip_and_day", ["tripId", "dayIndex"])
    .index("by_user", ["userId"]),
});
