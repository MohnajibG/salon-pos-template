import { X, Trash2 } from "lucide-react";
import type { Category } from "../../types/category";

interface Props {
  category: Category;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const DeleteCategoryModal = ({
  category,
  loading = false,
  onConfirm,
  onClose,
}: Props) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
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
          Supprimer la catégorie
        </h2>
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-center gap-3 text-red-600">
          <Trash2 size={22} />
          <p className="font-semibold">Confirmer la suppression ?</p>
        </div>

        <p className="mt-3 text-sm text-stone-600">
          Vous êtes sur le point de supprimer :
        </p>

        <p className="mt-1 font-bold">{category.name}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 rounded-2xl border border-(--border) py-3 transition hover:bg-(--cream)"
        >
          Annuler
        </button>

        <button
          disabled={loading}
          onClick={onConfirm}
          className="flex-1 rounded-2xl bg-red-600 py-3 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Suppression..." : "Supprimer"}
        </button>
      </div>
    </div>
  </div>
);

export default DeleteCategoryModal;
