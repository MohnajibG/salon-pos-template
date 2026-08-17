import { Star } from "lucide-react";

import { getClientReliability } from "../../utils/clientReliability";
import Badge from "../ui/Badge";

interface ClientReliabilityBadgeProps {
  client: { attendedCount: number; noShowCount: number };
  showStars?: boolean;
}

const ClientReliabilityBadge = ({
  client,
  showStars = true,
}: ClientReliabilityBadgeProps) => {
  const reliability = getClientReliability(client);

  return (
    <div className="flex items-center gap-2">
      <Badge variant={reliability.variant}>
        {reliability.rate === null
          ? reliability.label
          : `${reliability.label} (${reliability.rate}%)`}
      </Badge>

      {showStars && reliability.rate !== null && (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={13}
              className={
                index < reliability.stars
                  ? "fill-(--champagne) text-(--champagne)"
                  : "text-stone-300"
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientReliabilityBadge;
