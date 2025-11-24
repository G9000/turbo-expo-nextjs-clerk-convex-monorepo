import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface TripStatusBadgeProps {
  status: string | null;
}

export function TripStatusBadge({ status }: TripStatusBadgeProps) {
  if (!status) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/20 text-foreground/80",
      )}
    >
      <Calendar className="size-3.5" />
      {status}
    </div>
  );
}
