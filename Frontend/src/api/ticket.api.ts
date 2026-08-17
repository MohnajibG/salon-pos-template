import api from "./axios";

import type {
  Ticket,
  CreateTicketPayload,
  UpdateTicketPayload,
  PayTicketPayload,
} from "../types/ticket";

const API_URL = "/tickets";

/**
 * Liste des tickets
 *
 * POS / ADMIN
 */
export const getTickets = async (
  params?: Record<string, string | number | boolean>,
): Promise<Ticket[]> => {
  try {
    const { data } = await api.get(API_URL, {
      params,
    });

    return data.tickets ?? [];
  } catch (error) {
    console.error("[Tickets] getTickets:", error);

    throw error;
  }
};

/**
 * Ticket par ID
 */
export const getTicket = async (id: string): Promise<Ticket> => {
  try {
    const { data } = await api.get(`${API_URL}/${id}`);

    return data.ticket;
  } catch (error) {
    console.error("[Tickets] getTicket:", error);

    throw error;
  }
};

/**
 * Création ticket depuis une réservation
 *
 * POS ouvre un rendez-vous terminé
 */
export const createTicketFromAppointment = async (
  appointmentId: string,
): Promise<Ticket> => {
  try {
    const { data } = await api.post(`${API_URL}/appointment/${appointmentId}`);

    return data.ticket;
  } catch (error) {
    console.error("[Tickets] createTicketFromAppointment:", error);

    throw error;
  }
};

/**
 * Création ticket manuel
 *
 * Vente sans réservation
 */
export const createTicket = async (
  payload: CreateTicketPayload,
): Promise<Ticket> => {
  try {
    const { data } = await api.post(API_URL, payload);

    return data.ticket;
  } catch (error) {
    console.error("[Tickets] createTicket:", error);

    throw error;
  }
};

/**
 * Modifier un ticket
 *
 * Modifier prix
 * Ajouter remise
 * Ajouter produit
 */
export const updateTicket = async (
  id: string,
  payload: UpdateTicketPayload,
): Promise<Ticket> => {
  try {
    const { data } = await api.patch(`${API_URL}/${id}`, payload);

    return data.ticket;
  } catch (error) {
    console.error("[Tickets] updateTicket:", error);

    throw error;
  }
};

/**
 * Paiement ticket
 */
export const payTicket = async (
  id: string,
  payload: PayTicketPayload,
): Promise<Ticket> => {
  try {
    const { data } = await api.patch(`${API_URL}/${id}/pay`, payload);

    return data.ticket;
  } catch (error) {
    console.error("[Tickets] payTicket:", error);

    throw error;
  }
};

/**
 * Annuler ticket
 */
export const cancelTicket = async (id: string): Promise<Ticket> => {
  try {
    const { data } = await api.patch(`${API_URL}/${id}/cancel`);

    return data.ticket;
  } catch (error) {
    console.error("[Tickets] cancelTicket:", error);

    throw error;
  }
};
