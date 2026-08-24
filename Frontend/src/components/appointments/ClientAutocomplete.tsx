import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, UserRound, X } from "lucide-react";

import { getClients } from "../../api/client.api";

import type { Client } from "../../types/client";

interface Props {
  value?: Client | null;
  onChange: (client: Client | null) => void;
}

const ClientAutocomplete = ({ value, onChange }: Props) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadClients = useCallback(async () => {
    if (search.trim().length < 2) return;

    try {
      setLoading(true);
      setError("");

      const data = await getClients({
        search,
        limit: 10,
      });

      setClients(data.clients);
    } catch (err) {
      console.error("[ClientAutocomplete]", err);
      setError("Impossible de charger les clients.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (!open || search.length < 2) return;

    const timer = setTimeout(loadClients, 300);

    return () => clearTimeout(timer);
  }, [open, search, loadClients]);

  const filteredClients = useMemo(() => {
    if (search.length < 2) return [];

    return clients.filter((client) =>
      `${client.firstName} ${client.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [clients, search]);

  const selectClient = (client: Client) => {
    onChange(client);
    setSearch("");
    setOpen(false);
  };

  const clearClient = () => {
    onChange(null);
    setSearch("");
    setOpen(true);
  };

  return (
    <div className="relative flex flex-col gap-2">
      <label className="text-sm font-semibold text-(--black)">Client</label>

      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-(--champagne)"
        />

        <input
          value={value ? `${value.firstName} ${value.lastName}` : search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);

            if (value) onChange(null);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Rechercher un client..."
          className="h-12 w-full rounded-2xl border border-(--border) bg-white pl-11 pr-12 outline-none focus:border-(--black)"
        />

        {value && (
          <button
            type="button"
            onClick={clearClient}
            className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-(--cream)"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full z-30 mt-2 flex max-h-72 w-full flex-col overflow-hidden rounded-3xl border border-(--border) bg-white shadow-xl">
          {loading && (
            <p className="p-5 text-sm text-stone-500">Recherche...</p>
          )}

          {error && (
            <p className="bg-red-50 p-5 text-sm text-red-700">{error}</p>
          )}

          {!loading &&
            !error &&
            filteredClients.map((client) => (
              <button
                key={client._id}
                type="button"
                onClick={() => selectClient(client)}
                className="flex items-center gap-4 border-b border-(--border) px-5 py-4 text-left hover:bg-(--cream)"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--cream)">
                  <UserRound size={18} />
                </div>

                <div>
                  <p className="font-semibold">
                    {client.firstName} {client.lastName}
                  </p>

                  {client.phone && (
                    <p className="text-xs text-stone-500">{client.phone}</p>
                  )}
                </div>
              </button>
            ))}

          {!loading &&
            !error &&
            search.length >= 2 &&
            filteredClients.length === 0 && (
              <p className="p-5 text-sm text-stone-500">
                Aucun client trouvé.
              </p>
            )}
        </div>
      )}
    </div>
  );
};

export default ClientAutocomplete;
