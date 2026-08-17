import { useCallback, useEffect, useState } from "react";

import { getTickets, cancelTicket } from "../api/ticket.api";

import type { Ticket, TicketStatus } from "../types/ticket";

type UseTicketsOptions = {
  autoLoad?: boolean;
};

const useTickets = ({ autoLoad = true }: UseTicketsOptions = {}) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | TicketStatus>("all");

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTickets();

      setTickets(data);
    } catch (error) {
      console.error("[Tickets]", error);
      setError("Impossible de charger les tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autoLoad) return;

    const timer = setTimeout(() => {
      void loadTickets();
    }, 0);

    return () => clearTimeout(timer);
  }, [autoLoad, loadTickets]);

  const filteredTickets = tickets.filter((ticket) => {
    const value = search.toLowerCase().trim();

    const client =
      typeof ticket.client === "object"
        ? `${ticket.client.firstName} ${ticket.client.lastName}`
        : "";

    const matchSearch =
      !value ||
      ticket.ticketNumber.toLowerCase().includes(value) ||
      client.toLowerCase().includes(value);

    const matchStatus = status === "all" || ticket.status === status;

    return matchSearch && matchStatus;
  });

  const handleCancel = async (ticketId: string) => {
    try {
      const updated = await cancelTicket(ticketId);

      setTickets((prev) =>
        prev.map((ticket) => (ticket._id === updated._id ? updated : ticket)),
      );

      if (selectedTicket?._id === updated._id) {
        setSelectedTicket(updated);
      }
    } catch (error) {
      console.error("[Cancel Ticket]", error);
      setError("Impossible d'annuler le ticket");
    }
  };

  const reset = () => {
    setSearch("");
    setStatus("all");
    setSelectedTicket(null);
  };

  return {
    tickets,
    filteredTickets,

    selectedTicket,
    setSelectedTicket,

    search,
    setSearch,

    status,
    setStatus,

    loading,
    error,

    loadTickets,
    handleCancel,
    reset,
  };
};

export default useTickets;
