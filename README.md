
# Port de Plaisance – Gestion de catways et réservations

Ce projet est une application web de gestion de "catways" (places de port) et de "réservations" pour un port de plaisance. Elle permet aux utilisateurs de réserver un emplacement et aux administrateurs de gérer les catways et les réservations.  
L'application inclut un espace sécurisé, une API REST et une documentation interactive.

## Fonctionnalités

- Authentification avec sessions et JWT
- Création / modification / suppression de :
  - Utilisateurs
  - Catways
  - Réservations
- Interface publique et tableau de bord privé
- API RESTful documentée avec Swagger et JSDoc
- Tests automatisés (Mocha, Chai)
- Architecture MVC

## Structure du projet

```
PortPlaisanceCef/
│
├── app.js                 # Point d'entrée Express
├── .env.example           # Variables d'environnement
├── controllers/           # Logique des routes
├── models/                # Schémas Mongoose
├── routes/                # Fichiers de routage
├── middleware/            # Auth, erreurs, etc.
├── views/                 # Templates EJS
├── public/                # Fichiers statiques (styles, JS, doc)
├── tests/                 # Tests unitaires (Mocha)
├── docs/                  # Documentation API JSDoc/Swagger
└── package.json
```

## Installation et exécution

### 1. Cloner le projet

```bash
git clone https://github.com/votre-utilisateur/PortPlaisanceCef.git
cd PortPlaisanceCef
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Lancer l'application

```bash
npm run dev
```

Ou en production :

```bash
node app.js
```

Visite ensuite : [http://localhost:5000](http://localhost:5000)

## Connexion MongoDB (MongoDB Atlas)

Utiliser un login et un mot de passe tramsmis pour se connecter à la base de données.

## Documentation API

Une documentation complète est disponible dans l'application :

Accès :  
`http://localhost:5000/docs` (ou via un lien dans le menu principal)

Contenu :
- Vue d'ensemble des endpoints
- Tutoriels pas à pas
- Exemples de requêtes API (POST, GET, DELETE)
- Glossaire des termes utilisés (catway, réservation, JWT...)

## Lancer les tests

```bash
npm test
```

Les tests utilisent :
- Mocha (runner)
- Chai + chai-http (assertions et requêtes API)
- Une base MongoDB locale ou de test (assure-toi que `.env` pointe vers une base isolée pour les tests)

## Technologies utilisées

- Node.js / Express.js
- MongoDB / Mongoose
- EJS (views)
- Bootstrap / CSS
- Mocha / Chai (tests)
- JSDoc / Swagger (documentation)

## Sécurité & Authentification

- Authentification via sessions et middleware JWT
- Rôles gérés côté serveur
- Protection des routes sensibles via `isAuthenticated`

