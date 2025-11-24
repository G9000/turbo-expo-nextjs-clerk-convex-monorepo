import { Id } from "../../../packages/backend/convex/_generated/dataModel";

interface Participant {
  _id: Id<"participants">;
  name: string;
}

interface ParticipantsListProps {
  participants: Participant[];
}

export function ParticipantsList({ participants }: ParticipantsListProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-foreground/70">
        Participants ({participants.length})
      </span>
      <div className="flex -space-x-2">
        {participants.slice(0, 3).map((participant, index) => (
          <div
            key={participant._id}
            className="size-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white"
            style={{
              backgroundColor: `hsl(${(index * 120) % 360}, 70%, 50%)`,
            }}
            title={participant.name}
          >
            {participant.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {participants.length > 3 && (
          <div className="size-8 rounded-full bg-foreground/40 border-2 border-background flex items-center justify-center text-xs font-bold text-foreground">
            +{participants.length - 3}
          </div>
        )}
      </div>
    </div>
  );
}
