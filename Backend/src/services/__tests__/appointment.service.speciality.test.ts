import Client from "../../models/Client";
import Service from "../../models/Service";
import User from "../../models/User";
import { buildAppointmentSnapshot } from "../appointment.service";

jest.mock("../../models/Client", () => ({
  __esModule: true,
  default: { findOne: jest.fn() },
}));

jest.mock("../../models/Service", () => ({
  __esModule: true,
  default: { find: jest.fn() },
}));

jest.mock("../../models/User", () => ({
  __esModule: true,
  default: { find: jest.fn() },
}));

const mockedClientFindOne = Client.findOne as jest.Mock;
const mockedServiceFind = Service.find as jest.Mock;
const mockedUserFind = User.find as jest.Mock;

const CLIENT_ID = "client-1";
const SERVICE_ID = "service-1";
const EMPLOYEE_ID = "employee-1";

beforeEach(() => {
  jest.clearAllMocks();
  mockedClientFindOne.mockResolvedValue({ _id: CLIENT_ID });
});

describe("buildAppointmentSnapshot - correspondance spécialité", () => {
  it("rejette une paire service/employé de spécialités différentes", async () => {
    mockedServiceFind.mockResolvedValue([
      {
        _id: { toString: () => SERVICE_ID },
        name: "Manucure",
        speciality: "Category2",
        price: 1000,
        duration: 30,
      },
    ]);

    mockedUserFind.mockResolvedValue([
      {
        _id: { toString: () => EMPLOYEE_ID },
        firstName: "Sarah",
        lastName: "Martin",
        speciality: "Category1",
      },
    ]);

    await expect(
      buildAppointmentSnapshot({
        client: CLIENT_ID,
        services: [{ service: SERVICE_ID, employee: EMPLOYEE_ID }],
      }),
    ).rejects.toThrow(/spécialité requise/);
  });

  it("accepte une paire service/employé de spécialités identiques", async () => {
    mockedServiceFind.mockResolvedValue([
      {
        _id: { toString: () => SERVICE_ID },
        name: "Coupe",
        speciality: "Category1",
        price: 1500,
        duration: 45,
      },
    ]);

    mockedUserFind.mockResolvedValue([
      {
        _id: { toString: () => EMPLOYEE_ID },
        firstName: "Sarah",
        lastName: "Martin",
        speciality: "Category1",
      },
    ]);

    const result = await buildAppointmentSnapshot({
      client: CLIENT_ID,
      services: [{ service: SERVICE_ID, employee: EMPLOYEE_ID }],
    });

    expect(result.serviceSnapshot).toHaveLength(1);
    expect(result.totalDuration).toBe(45);
    expect(result.estimatedPrice).toBe(1500);
  });

  it("n'applique pas la contrainte sur une prestation sans spécialité définie (donnée héritée)", async () => {
    mockedServiceFind.mockResolvedValue([
      {
        _id: { toString: () => SERVICE_ID },
        name: "Ancienne prestation",
        speciality: undefined,
        price: 800,
        duration: 20,
      },
    ]);

    mockedUserFind.mockResolvedValue([
      {
        _id: { toString: () => EMPLOYEE_ID },
        firstName: "Sarah",
        lastName: "Martin",
        speciality: "Category1",
      },
    ]);

    const result = await buildAppointmentSnapshot({
      client: CLIENT_ID,
      services: [{ service: SERVICE_ID, employee: EMPLOYEE_ID }],
    });

    expect(result.serviceSnapshot).toHaveLength(1);
  });
});
