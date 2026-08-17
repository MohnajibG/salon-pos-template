import { useState } from "react";

import type { CreateServicePayload, Service } from "../../types/service";
import { SPECIALITIES, SPECIALITY_LABELS } from "../../types/speciality";

import type { Category } from "../../types/category";

interface Props {
  categories: Category[];
  initialData?: Service;
  loading?: boolean;
  onSubmit: (data: CreateServicePayload) => void;
}

const ServiceForm = ({
  categories = [],
  initialData,
  loading = false,
  onSubmit,
}: Props) => {
  const [error, setError] = useState("");

  const [form, setForm] = useState<CreateServicePayload>({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price ?? 0,
    duration: initialData?.duration ?? 0,
    category:
      typeof initialData?.category === "object"
        ? initialData.category._id
        : (initialData?.category ?? ""),
    speciality: initialData?.speciality ?? "Hair",
  });

  const updateField = (
    field: keyof CreateServicePayload,
    value: string | number,
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Le nom de la prestation est obligatoire");
      return;
    }

    if (form.price <= 0) {
      setError("Le prix doit être supérieur à 0");
      return;
    }

    if (form.duration <= 0) {
      setError("La durée doit être supérieure à 0");
      return;
    }

    if (!form.category) {
      setError("Veuillez sélectionner une catégorie");
      return;
    }

    if (!form.speciality) {
      setError("Veuillez sélectionner une spécialité");
      return;
    }

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium">
          Nom de la prestation
        </label>
        <input
          className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
          placeholder="Ex. Coupe, Manucure..."
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>
        <textarea
          rows={3}
          className="w-full rounded-2xl border border-(--border) bg-(--cream) p-4"
          placeholder="Description (optionnel)"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="md:flex-1">
          <label className="mb-2 block text-sm font-medium">Prix (DA)</label>
          <input
            className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
            type="number"
            placeholder="Prix"
            value={form.price}
            onChange={(e) => updateField("price", Number(e.target.value))}
          />
        </div>

        <div className="md:flex-1">
          <label className="mb-2 block text-sm font-medium">
            Durée (minutes)
          </label>
          <input
            className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
            type="number"
            placeholder="Durée"
            value={form.duration}
            onChange={(e) => updateField("duration", Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Catégorie</label>
        <select
          className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
        >
          <option value="">Choisir une catégorie</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Spécialité requise
        </label>
        <select
          className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
          value={form.speciality}
          onChange={(e) =>
            updateField(
              "speciality",
              e.target.value as CreateServicePayload["speciality"],
            )
          }
        >
          {SPECIALITIES.map((item) => (
            <option key={item} value={item}>
              {SPECIALITY_LABELS[item]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-2xl bg-(--black) py-3 text-(--cream) transition hover:bg-(--brown-dark) disabled:opacity-50"
      >
        {loading
          ? "Enregistrement..."
          : initialData
            ? "Mettre à jour la prestation"
            : "Enregistrer la prestation"}
      </button>
    </form>
  );
};

export default ServiceForm;
