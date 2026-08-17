import { createAppointment } from "../appointment.service";

describe("createAppointment - rendez-vous dans le passé", () => {
  it("rejette une date antérieure à aujourd'hui avant toute autre validation", async () => {
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    await expect(
      createAppointment({
        client: "client-1",
        services: [{ service: "service-1", employee: "employee-1" }],
        date: yesterday,
        startTime: "10:00",
        createdBy: "user-1",
      }),
    ).rejects.toThrow(/passé/);
  });
});
