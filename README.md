# Asyzys

Asyzys est un hub immersif qui rapproche les développeurs et leurs communautés autour d'applications créatives. Ce dépôt contient une expérience front-end complète (HTML, CSS, JavaScript) alimentée par une base SQLite embarquée via `sql.js`.

## Fonctionnalités clés

- **Catalogue d'applications** : navigation par catégories (Éducation, Jeux, Musique, etc.), fiches détaillées avec notes, likes, commentaires et croquis UI.
- **Profils développeurs** : bios enrichies, abonnements, portfolio, GitHub et liste d'applications publiées.
- **Inscription unifiée** : une page pour les utilisateurs et développeurs avec validation des conditions d'utilisation et collecte d'informations complètes.
- **Base de données persistée dans le navigateur** : simulation SQLite embarquée, données synchronisées dans `localStorage` pour conserver les inscriptions, avis et likes.
- **Expérience UI** : design responsive aligné sur le logo Asyzys, animations, transitions et CTA engageants.

## Démarrage

1. Servez le dossier à l'aide de n'importe quel serveur statique (ex. `npx serve`, `python -m http.server`, etc.).
2. Ouvrez `index.html` dans votre navigateur.
3. Toutes les pages partagent la même base de données SQLite embarquée : les créations depuis la page d'inscription apparaissent instantanément dans le catalogue et les profils.

## Technologies

- HTML5 & CSS3 (design responsive, animations, thèmes adaptés au logo).
- JavaScript vanilla (modules structurés par page).
- [sql.js](https://sql.js.org/) pour embarquer une base SQLite côté navigateur.
- Font Awesome via CDN pour la bibliothèque d'icônes.

## Pages principales

- `index.html` : accueil avec les tendances et statistiques en temps réel.
- `apps.html` : catalogue filtrable et partageable.
- `app.html?slug=...` : fiche application type Playstore avec likes et simulations de paiement.
- `developer.html?slug=...` : profil développeur avec abonnements et partage.
- `auth.html` : inscription/connexion unifiée pour utilisateurs et développeurs.
- `about.html` : mission, support et coordonnées (+237694103585).
- `terms.html` : conditions d'utilisation complètes pour l'acceptation lors des inscriptions.

## Personnalisation

Les données initiales (catégories, développeurs, applications, croquis, avis) sont définies dans `assets/js/db.js`. Vous pouvez enrichir ou adapter ces entrées pour refléter vos propres projets.

---
© Asyzys.com — Propulsez vos expériences digitales avec style.
