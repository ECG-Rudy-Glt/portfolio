# Portfolio - Rudy Gault

Portfolio personnel construit avec [Astro](https://astro.build), présentant le parcours, les compétences, les projets école/perso et la mission d'alternance.

## Stack

- **Astro 7** (rendu statique)
- **React** pour les îles interactives (filtre de projets, toggle de thème)
- **Tailwind CSS v4**
- **Framer Motion** pour les animations
- **Content Collections** pour le contenu des projets

## Structure

```
src/
├── content/projects/    # une fiche Markdown par projet (frontmatter = stack, tags, liens...)
├── content.config.ts    # schéma de la collection "projects"
├── components/          # Nav, ProjectCard, ThemeToggle (React), ProjectFilter (React)
├── layouts/Layout.astro # layout commun (head, nav, footer, anti-flash thème)
└── pages/
    ├── index.astro       # accueil
    ├── parcours.astro    # parcours en 2 branches (alternance / école-projets)
    ├── competences.astro # agrégation des tags de tous les projets, en graphique
    ├── projets/
    │   ├── index.astro    # liste filtrable
    │   └── [slug].astro   # détail d'un projet
    └── blog/
        ├── index.astro    # liste des articles et relais LinkedIn
        └── [slug].astro   # détail d'un article (pas pour les relais LinkedIn)
```

Les dossiers `projets_ecole/`, `projet_perso/` et `projetsCT/` à la racine ne font pas partie du site : c'est la matière brute (anciens repos, README, rapports) qui a servi à rédiger le contenu de `src/content/projects/`. Ils sont exclus du build Docker (`.dockerignore`).

## Ajouter un projet

Créer un fichier `src/content/projects/mon-projet.md` :

```md
---
title: "Titre du projet"
category: perso # perso | ecole | entreprise
summary: "Résumé en une phrase."
period: "2025"
role: "Solo / équipe de N / alternance"
stack: ["Tech1", "Tech2"]
tags: ["Tag1", "Tag2"]
links:
  demo: "https://..."   # optionnel
  repo: "https://..."   # optionnel
images: ["/projets/mon-projet/screenshot.png"] # optionnel, voir public/projets/
featured: false
groupProject: false
contributors: []
order: 99
---

## Contenu en Markdown
```

Les images associées vont dans `public/projets/<slug>/`.

## Ajouter un article de blog

Créer un fichier `src/content/articles/mon-article.md` :

```md
---
title: "Titre de l'article"
summary: "Résumé en une phrase."
date: 2025-09-12
tags: ["Homelab", "Sécurité"]
type: article # article | linkedin
---

## Contenu en Markdown
```

Pour relayer un post LinkedIn plutôt qu'écrire un article complet, mettre `type: linkedin` et ajouter `externalUrl: "https://www.linkedin.com/posts/..."` - la carte sur `/blog/` ouvrira directement le post LinkedIn dans un nouvel onglet, sans page de détail locale.

## Développement

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # build statique dans dist/
npm run preview   # sert le build statique
```

## Déploiement (Docker + nginx)

```sh
docker compose up --build
```

Sert le site sur `http://localhost:8080`. Le `Dockerfile` est un build multi-stage : `node:22-alpine` pour `npm install && npm run build`, puis `nginx:1.27-alpine` pour servir le contenu statique de `dist/` (config dans `nginx.conf`).

Destiné à être déployé sur le homelab via CI/CD Forgejo.

## À faire (plus tard)

- **Sandbox de projets** : choisir 2-3 projets supplémentaires (en plus de SUPCHAT et SUPFile déjà live) à conteneuriser et exposer en démo via Traefik sur le homelab, accessibles depuis les fiches projet (`links.sandbox`). Candidats à évaluer : 4AGQL-PROJ, 3DOKR, 4WEBD-TICKET.
