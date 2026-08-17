/**
 * Import ponctuel du catalogue de prestations fourni par le client.
 *
 * Les durées ci-dessous sont des ESTIMATIONS par prestation (le fichier
 * source n'en fournissait aucune, alors que le schéma Service l'exige pour
 * calculer les créneaux de rendez-vous). Idem pour les prix en fourchette :
 * on enregistre le prix minimum et on précise l'écart dans la description.
 * À ajuster depuis Admin > Services si besoin.
 *
 * Usage : npx tsx src/scripts/seedSalonCatalog.ts
 */
import mongoose from "mongoose";

import { connectDB } from "../config/db";
import User from "../models/User";
import Category from "../models/Category";
import Service, { ServiceSpeciality } from "../models/Service";

interface SeedService {
  name: string;
  description?: string;
  price: number;
  duration: number;
}

interface SeedCategory {
  category: string;
  speciality: ServiceSpeciality;
  services: SeedService[];
}

const catalog: SeedCategory[] = [
  {
    category: "Épilation",
    speciality: "Waxing",
    services: [
      { name: "Maillot intégral", price: 3000, duration: 20 },
      { name: "Aisselles", price: 500, duration: 15 },
      { name: "Sourcils", price: 500, duration: 15 },
      { name: "Moustache + menton", price: 500, duration: 15 },
      { name: "Visage complet", price: 1200, duration: 20 },
      { name: "Bras complet", price: 1500, duration: 30 },
      { name: "Jambe complète", price: 1800, duration: 45 },
      { name: "Demi jambe", price: 900, duration: 30 },
      { name: "Demi bras", price: 800, duration: 20 },
      { name: "Dos complet", price: 1000, duration: 30 },
      { name: "Ventre complet", price: 800, duration: 20 },
      { name: "Corps complet", price: 8000, duration: 90 },
    ],
  },
  {
    category: "Pédicure - Produits locaux",
    speciality: "Nails",
    services: [
      {
        name: "Pack 1 - Sans paraffine",
        description: "Peeling + gommage + masque",
        price: 3500,
        duration: 45,
      },
      {
        name: "Pack 2 - Avec paraffine",
        description: "Peeling + gommage + masque + paraffine",
        price: 4500,
        duration: 60,
      },
      {
        name: "Pack 3 - Avec appareil massant",
        description: "Peeling + gommage + appareil massant + masque",
        price: 5000,
        duration: 60,
      },
    ],
  },
  {
    category: "Pédicure - Produits d'importation",
    speciality: "Nails",
    services: [
      {
        name: "Pack 1 - Sans paraffine",
        description: "Peeling Thuya + masque Thuya + gommage Thuya",
        price: 5000,
        duration: 45,
      },
      {
        name: "Pack 2 - Avec paraffine",
        description:
          "Peeling Thuya + masque Thuya + gommage Thuya + paraffine",
        price: 6000,
        duration: 60,
      },
      {
        name: "Pack 3 - Avec appareil massant",
        description:
          "Peeling Thuya + masque Thuya + gommage Thuya + appareil massant",
        price: 6500,
        duration: 60,
      },
    ],
  },
  {
    category: "Coiffure & Beauté",
    speciality: "Hair",
    services: [
      {
        name: "Brushing",
        description: "Tarif à partir de 500 DA (jusqu'à 2000 DA selon la longueur/prestation)",
        price: 500,
        duration: 30,
      },
      {
        name: "Coiffure",
        description: "Tarif à partir de 2000 DA (jusqu'à 5000 DA selon la prestation)",
        price: 2000,
        duration: 60,
      },
      { name: "Coupe", description: "Sans brushing", price: 500, duration: 30 },
      {
        name: "Application couleur",
        price: 500,
        duration: 90,
      },
      {
        name: "Application soin",
        description: "Tarif à partir de 5000 DA selon le soin appliqué",
        price: 5000,
        duration: 30,
      },
    ],
  },
  {
    category: "Coiffure & Beauté",
    speciality: "Makeup",
    services: [
      {
        name: "Makeup",
        description: "Tarif à partir de 2000 DA (jusqu'à 4000 DA selon la prestation)",
        price: 2000,
        duration: 45,
      },
    ],
  },
  {
    category: "Soin visage",
    speciality: "Skincare",
    services: [
      {
        name: "Soin Basic Osmoclean",
        description: "Nettoie en douceur et ravive l'éclat",
        price: 3500,
        duration: 45,
      },
      {
        name: "Soin Éclaircissant",
        description: "Illumine le teint et unifie la peau",
        price: 5500,
        duration: 60,
      },
      {
        name: "Soin Peeling",
        description: "Lisse la peau et affine le grain de peau",
        price: 6500,
        duration: 45,
      },
      {
        name: "Soin Profond",
        description:
          "Anti-rides, peau mature, hydratant, spécial peau grasse et sensible",
        price: 5000,
        duration: 60,
      },
      {
        name: "Soin Purifiant",
        description: "Soin cocoon + soin detox",
        price: 4500,
        duration: 45,
      },
    ],
  },
  {
    category: "Onglerie",
    speciality: "Nails",
    services: [
      { name: "Pose capsule", price: 4000, duration: 60 },
      { name: "Remplissage", price: 3500, duration: 45 },
      { name: "Vernis permanent main", price: 3000, duration: 45 },
      { name: "Vernis permanent pied", price: 3000, duration: 45 },
      {
        name: "French Baby Bommer",
        description:
          "Supplément appliqué en complément d'une pose ou d'un remplissage",
        price: 500,
        duration: 15,
      },
      {
        name: "Nail Art",
        description: "Tarif à partir de 500 DA selon le motif",
        price: 500,
        duration: 30,
      },
    ],
  },
];

const findOrCreateCategory = async (name: string, adminId: string) => {
  const normalized = name.trim();

  const existing = await Category.findOne({
    name: { $regex: new RegExp(`^${normalized}$`, "i") },
    isDeleted: false,
  });

  if (existing) {
    console.log(`  ↳ Catégorie déjà existante : "${normalized}"`);
    return existing;
  }

  const created = await Category.create({
    name: normalized,
    description: "",
    createdBy: adminId,
  });

  console.log(`  ✅ Catégorie créée : "${normalized}"`);
  return created;
};

const run = async () => {
  await connectDB();

  const admin = await User.findOne({ role: "admin", isDeleted: { $ne: true } });

  if (!admin) {
    throw new Error(
      "Aucun compte admin trouvé — impossible de définir createdBy. Abandon.",
    );
  }

  const adminId = admin.id as string;

  let createdServices = 0;
  let skippedServices = 0;

  for (const group of catalog) {
    console.log(`\n📂 ${group.category} (${group.speciality})`);

    const category = await findOrCreateCategory(group.category, adminId);

    for (const svc of group.services) {
      const normalizedName = svc.name.trim();

      const existingService = await Service.findOne({
        category: category._id,
        name: { $regex: new RegExp(`^${normalizedName}$`, "i") },
        isDeleted: false,
      });

      if (existingService) {
        console.log(`  ↳ Déjà existant, ignoré : "${normalizedName}"`);
        skippedServices += 1;
        continue;
      }

      await Service.create({
        name: normalizedName,
        description: svc.description ?? "",
        category: category._id,
        speciality: group.speciality,
        price: svc.price,
        duration: svc.duration,
        createdBy: adminId,
      });

      console.log(
        `  ✅ Service créé : "${normalizedName}" — ${svc.price} DA / ${svc.duration} min`,
      );
      createdServices += 1;
    }
  }

  console.log(
    `\n✨ Terminé : ${createdServices} service(s) créé(s), ${skippedServices} déjà existant(s) ignoré(s).`,
  );

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("❌ Échec de l'import :", error);
  mongoose.disconnect().finally(() => process.exit(1));
});
