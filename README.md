# Trackdechets-statistiques-publiques

Statistiques Publiques Trackdéchets

Dépôt de code du projet **Trackdéchets Statistiques Publiques** incubé à la Fabrique Numérique du Ministère de la
Transition Écologique.

## Prérequis:

- Une instance de prosgresql récente
- Python >= 3.10 avec pipenv


## Installation

Initialisation et activation d'un environnement

```
$ pipenv shell
```

### Installation des dépendances

```
$ pipenv install -d
```

### Variable d'environnement

2 db sont nécessaires:

- DATABASE_URL, managée par django, pour les comptes, les données calculées etc.
- WAREHOUSE_URL, en lecture seule, contenant un dump des données du data warehouse Trackdéchets

Se référer au fichier src/env.dist

### Setup de la db

Lancer la commande de migration:

```
    $ manage.py migrate
```

## Créer un super utilisateur

```
    $ manage.py createsuperuser
```

### Générer les graphes

Cette commande génére les statistiques pour l'année courante et l'année précédente.

```
    $ manage.py build_stats
```

### Lancement de l'application

```
    $ manage.py runserver
```

### Linting (python + templates)

Utiliser :

```
    $ ./lint.sh
```

### Docker

Créer un .env à la racine contenant la viable WAREHOUSE_URL

```
    docker compose build
    docker compose run web python manage.py migrate 
```

Pour la comamnde build stats vous aurez besoin d'un tunnel ssh (demander à un dev)
Créer les stats
```
   docker compose run web python manage.py build_stats 
```


```
    docker compose up
```
Le serveur est accessible sur localhost:8000

## Licence

Le code source du logiciel est publié sous licence [MIT](https://fr.wikipedia.org/wiki/Licence_MIT).
