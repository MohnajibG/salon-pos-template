export interface ReliabilityInfo {
  rate: number | null;
  stars: number;
  label: string;
  variant: "success" | "warning" | "danger" | "neutral";
}

export const getClientReliability = (client: {
  attendedCount: number;
  noShowCount: number;
}): ReliabilityInfo => {
  const total = client.attendedCount + client.noShowCount;

  if (total === 0) {
    return { rate: null, stars: 0, label: "Pas d'historique", variant: "neutral" };
  }

  const rate = Math.round((client.attendedCount / total) * 100);
  const stars = Math.round((rate / 100) * 5);

  if (rate >= 90) {
    return { rate, stars, label: "Fiable", variant: "success" };
  }

  if (rate >= 70) {
    return { rate, stars, label: "Correct", variant: "warning" };
  }

  return { rate, stars, label: "À risque", variant: "danger" };
};
