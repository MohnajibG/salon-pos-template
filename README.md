# Flowdesk — POS & gestion pour commerce avec rendez-vous

Template générique d'application de gestion : rendez-vous, caisse, employés,
services, dépenses, administration. Pensé pour être adapté à n'importe quel
commerce fonctionnant par rendez-vous/prestations (atelier, cabinet, studio,
boutique de services, etc.), sans dépendre d'un secteur d'activité en
particulier.

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

Ce dépôt part volontairement d'un design minimal, neutre (sarcelle/ardoise,
polices système, pas de photos), prêt à être personnalisé :

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
- **Favicon** : logo générique (carré sarcelle) dans `Frontend/public/favicon.png`.

## Textes génériques par défaut

Tout le texte visible est générique, sans référence à un secteur d'activité
particulier :

- La page publique (`Frontend/src/components/home/*`) utilise un texte de
  présentation neutre ("Service 1/2/3", "Nos réalisations"...) à remplacer
  par la description réelle de l'activité.
- Les "spécialités" employés/services (menu déroulant dans la fiche employé,
  filtre services) affichent désormais des libellés génériques
  ("Spécialité 1", "Spécialité 2"...) au lieu de "Coiffure / Onglerie /
  Maquillage...". À renommer dans `Frontend/src/types/speciality.ts`
  (`SPECIALITY_LABELS`) — un seul fichier à modifier, tout le reste du
  Frontend suit automatiquement (partout où une spécialité est affichée,
  le libellé passe par cette même source).
  > Les clés internes (désormais `Category1`...`Category6` + `Reception`,
  > plus haut c'était `Hair`/`Nails`/`Makeup`...) sont partagées avec
  > l'`enum` Mongoose du Backend (`Backend/src/models/User.ts`,
  > `Service.ts`, et les validations dans `services/employee.service.ts` /
  > `service.service.ts`). Elles ont été renommées **des deux côtés** pour
  > rester cohérentes ; si tu ajoutes/retires une spécialité, modifie-la
  > aux mêmes 6 endroits (4 Backend + `types/speciality.ts` +
  > `types/employee.ts`/`service.ts`/`appointment.ts` côté Frontend).
- Adresse/téléphone de contact remplacés par des placeholders
  (`Frontend/src/components/home/{Contact,Footer}.tsx`).
- Devise centralisée dans `Frontend/src/config/currency.ts`
  (`CURRENCY_LABEL`, `formatMoney()`) — elle était codée en dur ("DA",
  Dinar algérien) dans plus de 80 endroits du Frontend ; un seul fichier
  à modifier pour changer de devise. Côté Backend, `Service.currency`
  n'est plus limité à `"DZD"` (le champ accepte n'importe quelle valeur,
  `"DZD"` reste la valeur par défaut).
- Préfixe des numéros de ticket générique (`TCK-2026-000123` au lieu de
  `AK-2026-000123`) dans `Backend/src/services/ticket.service.ts`.
- Les deux anciens scripts de seed de données de démo (ni l'un ni l'autre
  appelés par l'app) ont été supprimés : catalogue figé lié à une activité
  précise, sans valeur de départ pour un autre commerce.

## Personnaliser pour un nouveau commerce

Le nom "Flowdesk" est un nom générique de remplacement, à changer avant toute mise
en production. Points à modifier :

| Quoi | Où |
| --- | --- |
| Titre, meta tags, réseaux sociaux | `Frontend/index.html` |
| Logo / wordmark (header, footer, sidebar, login) | `Frontend/src/components/home/{Header,Footer,Hero}.tsx`, `Frontend/src/layouts/{Admin,Cashier,Employee}Layout.tsx`, `Frontend/src/pages/auth/Login.tsx` |
| Textes de présentation (à propos, pourquoi nous choisir, services, témoignages, contact) | `Frontend/src/components/home/{About,WhyChooseUs,Services,Testimonials,Contact}.tsx` |
| Libellés des spécialités employés/services | `Frontend/src/types/speciality.ts` (voir aussi la note "spécialités" ci-dessus pour le Backend) |
| Couleurs / polices / design system | `Frontend/src/index.css` |
| Photos (hero, galerie, à propos, login) | voir section "Design basique" ci-dessus |
| Favicon | `Frontend/public/favicon.png` |
| Devise | `Frontend/src/config/currency.ts` (+ `Backend/src/models/Service.ts` si tu veux changer la valeur par défaut) |
| URL de l'API backend | `Frontend/.env` (`VITE_API_URL`) |
| Message API / logs serveur | `Backend/src/app.ts`, `Backend/src/server.ts` |
| Compte admin de démo (tests e2e) | `Frontend/.env.e2e.example`, `Frontend/tests/e2e/helpers/auth.ts` |

