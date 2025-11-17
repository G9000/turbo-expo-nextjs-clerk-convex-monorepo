import { useMemo } from "react";
import dayjs from "dayjs";

interface TripStatus {
  status: "upcoming" | "ongoing" | "past";
  text: string;
  color: string;
}

export function useTripStatus(
  tripStartDate: string,
  tripEndDate: string
): TripStatus | null {
  return useMemo(() => {
    if (!tripStartDate || !tripEndDate) return null;

    const today = dayjs().startOf("day");
    const start = dayjs(tripStartDate).startOf("day");
    const end = dayjs(tripEndDate).startOf("day");

    if (today.isBefore(start)) {
      // Trip hasn't started
      const daysToGo = start.diff(today, "day");
      return {
        status: "upcoming",
        text: `${daysToGo} day${daysToGo !== 1 ? "s" : ""} to go`,
        color: "text-blue-600 dark:text-blue-400",
      };
    } else if (
      today.isSame(start) ||
      (today.isAfter(start) && today.isBefore(end)) ||
      today.isSame(end)
    ) {
      // Trip is ongoing
      const totalDays = end.diff(start, "day") + 1;
      const currentDay = today.diff(start, "day") + 1;
      return {
        status: "ongoing",
        text: `Day ${currentDay} of ${totalDays}`,
        color: "text-green-600 dark:text-green-400",
      };
    } else {
      // Trip has ended
      const daysSince = today.diff(end, "day");
      return {
        status: "past",
        text: `Ended ${daysSince} day${daysSince !== 1 ? "s" : ""} ago`,
        color: "text-muted-foreground",
      };
    }
  }, [tripStartDate, tripEndDate]);
}
