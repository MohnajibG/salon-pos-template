import { useEffect, useState } from "react";
import { Edit2, Layers, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

import { deleteCategory, getCategories } from "../../api/category.api";
import type { Category } from "../../types/category";

import AddCategoryModal from "../../components/category/AddCategoryModal";
import EditCategoryModal from "../../components/category/EditCategoryModal";
import DeleteCategoryModal from "../../components/category/DeleteCategoryModal";

import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import LoadingState from "../../components/ui/LoadingState";

type ModalType = "add" | "edit" | "delete" | null;

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setCategories(await getCategories());
      } catch (error) {
        console.error("Load categories error:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      setDeleteLoading(true);
      await deleteCategory(selectedCategory._id);
      setCategories((prev) =>
        prev.filter((c) => c._id !== selectedCategory._id),
      );
      setSelectedCategory(null);
      setModal(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const activeCount = categories.filter((c) => c.isActive).length;

  return (
    <div className="w-full space-y-6">
      <PageHeader
        kicker="Administration"
        title="Catégories"
        description="Organisez vos prestations par catégorie."
        icon={<Layers size={24} />}
        action={
          <button
            onClick={() => setModal("add")}
            className="flex items-center gap-2 rounded-2xl bg-(--black) px-5 py-3 text-(--cream) transition hover:bg-(--brown-dark)"
          >
            <Plus size={18} />
            Ajouter une catégorie
          </button>
        }
      />

      <section className="flex flex-wrap gap-4">
        <div className="w-full *:h-full sm:w-[calc(50%-8px)]">
          <StatCard
            icon={Layers}
            title="Total catégories"
            value={categories.length}
            accent="black"
          />
        </div>
        <div className="w-full *:h-full sm:w-[calc(50%-8px)]">
          <StatCard
            icon={Layers}
            title="Catégories actives"
            value={activeCount}
            accent="success"
          />
        </div>
      </section>

      <section className="rounded-3xl border border-(--border) bg-white p-6">
        {loading ? (
          <LoadingState label="Chargement des catégories..." />
        ) : categories.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="Aucune catégorie"
            description="Créez votre première catégorie de services."
          />
        ) : (
          <div className="flex flex-wrap gap-5">
            {categories.map((category) => (
              <motion.article
                key={category._id}
                whileHover={{ y: -4 }}
                className="w-full rounded-2xl border border-(--border) p-5 transition hover:shadow-(--shadow-sm) md:w-[calc(50%-10px)] xl:w-[calc(33.333%-13.333px)]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-(--black)">
                    {category.name}
                  </h3>
                  <Badge variant={category.isActive ? "success" : "danger"}>
                    {category.isActive ? "Actif" : "Inactif"}
                  </Badge>
                </div>

                <p className="mt-3 text-sm text-(--muted)">
                  {category.description || "Aucune description"}
                </p>

                <div className="mt-5 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setModal("edit");
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-(--border) py-2 hover:bg-(--surface)"
                  >
                    <Edit2 size={16} />
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setModal("delete");
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 py-2 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      {modal === "add" && (
        <AddCategoryModal
          onCreated={(c) => setCategories((prev) => [...prev, c])}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "edit" && selectedCategory && (
        <EditCategoryModal
          category={selectedCategory}
          onUpdated={(c) => {
            setCategories((prev) =>
              prev.map((item) => (item._id === c._id ? c : item)),
            );
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}

      {modal === "delete" && selectedCategory && (
        <DeleteCategoryModal
          category={selectedCategory}
          loading={deleteLoading}
          onConfirm={handleDelete}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default Categories;
