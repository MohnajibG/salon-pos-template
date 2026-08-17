import type { Appointment } from "../../types/appointment";
import { timeToMinutes } from "./dateUtils";

export interface PositionedAppointment {
  appointment: Appointment;
  lane: number;
  laneCount: number;
}

/**
 * Assigne à chaque rendez-vous d'une colonne une "voie" (lane) pour éviter
 * qu'ils se superposent visuellement quand leurs horaires se chevauchent.
 */
export const assignLanes = (
  appointments: Appointment[],
): PositionedAppointment[] => {
  const sorted = [...appointments].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
  );

  const clusters: Appointment[][] = [];
  let currentCluster: Appointment[] = [];
  let clusterEnd = -1;

  for (const appointment of sorted) {
    const start = timeToMinutes(appointment.startTime);
    const end = timeToMinutes(appointment.endTime);

    if (currentCluster.length > 0 && start >= clusterEnd) {
      clusters.push(currentCluster);
      currentCluster = [];
      clusterEnd = -1;
    }

    currentCluster.push(appointment);
    clusterEnd = Math.max(clusterEnd, end);
  }

  if (currentCluster.length > 0) clusters.push(currentCluster);

  const result: PositionedAppointment[] = [];

  for (const cluster of clusters) {
    const laneEndTimes: number[] = [];

    const positioned = cluster.map((appointment) => {
      const start = timeToMinutes(appointment.startTime);
      const end = timeToMinutes(appointment.endTime);

      let lane = laneEndTimes.findIndex((endTime) => endTime <= start);

      if (lane === -1) {
        lane = laneEndTimes.length;
        laneEndTimes.push(end);
      } else {
        laneEndTimes[lane] = end;
      }

      return { appointment, lane };
    });

    const laneCount = laneEndTimes.length;

    for (const item of positioned) {
      result.push({ ...item, laneCount });
    }
  }

  return result;
};
