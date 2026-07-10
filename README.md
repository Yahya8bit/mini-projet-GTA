# Mini-Projet GTA — Site Builder

Petite application web permettant de configurer visuellement une page d'accueil : une bannière et 4 colonnes (image + texte), modifiables via une interface d'administration, avec un aperçu en direct.

## Stack technique

| Partie | Technologies |
|---|---|
| Backend | Django, Django REST Framework, SQLite |
| Frontend | Next.js, TypeScript, Tailwind CSS, shadcn/ui |
| Déploiement | Docker & Docker Compose |

## Architecture

```
mini-projet-GTA/
├── docker-compose.yaml
├── backend/                 # API Django REST
│   ├── config/              # settings, urls
│   └── sitebuilder/         # app principale
│       ├── models.py        # SiteConfig 
│       ├── serializers.py
│       ├── views.py         # GET / PUT /api/config/
│       └── management/commands/reset_config.py
└── frontend/                # Next.js
    └── app/
        ├── settings/        # formulaire d'édition (bannière + 4 colonnes)
        └── preview/         # aperçu du site configuré
```

Le backend expose une seule configuration de site (modèle `SiteConfig`, créé automatiquement au premier accès). Le frontend la lit et la modifie via l'API.

## API

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/config/` | Récupère la configuration (bannière + colonnes) |
| `PUT` | `/api/config/` | Met à jour la configuration |

Champs : `banner`, puis pour chaque colonne `i` de 1 à 4 : `col{i}_image` (fichier) et `col{i}_text` (texte, 500 caractères max).

Les images uploadées sont servies via `/media/`. Grâce à `django-cleanup`, les anciennes images sont supprimées automatiquement lorsqu'elles sont remplacées.

## Lancement avec Docker (recommandé)

```bash
docker compose up --build
```

- Frontend : http://localhost:3000
- Backend (API) : http://localhost:8000/api/config/

Les images uploadées (`backend/media/`) et la base SQLite (`backend/db.sqlite3`) sont persistées sur l'hôte via des volumes.


## Lancement manuel (développement)

### Backend

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Définir `NEXT_PUBLIC_API_URL=http://localhost:8000` (fichier `.env.local`) pour que le frontend atteigne l'API en développement local.

## Utilisation

1. Ouvrir http://localhost:3000/settings
2. Choisir une bannière et remplir les 4 colonnes (image + texte)
3. Cliquer sur **Enregistrer** → redirection vers `/preview` qui affiche le site configuré

## Commandes utiles

Réinitialiser la configuration et supprimer les images uploadées :

```bash
python manage.py reset_config
# ou avec Docker :
docker compose exec backend python manage.py reset_config
```

## Limitations rencontrées 

- Aucune authentification sur l'API : n'importe qui peut modifier la configuration (`dev only`).
- `ALLOWED_HOSTS = ["*"]` et serveur de développement Django — non adapté à la production.

