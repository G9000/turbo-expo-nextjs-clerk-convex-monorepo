import {
  Plane,
  Wallet,
  Hotel,
  Utensils,
  ShoppingBag,
  Car,
  Camera,
  MapPin,
} from "lucide-react";

export const EXPENSE_CATEGORIES = [
  { value: "flight", label: "Flight", icon: Plane },
  { value: "hotel", label: "Hotel", icon: Hotel },
  { value: "food", label: "Food & Dining", icon: Utensils },
  { value: "transport", label: "Transport", icon: Car },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "activities", label: "Activities & Tours", icon: Camera },
  { value: "sightseeing", label: "Sightseeing", icon: MapPin },
  { value: "other", label: "Other", icon: Wallet },
] as const;

export function getCategoryIcon(categoryValue: string) {
  const predefinedCategory = EXPENSE_CATEGORIES.find(
    (c) => c.value === categoryValue,
  );
  if (predefinedCategory) {
    const Icon = predefinedCategory.icon;
    return <Icon className="h-4 w-4" />;
  }
  return <Wallet className="h-4 w-4" />;
}

export function getCategoryLabel(categoryValue: string) {
  const predefinedCategory = EXPENSE_CATEGORIES.find(
    (c) => c.value === categoryValue,
  );
  if (predefinedCategory) return predefinedCategory.label;
  return categoryValue.charAt(0).toUpperCase() + categoryValue.slice(1);
}

export function getDateLabel(categoryValue: string, isEndDate = false) {
  switch (categoryValue) {
    case "hotel":
      return isEndDate ? "Check-out Date" : "Check-in Date";
    case "flight":
      return isEndDate ? "Arrival Date" : "Departure Date";
    case "activities":
    case "sightseeing":
      return "Activity Date";
    case "food":
      return "Dining Date";
    case "shopping":
      return "Shopping Date";
    case "transport":
      return "Travel Date";
    default:
      return "Transaction Date";
  }
}
