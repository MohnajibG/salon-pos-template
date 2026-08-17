import EmployeeSchedule from "../../models/EmployeeSchedule";
import { getEffectiveHours } from "../employeeSchedule.service";

jest.mock("../../models/EmployeeSchedule", () => ({
  __esModule: true,
  default: { findOne: jest.fn(), create: jest.fn() },
  DAYS_OF_WEEK: [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ],
}));

const mockedFindOne = EmployeeSchedule.findOne as jest.Mock;

const EMPLOYEE_ID = "employee-1";

const SCHEDULE = {
  employee: EMPLOYEE_ID,
  weeklyHours: {
    monday: { isOpen: true, start: "09:00", end: "18:00" },
    tuesday: { isOpen: true, start: "09:00", end: "18:00" },
    wednesday: { isOpen: true, start: "09:00", end: "18:00" },
    thursday: { isOpen: true, start: "09:00", end: "18:00" },
    friday: { isOpen: true, start: "09:00", end: "18:00" },
    saturday: { isOpen: true, start: "09:00", end: "13:00" },
    sunday: { isOpen: false },
  },
  exceptions: [],
};

beforeEach(() => {
  jest.clearAllMocks();
  mockedFindOne.mockResolvedValue(SCHEDULE);
});

describe("getEffectiveHours", () => {
  // Régression : les contrôleurs de création envoient parfois une date
  // JSON non convertie (chaîne "YYYY-MM-DD") plutôt qu'un objet Date réel.
  it("fonctionne quand la date est une chaîne plutôt qu'un objet Date", async () => {
    const hours = await getEffectiveHours(EMPLOYEE_ID, "2026-08-11"); // un mardi

    expect(hours.isOpen).toBe(true);
    expect(hours.start).toBe("09:00");
    expect(hours.end).toBe("18:00");
  });

  it("fonctionne aussi avec un vrai objet Date", async () => {
    const hours = await getEffectiveHours(
      EMPLOYEE_ID,
      new Date("2026-08-16T00:00:00.000Z"), // un dimanche
    );

    expect(hours.isOpen).toBe(false);
  });

  it("identifie correctement le jour à partir d'une date à minuit UTC", async () => {
    const hours = await getEffectiveHours(
      EMPLOYEE_ID,
      new Date("2026-08-17T00:00:00.000Z"), // lundi à minuit UTC
    );

    expect(hours.isOpen).toBe(true);
    expect(hours.start).toBe("09:00");
    expect(hours.end).toBe("18:00");
  });

  // Régression : sur un serveur dont le fuseau horaire local n'est pas
  // UTC, date.getDay() (heure locale) peut décaler le jour de la semaine
  // par rapport aux dates ancrées à minuit UTC envoyées par le frontend,
  // et rejeter à tort des rendez-vous pourtant valides ("Créneau hors des
  // horaires de travail"). getDayOfWeek doit donc utiliser getUTCDay(),
  // jamais getDay() — ce test échoue si ce n'est plus le cas.
  it("n'utilise jamais l'heure locale du serveur pour déterminer le jour", async () => {
    const localDaySpy = jest.spyOn(Date.prototype, "getDay");

    await getEffectiveHours(EMPLOYEE_ID, new Date("2026-08-17T00:00:00.000Z"));

    expect(localDaySpy).not.toHaveBeenCalled();

    localDaySpy.mockRestore();
  });
});
