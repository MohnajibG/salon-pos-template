# SalonPro — POS & Gestion pour salon / institut de beauté

Copie générique du projet **ANFAL K**, dérebrandée pour servir de base réutilisable :
même code, même fonctionnalités (caisse, dépenses, clients, admin), mais sans le nom
ni les coordonnées d'un salon en particulier. À adapter pour n'importe quel autre
salon (ou tout autre commerce avec un besoin similaire de caisse/gestion).

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
  vraies photos du salon.
- **Favicon** : logo générique (carré bleu) dans `Frontend/public/favicon.png`.

## Personnaliser pour un nouveau salon

Le nom "SalonPro" est un nom générique de remplacement, à changer avant toute mise
en production. Points à modifier :

| Quoi | Où |
| --- | --- |
| Titre, meta tags, réseaux sociaux | `Frontend/index.html` |
| Logo / wordmark (header, footer, sidebar, login) | `Frontend/src/components/home/{Header,Footer,Hero}.tsx`, `Frontend/src/layouts/{Admin,Cashier,Employee}Layout.tsx`, `Frontend/src/pages/auth/Login.tsx` |
| Textes de présentation (à propos, pourquoi nous choisir, témoignages, contact) | `Frontend/src/components/home/{About,WhyChooseUs,Testimonials,Contact}.tsx` |
| Couleurs / polices / design system | `Frontend/src/index.css` |
| Photos (hero, galerie, à propos, login) | voir section "Design basique" ci-dessus |
| Favicon | `Frontend/public/favicon.png` |
| URL de l'API backend | `Frontend/.env` (`VITE_API_URL`) |
| Message API / logs serveur | `Backend/src/app.ts`, `Backend/src/server.ts` |
| Compte admin de démo (tests e2e) | `Frontend/.env.e2e.example`, `Frontend/tests/e2e/helpers/auth.ts` |

## Origine

Basé sur le projet [ANFAL K](https://github.com/MohnajibG/ANFALK), une application
de gestion pour un institut de beauté précis. Cette copie retire le branding
spécifique pour pouvoir être réutilisée ailleurs.
