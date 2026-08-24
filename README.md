# SalonPro — POS & gestion pour commerce avec rendez-vous

Base générique dérivée du projet **ANFAL K** (à l'origine un institut de beauté) :
même code, mêmes fonctionnalités (rendez-vous, caisse, employés, services,
dépenses, admin), entièrement dérebrandée pour être adaptée à n'importe quel
commerce fonctionnant par rendez-vous/prestations (salon, atelier, cabinet,
studio, etc.) — pas seulement un salon de beauté.

## Stack

- **Frontend** : React 19 + TypeScript + Vite + Tailwind CSS (`/Frontend`)
- **Backend** : Node.js + Express 5 + MongoDB/Mongoose (`/Backend`)

## Démarrage

```bash
# Backend
cd Backend
cp .env.example .env   # renseigner MONGO_URI et JWT_SECRET
yarn install # ou npm install
yarn dev

# Frontend
cd Frontend
cp .env.example .env   # renseigner VITE_API_URL (URL de ton backend)
yarn install
yarn dev
```

## Design "basique" par défaut

Ce dépôt part volontairement d'un design minimal, neutre (bleu/gris, polices
système, pas de photos), prêt à être personnalisé :

- **Couleurs** : une seule palette neutre dans `Frontend/src/index.css` (`:root`
  + `.role-cashier` / `.role-employee`). Changer les valeurs hex suffit à
  retéinter toute l'application, aucun autre fichier à toucher.
- **Polices** : polices système (aucune dépendance externe à Google Fonts).
- **Images** : les photos d'origine ont été retirées. La page d'accueil et
  l'écran de connexion utilisent des dégradés/placeholders génériques
  (`Frontend/src/components/home/Hero.tsx`, `.../Gallery.tsx`,
  `.../About.tsx`, `Frontend/src/pages/auth/Login.tsx`,
  `Frontend/src/components/ui/ImagePlaceholder.tsx`) — à remplacer par de
  vraies photos.
- **Favicon** : logo générique (carré bleu) dans `Frontend/public/favicon.png`.

## Textes génériques par défaut

Tout le texte visible a été dérebrandé pour ne plus être spécifique à un
institut de beauté :

- La page publique (`Frontend/src/components/home/*`) utilise un texte de
  présentation neutre ("Service 1/2/3", "Nos réalisations"...) à remplacer
  par la description réelle de l'activité.
- Les "spécialités" employés/services (menu déroulant dans la fiche employé,
  filtre services) affichent désormais des libellés génériques
  ("Spécialité 1", "Spécialité 2"...) au lieu de "Coiffure / Onglerie /
  Maquillage...". À renommer dans `Frontend/src/types/speciality.ts`
  (`SPECIALITY_LABELS`) — un seul fichier à modifier, tout le reste de
  l'app suit automatiquement.
  > Les valeurs internes (`Hair`, `Nails`, `Massage`...) ne sont, elles, pas
  > affichées : ce sont de simples clés techniques partagées avec le schéma
  > MongoDB du Backend (`Backend/src/models/User.ts` et `Service.ts`). Les
  > renommer demanderait de modifier le Backend en parallèle — volontairement
  > non fait ici pour ne rien casser.
- Adresse/téléphone de contact remplacés par des placeholders
  (`Frontend/src/components/home/{Contact,Footer}.tsx`).

## Personnaliser pour un nouveau commerce

Le nom "SalonPro" est un nom générique de remplacement, à changer avant toute mise
en production. Points à modifier :

| Quoi | Où |
| --- | --- |
| Titre, meta tags, réseaux sociaux | `Frontend/index.html` |
| Logo / wordmark (header, footer, sidebar, login) | `Frontend/src/components/home/{Header,Footer,Hero}.tsx`, `Frontend/src/layouts/{Admin,Cashier,Employee}Layout.tsx`, `Frontend/src/pages/auth/Login.tsx` |
| Textes de présentation (à propos, pourquoi nous choisir, services, témoignages, contact) | `Frontend/src/components/home/{About,WhyChooseUs,Services,Testimonials,Contact}.tsx` |
| Libellés des spécialités employés/services | `Frontend/src/types/speciality.ts` |
| Couleurs / polices / design system | `Frontend/src/index.css` |
| Photos (hero, galerie, à propos, login) | voir section "Design basique" ci-dessus |
| Favicon | `Frontend/public/favicon.png` |
| URL de l'API backend | `Frontend/.env` (`VITE_API_URL`) |
| Message API / logs serveur | `Backend/src/app.ts`, `Backend/src/server.ts` |
| Compte admin de démo (tests e2e) | `Frontend/.env.e2e.example`, `Frontend/tests/e2e/helpers/auth.ts` |
| Données de démo (catalogue services) | `Backend/src/scripts/seedSalonCatalog.ts` (script optionnel, contient encore des exemples orientés beauté) |

## Origine

Basé sur le projet [ANFAL K](https://github.com/MohnajibG/ANFALK), une application
de gestion pour un institut de beauté précis. Cette copie retire le branding
et le texte spécifiques pour pouvoir être réutilisée pour un autre type de
commerce.
