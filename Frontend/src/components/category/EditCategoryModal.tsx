import { useState } from "react";
import { X } from "lucide-react";
import { updateCategory } from "../../api/category.api";
import type { Category } from "../../types/category";

interface Props {
  category: Category;
  onUpdated: (category: Category) => void;
  onClose: () => void;
}

const EditCategoryModal = ({ category, onUpdated, onClose }: Props) => {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const updated = await updateCategory(category._id, {
        name,
        description,
      });

      onUpdated(updated);
      onClose();
    } catch {
      setError("Impossible de modifier la catégorie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl"
      >
        <button
          type="button"
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
            Modifier la catégorie
          </h2>
        </div>

        {error && (
          <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Nom</label>
            <input
              className="h-11 w-full rounded-2xl border border-(--border) bg-(--cream) px-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full rounded-2xl border border-(--border) bg-(--cream) p-4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-(--black) py-3 text-(--cream) transition hover:bg-(--brown-dark) disabled:opacity-50"
        >
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>
    </div>
  );
};

export default EditCategoryModal;
