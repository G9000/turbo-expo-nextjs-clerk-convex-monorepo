import { useEffect } from "react";
import { toast } from "sonner";

interface Activity {
  dayIndex: number;
  time?: string;
  title: string;
  category?: string;
  remindMe?: boolean;
  completed?: boolean;
}

function checkTimeBasedReminders(
  activities: Activity[],
  tripStartDate: string,
  tripEndDate: string,
) {
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(tripStartDate);
  const end = new Date(tripEndDate);

  // Only check reminders during the trip
  if (now < start || now > end) return;

  const currentDay =
    Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Get today's activities with reminders enabled
  const todayActivitiesWithReminders = activities.filter(
    (a) => a.dayIndex === currentDay && a.remindMe && a.time && !a.completed,
  );

  todayActivitiesWithReminders.forEach((activity) => {
    if (!activity.time) return;

    const [hours, minutes] = activity.time.split(":").map(Number);
    const activityTime = new Date(today);
    activityTime.setHours(hours, minutes, 0, 0);

    const timeDiff = activityTime.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    // 30-minute reminder
    if (minutesDiff > 29 && minutesDiff <= 30) {
      toast.warning(`⏰ Activity in 30 minutes!`, {
        description: `${activity.time} - ${activity.title}${
          activity.category === "transport" ? " 🚌" : ""
        }`,
        duration: 8000,
      });
    }

    // 10-minute reminder
    if (minutesDiff > 9 && minutesDiff <= 10) {
      toast.error(`🚨 Activity in 10 minutes!`, {
        description: `${activity.time} - ${activity.title}${
          activity.category === "transport" ? " Don't miss your transport!" : ""
        }`,
        duration: 10000,
      });
    }
  });
}

function checkDailySummary(
  activities: Activity[],
  tripStartDate: string,
  tripEndDate: string,
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(tripStartDate);
  const end = new Date(tripEndDate);

  // Only show reminders if trip is ongoing or starting tomorrow
  const daysUntilTrip = Math.ceil(
    (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntilTrip > 1 || today > end) return;

  // Check for activities today
  if (today >= start && today <= end) {
    const currentDay =
      Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) +
      1;
    const todayActivities = activities.filter(
      (a) => a.dayIndex === currentDay && !a.completed,
    );

    if (todayActivities.length > 0) {
      toast.info(
        `You have ${todayActivities.length} activities planned for today!`,
        {
          description: todayActivities
            .slice(0, 3)
            .map((a) => `${a.time ? a.time + " - " : ""}${a.title}`)
            .join(" • "),
          duration: 6000,
        },
      );
    }
  }

  // Notify about trip starting tomorrow
  if (daysUntilTrip === 1 && activities.length > 0) {
    const firstDayActivities = activities.filter((a) => a.dayIndex === 1);
    if (firstDayActivities.length > 0) {
      toast.success("Trip starts tomorrow!", {
        description: `${firstDayActivities.length} activities planned for Day 1`,
        duration: 6000,
      });
    }
  }
}

export function useActivityReminders(
  activities: Activity[],
  tripStartDate: string | null,
  tripEndDate: string | null,
) {
  // Time-based reminders (30 min & 10 min before)
  useEffect(() => {
    if (!tripStartDate || !tripEndDate || activities.length === 0) return;

    checkTimeBasedReminders(activities, tripStartDate, tripEndDate);

    // Check every minute
    const interval = setInterval(() => {
      window.location.reload(); // Simple refresh to re-check
    }, 60000);

    return () => clearInterval(interval);
  }, [tripStartDate, tripEndDate, activities]);

  // Daily activity summary
  useEffect(() => {
    if (!tripStartDate || !tripEndDate || activities.length === 0) return;

    checkDailySummary(activities, tripStartDate, tripEndDate);
  }, [tripStartDate, tripEndDate, activities]);
}
