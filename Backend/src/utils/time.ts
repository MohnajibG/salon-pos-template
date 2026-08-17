export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

export const rangesOverlap = (
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean => aStart < bEnd && aEnd > bStart;

/**
 * Compare uniquement le jour calendaire (en UTC, comme les dates de
 * rendez-vous ancrées à minuit UTC) — volontairement pas de comparaison à
 * l'heure près ici, pour éviter tout écart de fuseau horaire entre client
 * et serveur.
 */
export const isPastCalendarDate = (date: Date, now: Date = new Date()) => {
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  return date.getTime() < startOfToday.getTime();
};
