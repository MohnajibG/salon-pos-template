import Appointment from "../../models/Appointment";
import { getEffectiveHours } from "../employeeSchedule.service";
import {
  assertEmployeeAvailable,
  hasEmployeeConflict,
  isWithinWorkingHours,
  AvailabilityError,
} from "../availability.service";

jest.mock("../../models/Appointment", () => ({
  __esModule: true,
  default: { findOne: jest.fn() },
}));

jest.mock("../employeeSchedule.service", () => ({
  __esModule: true,
  getEffectiveHours: jest.fn(),
}));

const mockedFindOne = Appointment.findOne as jest.Mock;
const mockedGetEffectiveHours = getEffectiveHours as jest.Mock;

const EMPLOYEE_ID = "employee-1";
const DATE = new Date("2026-08-11T00:00:00.000Z"); // un mardi

beforeEach(() => {
  jest.clearAllMocks();
});

describe("isWithinWorkingHours", () => {
  it("renvoie false quand l'employé est off ce jour-là", async () => {
    mockedGetEffectiveHours.mockResolvedValue({ isOpen: false });

    const result = await isWithinWorkingHours(
      EMPLOYEE_ID,
      DATE,
      "09:00",
      "10:00",
    );

    expect(result).toBe(false);
  });

  it("renvoie true quand le créneau est entièrement dans les horaires", async () => {
    mockedGetEffectiveHours.mockResolvedValue({
      isOpen: true,
      start: "09:00",
      end: "18:00",
    });

    const result = await isWithinWorkingHours(
      EMPLOYEE_ID,
      DATE,
      "10:00",
      "11:00",
    );

    expect(result).toBe(true);
  });

  it("renvoie false quand le créneau dépasse les horaires", async () => {
    mockedGetEffectiveHours.mockResolvedValue({
      isOpen: true,
      start: "09:00",
      end: "18:00",
    });

    const result = await isWithinWorkingHours(
      EMPLOYEE_ID,
      DATE,
      "17:30",
      "18:30",
    );

    expect(result).toBe(false);
  });
});

describe("hasEmployeeConflict", () => {
  it("renvoie true si un rendez-vous chevauche le créneau", async () => {
    mockedFindOne.mockResolvedValue({ _id: "existing-appointment" });

    const result = await hasEmployeeConflict(
      EMPLOYEE_ID,
      DATE,
      "10:00",
      "11:00",
    );

    expect(result).toBe(true);
    expect(mockedFindOne).toHaveBeenCalledWith(
      expect.objectContaining({
        "services.employee": EMPLOYEE_ID,
        startTime: { $lt: "11:00" },
        endTime: { $gt: "10:00" },
      }),
    );
  });

  it("exclut le rendez-vous courant lors d'une reprogrammation", async () => {
    mockedFindOne.mockResolvedValue(null);

    await hasEmployeeConflict(
      EMPLOYEE_ID,
      DATE,
      "10:00",
      "11:00",
      "current-appointment",
    );

    expect(mockedFindOne).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: { $ne: "current-appointment" },
      }),
    );
  });

  it("renvoie false quand aucun rendez-vous ne chevauche", async () => {
    mockedFindOne.mockResolvedValue(null);

    const result = await hasEmployeeConflict(
      EMPLOYEE_ID,
      DATE,
      "10:00",
      "11:00",
    );

    expect(result).toBe(false);
  });
});

describe("assertEmployeeAvailable", () => {
  it("lève une erreur employee_unavailable si l'employé est off", async () => {
    mockedGetEffectiveHours.mockResolvedValue({ isOpen: false });

    await expect(
      assertEmployeeAvailable(EMPLOYEE_ID, DATE, "09:00", "10:00"),
    ).rejects.toMatchObject<Partial<AvailabilityError>>({
      reason: "employee_unavailable",
    });
  });

  it("lève une erreur outside_hours si le créneau dépasse les horaires", async () => {
    mockedGetEffectiveHours.mockResolvedValue({
      isOpen: true,
      start: "09:00",
      end: "18:00",
    });

    await expect(
      assertEmployeeAvailable(EMPLOYEE_ID, DATE, "18:00", "19:00"),
    ).rejects.toMatchObject<Partial<AvailabilityError>>({
      reason: "outside_hours",
    });
  });

  it("lève une erreur time_conflict si un rendez-vous chevauche", async () => {
    mockedGetEffectiveHours.mockResolvedValue({
      isOpen: true,
      start: "09:00",
      end: "18:00",
    });
    mockedFindOne.mockResolvedValue({ _id: "existing-appointment" });

    await expect(
      assertEmployeeAvailable(EMPLOYEE_ID, DATE, "10:00", "11:00"),
    ).rejects.toMatchObject<Partial<AvailabilityError>>({
      reason: "time_conflict",
    });
  });

  it("ne lève rien quand le créneau est libre et dans les horaires", async () => {
    mockedGetEffectiveHours.mockResolvedValue({
      isOpen: true,
      start: "09:00",
      end: "18:00",
    });
    mockedFindOne.mockResolvedValue(null);

    await expect(
      assertEmployeeAvailable(EMPLOYEE_ID, DATE, "10:00", "11:00"),
    ).resolves.toBeUndefined();
  });
});
