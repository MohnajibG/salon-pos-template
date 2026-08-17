import { computeOccurrenceDates } from "../recurrence.service";

describe("computeOccurrenceDates", () => {
  const start = new Date("2026-08-04T00:00:00.000Z"); // un mardi

  it("génère exactement `count` occurrences hebdomadaires", () => {
    const dates = computeOccurrenceDates(start, {
      frequency: "weekly",
      count: 4,
    });

    expect(dates).toHaveLength(4);
    expect(dates[0]).toEqual(start);
    expect(dates[1].getTime() - dates[0].getTime()).toBe(7 * 86400000);
    expect(dates[3].getTime() - dates[2].getTime()).toBe(7 * 86400000);
  });

  it("s'arrête à `until` même si moins d'occurrences que prévu", () => {
    const until = new Date("2026-08-15T00:00:00.000Z");

    const dates = computeOccurrenceDates(start, {
      frequency: "weekly",
      until,
    });

    // 04/08, 11/08 -> le 18/08 dépasserait `until`
    expect(dates).toHaveLength(2);
    dates.forEach((date) => expect(date.getTime()).toBeLessThanOrEqual(until.getTime()));
  });

  it("respecte le pas biweekly", () => {
    const dates = computeOccurrenceDates(start, {
      frequency: "biweekly",
      count: 3,
    });

    expect(dates[1].getTime() - dates[0].getTime()).toBe(14 * 86400000);
  });

  it("ne dépasse jamais la borne de sécurité de 52 occurrences", () => {
    const farFuture = new Date("2099-01-01T00:00:00.000Z");

    const dates = computeOccurrenceDates(start, {
      frequency: "weekly",
      until: farFuture,
    });

    expect(dates.length).toBeLessThanOrEqual(52);
  });

  it("renvoie uniquement la date de départ quand count=1", () => {
    const dates = computeOccurrenceDates(start, {
      frequency: "monthly",
      count: 1,
    });

    expect(dates).toEqual([start]);
  });
});
