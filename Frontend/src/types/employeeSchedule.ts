export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: "Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
  sunday: "Dimanche",
};

export interface DayHours {
  isOpen: boolean;
  start?: string;
  end?: string;
}

export interface ScheduleException {
  _id: string;
  date: string;
  isOff: boolean;
  start?: string;
  end?: string;
  reason?: string;
}

export interface EmployeeSchedule {
  _id: string;
  employee: string;
  weeklyHours: Record<DayOfWeek, DayHours>;
  exceptions: ScheduleException[];
}
