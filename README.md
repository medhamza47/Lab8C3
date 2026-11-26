# Lab 8 — Authentification JWT et autorisation

## Démarrage local

1. Fournir au processus Spring deux variables d’environnement, `EDU_ADMIN_PASSWORD` et `EDU_USER_PASSWORD`. Choisir deux valeurs différentes d’au moins 12 caractères.
2. Dans `backend/`, démarrer le serveur avec Java 17 et `mvn spring-boot:run`.
3. Dans `frontend/`, utiliser Node.js 22.12 ou plus récent sur cette branche. Exécuter `npm install`, puis `npm start` et ouvrir http://localhost:4200.
4. Se connecter avec le nom `admin` ou `user` et le mot de passe correspondant.

## Choix techniques

Le serveur signe des JWT de 15 minutes et valide leur signature, leur expiration et leur émetteur. Il réserve l’API d’administration et l’écriture des fiches au rôle ADMIN. Les gardes Angular gèrent les redirections et la visibilité des liens. L’intercepteur joint le jeton aux requêtes relatives vers l’API et efface la session sur HTTP 401.

Le jeton demeure en mémoire et un rechargement impose une nouvelle connexion. Les affichages Angular utilisent l’interpolation et l’API utilise un en-tête Bearer explicite, sans cookie de session. Un passage à des cookies exige une protection CSRF adaptée. La clé de démonstration est générée au démarrage et les jetons précédents expirent au redémarrage du serveur.

## Tests et déploiement

Les scénarios TestBed couvrent la création et la suppression de la session ainsi que l’erreur de connexion. Ils se lancent depuis `frontend/` avec `npm test` et Chrome disponible.

Depuis `frontend/`, `npm run build` génère les fichiers statiques dans `dist/edu-manager/browser/`. Le fichier `deploy/nginx.conf` donne un exemple de configuration avec repli SPA et proxy API. Déployer les fichiers statiques sous la racine Nginx et publier derrière un point d’entrée HTTPS. Les Nginx et Spring configurés ici communiquent sur le même hôte. Pour une installation distribuée, fournir une clé de signature gérée hors du dépôt et un registre de comptes adapté.
