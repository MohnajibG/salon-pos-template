import mongoose from "mongoose";

import { env } from "../src/config/env";
import Category from "../src/models/Category";
import Service, { ServiceSpeciality } from "../src/models/Service";

interface RawService {
  name: string;
  description?: string;
  price?: number;
  priceMin?: number;
  priceMax?: number;
  extraPrice?: number;
}

interface RawCategory {
  category: string;
  services: RawService[];
}

const DATA: RawCategory[] = [
  {
    category: "Épilation",
    services: [
      { name: "Maillot intégral", price: 3000 },
      { name: "Aisselles", price: 500 },
      { name: "Sourcils", price: 500 },
      { name: "Moustache + menton", price: 500 },
      { name: "Visage complet", price: 1200 },
      { name: "Bras complet", price: 1500 },
      { name: "Jambe complète", price: 1800 },
      { name: "Demi jambe", price: 900 },
      { name: "Demi bras", price: 800 },
      { name: "Dos complet", price: 1000 },
      { name: "Ventre complet", price: 800 },
      { name: "Corps complet", price: 8000 },
    ],
  },
  {
    category: "Pédicure - Produits locaux",
    services: [
      {
        name: "Pack 1 - Sans paraffine",
        description: "Peeling + gommage + masque",
        price: 3500,
      },
      {
        name: "Pack 2 - Avec paraffine",
        description: "Peeling + gommage + masque + paraffine",
        price: 4500,
      },
      {
        name: "Pack 3 - Avec appareil massant",
        description: "Peeling + gommage + appareil massant + masque",
        price: 5000,
      },
    ],
  },
  {
    category: "Pédicure - Produits d'importation",
    services: [
      {
        name: "Pack 1 - Sans paraffine",
        description: "Peeling Thuya + masque Thuya + gommage Thuya",
        price: 5000,
      },
      {
        name: "Pack 2 - Avec paraffine",
        description:
          "Peeling Thuya + masque Thuya + gommage Thuya + paraffine",
        price: 6000,
      },
      {
        name: "Pack 3 - Avec appareil massant",
        description:
          "Peeling Thuya + masque Thuya + gommage Thuya + appareil massant",
        price: 6500,
      },
    ],
  },
  {
    category: "Coiffure & Beauté",
    services: [
      { name: "Brushing", priceMin: 500, priceMax: 2000 },
      { name: "Coiffure", priceMin: 2000, priceMax: 5000 },
      { name: "Makeup", priceMin: 2000, priceMax: 4000 },
      { name: "Coupe", description: "Sans brushing", price: 500 },
      { name: "Application couleur", price: 500 },
      { name: "Application soin", priceMin: 5000 },
    ],
  },
  {
    category: "Soin visage",
    services: [
      {
        name: "Soin Basic Osmoclean",
        description: "Nettoie en douceur et ravive l'éclat",
        price: 3500,
      },
      {
        name: "Soin Éclaircissant",
        description: "Illumine le teint et unifie la peau",
        price: 5500,
      },
      {
        name: "Soin Peeling",
        description: "Lisse la peau et affine le grain de peau",
        price: 6500,
      },
      {
        name: "Soin Profond",
        description:
          "Anti-rides, peau mature, hydratant, spécial peau grasse et sensible",
        price: 5000,
      },
      {
        name: "Soin Purifiant",
        description: "Soin cocoon + soin detox",
        price: 4500,
      },
    ],
  },
  {
    category: "Onglerie",
    services: [
      { name: "Pose capsule", price: 4000 },
      { name: "Remplissage", price: 3500 },
      { name: "Vernis permanent main", price: 3000 },
      { name: "Vernis permanent pied", price: 3000 },
      { name: "French Baby Bommer", extraPrice: 500 },
      { name: "Nail Art", priceMin: 500 },
    ],
  },
];

const DEFAULT_DURATION = 60;

const CATEGORY_SPECIALITY: Record<string, ServiceSpeciality> = {
  Épilation: "Waxing",
  "Pédicure - Produits locaux": "Nails",
  "Pédicure - Produits d'importation": "Nails",
  "Coiffure & Beauté": "Hair",
  "Soin visage": "Skincare",
  Onglerie: "Nails",
};

const SERVICE_SPECIALITY_OVERRIDE: Record<string, ServiceSpeciality> = {
  Makeup: "Makeup",
};

const resolveSpeciality = (
  categoryName: string,
  serviceName: string,
): ServiceSpeciality => {
  return (
    SERVICE_SPECIALITY_OVERRIDE[serviceName] ??
    CATEGORY_SPECIALITY[categoryName]
  );
};

const resolvePriceAndDescription = (
  svc: RawService,
): { price: number; description: string } => {
  const base = svc.description ?? "";

  if (svc.price !== undefined) {
    return { price: svc.price, description: base };
  }

  if (svc.priceMin !== undefined && svc.priceMax !== undefined) {
    const note = `À partir de ${svc.priceMin} DA, jusqu'à ${svc.priceMax} DA`;
    return {
      price: svc.priceMin,
      description: base ? `${base} — ${note}` : note,
    };
  }

  if (svc.priceMin !== undefined) {
    const note = `À partir de ${svc.priceMin} DA`;
    return {
      price: svc.priceMin,
      description: base ? `${base} — ${note}` : note,
    };
  }

  if (svc.extraPrice !== undefined) {
    const note = `Supplément de ${svc.extraPrice} DA`;
    return {
      price: svc.extraPrice,
      description: base ? `${base} — ${note}` : note,
    };
  }

  throw new Error(`Aucun prix trouvé pour le service "${svc.name}"`);
};

const run = async () => {
  if (!env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  await mongoose.connect(env.MONGO_URI);
  console.log("✅ MongoDB Connected");

  let createdCategories = 0;
  let createdServices = 0;
  let updatedServices = 0;

  for (const rawCategory of DATA) {
    let category = await Category.findOne({ name: rawCategory.category });

    if (!category) {
      category = await Category.create({ name: rawCategory.category });
      createdCategories += 1;
      console.log(`+ Catégorie créée : ${rawCategory.category}`);
    }

    for (const rawService of rawCategory.services) {
      const speciality = resolveSpeciality(
        rawCategory.category,
        rawService.name,
      );
      const { price, description } = resolvePriceAndDescription(rawService);

      const existing = await Service.findOne({
        name: rawService.name,
        category: category._id,
      });

      if (existing) {
        existing.set({
          description,
          speciality,
          price,
          duration: DEFAULT_DURATION,
        });
        await existing.save();
        updatedServices += 1;
        console.log(`~ Service mis à jour : ${rawService.name}`);
      } else {
        await Service.create({
          name: rawService.name,
          description,
          category: category._id,
          speciality,
          price,
          duration: DEFAULT_DURATION,
        });
        createdServices += 1;
        console.log(`+ Service créé : ${rawService.name} (${price} DA)`);
      }
    }
  }

  console.log("\nRésumé :");
  console.log(`  Catégories créées : ${createdCategories}`);
  console.log(`  Services créés    : ${createdServices}`);
  console.log(`  Services mis à jour : ${updatedServices}`);

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("❌ Échec du seed :", error);
  process.exit(1);
});
