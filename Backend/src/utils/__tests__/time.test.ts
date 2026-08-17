import {
  timeToMinutes,
  minutesToTime,
  rangesOverlap,
  isPastCalendarDate,
} from "../time";

describe("timeToMinutes", () => {
  it("convertit une heure en minutes depuis minuit", () => {
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("09:30")).toBe(570);
    expect(timeToMinutes("23:59")).toBe(1439);
  });
});

describe("minutesToTime", () => {
  it("convertit des minutes en heure HH:mm", () => {
    expect(minutesToTime(0)).toBe("00:00");
    expect(minutesToTime(570)).toBe("09:30");
    expect(minutesToTime(1439)).toBe("23:59");
  });

  it("est l'inverse de timeToMinutes", () => {
    expect(minutesToTime(timeToMinutes("14:15"))).toBe("14:15");
  });
});

describe("rangesOverlap", () => {
  it("détecte un chevauchement partiel", () => {
    expect(rangesOverlap(60, 120, 90, 150)).toBe(true);
  });

  it("détecte l'absence de chevauchement quand les créneaux se touchent juste", () => {
    expect(rangesOverlap(60, 120, 120, 180)).toBe(false);
  });

  it("détecte l'absence de chevauchement quand les créneaux sont disjoints", () => {
    expect(rangesOverlap(60, 90, 120, 150)).toBe(false);
  });

  it("détecte un chevauchement quand un créneau contient l'autre", () => {
    expect(rangesOverlap(60, 180, 90, 120)).toBe(true);
  });
});

describe("isPastCalendarDate", () => {
  const now = new Date("2026-08-15T10:00:00.000Z");

  it("considère la veille comme passée", () => {
    expect(isPastCalendarDate(new Date("2026-08-14T00:00:00.000Z"), now)).toBe(
      true,
    );
  });

  it("ne considère pas aujourd'hui comme passé, même avant l'heure actuelle", () => {
    expect(isPastCalendarDate(new Date("2026-08-15T00:00:00.000Z"), now)).toBe(
      false,
    );
  });

  it("ne considère pas demain comme passé", () => {
    expect(isPastCalendarDate(new Date("2026-08-16T00:00:00.000Z"), now)).toBe(
      false,
    );
  });
});
