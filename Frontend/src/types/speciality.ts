import type { Speciality } from "./employee";

export const SPECIALITIES: Speciality[] = [
  "Hair",
  "Nails",
  "Makeup",
  "Massage",
  "Reception",
  "Waxing",
  "Skincare",
];

// Libellés génériques : à remplacer par les postes/spécialités réels de
// votre commerce (ex. "Vente", "Livraison", "Atelier"...). Les clés
// internes (Hair, Nails, etc.) ne sont pas affichées et n'ont pas besoin
// d'être renommées.
export const SPECIALITY_LABELS: Record<Speciality, string> = {
  Hair: "Spécialité 1",
  Nails: "Spécialité 2",
  Makeup: "Spécialité 3",
  Massage: "Spécialité 4",
  Reception: "Accueil",
  Waxing: "Spécialité 5",
  Skincare: "Spécialité 6",
};
