import EmployeeSchedule, {
  DAYS_OF_WEEK,
  DayOfWeek,
  IDayHours,
  IScheduleException,
} from "../models/EmployeeSchedule";

const DEFAULT_WEEKLY_HOURS: Record<DayOfWeek, IDayHours> = {
  monday: { isOpen: true, start: "09:00", end: "18:00" },
  tuesday: { isOpen: true, start: "09:00", end: "18:00" },
  wednesday: { isOpen: true, start: "09:00", end: "18:00" },
  thursday: { isOpen: true, start: "09:00", end: "18:00" },
  friday: { isOpen: true, start: "09:00", end: "18:00" },
  saturday: { isOpen: true, start: "09:00", end: "13:00" },
  sunday: { isOpen: false },
};

// Défensif : certains appelants transmettent encore une chaîne (payload
// JSON non converti) plutôt qu'un vrai objet Date
const asDate = (date: Date | string) =>
  date instanceof Date ? date : new Date(date);

const dateKey = (date: Date | string) => asDate(date).toISOString().slice(0, 10);

// En UTC (comme dateKey et comme les dates envoyées par le frontend,
// ancrées à minuit UTC) : utiliser getDay() ici décalerait le jour d'un
// cran selon le fuseau horaire du serveur et rejetterait des créneaux
// pourtant valides ("Créneau hors des horaires de travail")
const getDayOfWeek = (date: Date | string): DayOfWeek => {
  const jsDay = asDate(date).getUTCDay();
  return DAYS_OF_WEEK[(jsDay + 6) % 7] as DayOfWeek;
};

export const getOrCreateSchedule = async (employeeId: string) => {
  const existing = await EmployeeSchedule.findOne({ employee: employeeId });

  if (existing) {
    return existing;
  }

  return EmployeeSchedule.create({
    employee: employeeId,
    weeklyHours: DEFAULT_WEEKLY_HOURS,
    exceptions: [],
  });
};

export const updateWeeklyHours = async (
  employeeId: string,
  weeklyHours: Record<DayOfWeek, IDayHours>,
) => {
  const schedule = await getOrCreateSchedule(employeeId);

  schedule.weeklyHours = weeklyHours;

  await schedule.save();

  return schedule;
};

export const addException = async (
  employeeId: string,
  exception: {
    date: Date;
    isOff: boolean;
    start?: string;
    end?: string;
    reason?: string;
  },
) => {
  const schedule = await getOrCreateSchedule(employeeId);

  schedule.exceptions.push(exception as IScheduleException);

  await schedule.save();

  return schedule;
};

export const removeException = async (
  employeeId: string,
  exceptionId: string,
) => {
  const schedule = await getOrCreateSchedule(employeeId);

  schedule.exceptions = schedule.exceptions.filter(
    (exception) => exception._id.toString() !== exceptionId,
  ) as typeof schedule.exceptions;

  await schedule.save();

  return schedule;
};

export interface EffectiveHours {
  isOpen: boolean;
  start?: string;
  end?: string;
}

export const getEffectiveHours = async (
  employeeId: string,
  date: Date | string,
): Promise<EffectiveHours> => {
  const schedule = await getOrCreateSchedule(employeeId);

  const key = dateKey(date);

  const exception = schedule.exceptions.find(
    (item) => dateKey(item.date) === key,
  );

  if (exception) {
    return {
      isOpen: !exception.isOff,
      start: exception.start,
      end: exception.end,
    };
  }

  return schedule.weeklyHours[getDayOfWeek(date)];
};
