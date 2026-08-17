export const toDateKey = (date: Date): string => date.toISOString().slice(0, 10);

// Ancre à minuit UTC pour rester cohérent avec les dates renvoyées par l'API
export const fromDateKey = (key: string): Date => new Date(`${key}T00:00:00.000Z`);

export const addDays = (key: string, days: number): string => {
  const date = fromDateKey(key);
  date.setUTCDate(date.getUTCDate() + days);
  return toDateKey(date);
};

// Lundi comme premier jour de semaine
export const startOfWeek = (key: string): string => {
  const date = fromDateKey(key);
  const jsDay = date.getUTCDay();
  const diff = (jsDay + 6) % 7;
  date.setUTCDate(date.getUTCDate() - diff);
  return toDateKey(date);
};

export const startOfMonth = (key: string): string => {
  const date = fromDateKey(key);
  date.setUTCDate(1);
  return toDateKey(date);
};

export const daysInMonth = (key: string): number => {
  const date = fromDateKey(key);
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
  ).getUTCDate();
};

export const dayLabel = (key: string): string => {
  const date = fromDateKey(key);
  return date.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  });
};

export const monthLabel = (key: string): string => {
  const date = fromDateKey(key);
  return date.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
};

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};
