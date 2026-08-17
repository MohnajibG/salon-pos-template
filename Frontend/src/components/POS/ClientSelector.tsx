import { useCallback, useEffect, useState } from "react";
import { User } from "lucide-react";

import { getClients } from "../../api/client.api";

import type { Client } from "../../types/client";
import type { AppointmentClient } from "../../types/appointment";

type Props = {
  selectedClient: Client | AppointmentClient | null;
  search: string;
  setSearch: (value: string) => void;
  setClient: (client: Client | AppointmentClient) => void;
};

const ClientSelector = ({
  selectedClient,
  search,
  setSearch,
  setClient,
}: Props) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);

  const loadClients = useCallback(async () => {
    if (search.trim().length < 2) {
      setClients([]);
      return;
    }

    try {
      setLoading(true);

      const data = await getClients({
        search,
        limit: 5,
      });

      setClients(data.clients);
    } catch (err) {
      console.error("[ClientSelector]", err);
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(loadClients, 300);
    return () => clearTimeout(timer);
  }, [loadClients]);

  return (
    <section className="rounded-3xl border border-(--border) bg-white p-5">
      <label className="text-sm font-semibold">Client</label>

      <div className="mt-3 flex items-center gap-3 rounded-xl border border-(--border) p-3">
        <User size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client..."
          className="w-full outline-none"
        />
      </div>

      {loading && <p className="mt-3 text-sm text-(--muted)">Recherche...</p>}

      {!loading && search.length >= 2 && (
        <div className="mt-3 space-y-2">
          {clients.map((client) => (
            <button
              key={client._id}
              type="button"
              onClick={() => {
                setClient(client);
                setSearch("");
                setClients([]);
              }}
              className="flex w-full justify-between rounded-xl bg-(--surface) p-3 hover:bg-(--cream)"
            >
              <span>
                {client.firstName} {client.lastName}
              </span>
              <span className="text-xs text-(--muted)">{client.phone}</span>
            </button>
          ))}

          {clients.length === 0 && (
            <p className="rounded-xl bg-(--surface) p-3 text-sm text-(--muted)">
              Aucun client trouvé.
            </p>
          )}
        </div>
      )}

      {selectedClient && (
        <div className="mt-3 rounded-xl bg-(--black) p-3 text-(--cream)">
          Client :{" "}
          <strong className="ml-2">
            {selectedClient.firstName} {selectedClient.lastName}
          </strong>
        </div>
      )}
    </section>
  );
};

export default ClientSelector;
