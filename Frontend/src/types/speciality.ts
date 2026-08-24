import type { Speciality } from "./employee";

export const SPECIALITIES: Speciality[] = [
  "Category1",
  "Category2",
  "Category3",
  "Category4",
  "Reception",
  "Category5",
  "Category6",
];

// Libellés génériques : à remplacer par les postes/spécialités réels de
// votre commerce (ex. "Vente", "Livraison", "Atelier"...). Les clés
// internes (Category1, Category2, etc.) ne sont pas affichées et n'ont
// pas besoin d'être renommées.
export const SPECIALITY_LABELS: Record<Speciality, string> = {
  Category1: "Spécialité 1",
  Category2: "Spécialité 2",
  Category3: "Spécialité 3",
  Category4: "Spécialité 4",
  Reception: "Accueil",
  Category5: "Spécialité 5",
  Category6: "Spécialité 6",
};
