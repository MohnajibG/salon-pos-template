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
yarn install
yarn dev
```

## Personnaliser pour un nouveau salon

Le nom "SalonPro" est un nom générique de remplacement, à changer avant toute mise
en production. Points à modifier :

| Quoi | Où |
| --- | --- |
| Titre, meta tags, réseaux sociaux | `Frontend/index.html` |
| Logo / wordmark (header, footer, sidebar, login) | `Frontend/src/components/home/{Header,Footer,Hero}.tsx`, `Frontend/src/layouts/{Admin,Cashier,Employee}Layout.tsx`, `Frontend/src/pages/auth/Login.tsx` |
| Textes de présentation (à propos, pourquoi nous choisir, témoignages, contact) | `Frontend/src/components/home/{About,WhyChooseUs,Testimonials,Contact}.tsx` |
| Couleurs / design system | `Frontend/src/index.css` |
| Favicon | `Frontend/public/favicon.png` |
| Message API / logs serveur | `Backend/src/app.ts`, `Backend/src/server.ts` |
| Compte admin de démo (tests e2e) | `Frontend/.env.e2e.example`, `Frontend/tests/e2e/helpers/auth.ts` |

## Origine

Basé sur le projet [ANFAL K](https://github.com/MohnajibG/ANFALK), une application
de gestion pour un institut de beauté précis. Cette copie retire le branding
spécifique pour pouvoir être réutilisée ailleurs.
