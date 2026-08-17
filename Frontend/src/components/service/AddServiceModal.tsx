import { useState } from "react";
import { X } from "lucide-react";

import { createService } from "../../api/service.api";
import ServiceForm from "./ServiceForm";

import type { Category } from "../../types/category";
import type { CreateServicePayload, Service } from "../../types/service";

interface Props {
  categories: Category[];
  onCreated: (service: Service) => void;
  onClose: () => void;
}

const AddServiceModal = ({ categories = [], onCreated, onClose }: Props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (data: CreateServicePayload) => {
    try {
      setLoading(true);
      setError("");

      const service = await createService(data);

      onCreated(service);
      onClose();
    } catch (err) {
      console.error("Erreur création prestation:", err);
      setError("Impossible de créer la prestation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-(--cream)"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-(--brown)">
            Administration
          </p>

          <h2 className="mt-2 font-title text-2xl font-bold text-(--black)">
            Ajouter une prestation
          </h2>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <ServiceForm
          categories={categories}
          loading={loading}
          onSubmit={handleCreate}
        />
      </div>
    </div>
  );
};

export default AddServiceModal;
