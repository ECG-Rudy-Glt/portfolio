---
title: "rudy-ops.fr - Site vitrine freelance DevOps/DevSecOps"
category: perso
summary: "Site vitrine et prise de contact pour mon activité freelance (DevOps, Platform Engineering, DevSecOps) : frontend Astro/React, backend Flask avec assistant IA de devis, intégration Vikunja, déployé en CI/CD sur mon homelab."
period: "2026 - en cours"
role: "Conception, développement et déploiement en solo"
stack: ["Astro", "React", "TailwindCSS", "Flask", "Python", "Docker", "Forgejo Actions", "Cloudflare Tunnel", "Gemini API", "Vikunja API"]
tags: ["Full-stack", "IA / Assistant conversationnel", "CI/CD", "SEO", "Freelance"]
links:
  demo: "https://rudy-ops.fr"
images: ["/projets/rudy-ops/freelance-illustration.png"]
featured: true
relevance: "majeur"
order: 0
---

## Le besoin

Lancer mon activité freelance (DevOps, Platform Engineering, DevSecOps) avec un site professionnel plutôt qu'une simple page de contact : présenter les services, un taux journalier transparent, un moyen de prendre rendez-vous, et une manière fiable de capter chaque demande sans qu'elle se perde dans une boîte mail.

## La solution

Un site Astro/React (accueil, services, tarifs, disponibilités, contact) couplé à un backend Flask qui reçoit chaque demande, envoie un accusé de réception au client, une notification à moi (email + Telegram), et crée automatiquement une tâche dans mon instance Vikunja - aucune demande ne se perd, tout devient traçable. En complément du formulaire classique, un assistant IA de devis (API Gemini) pose quelques questions de qualification adaptées au service demandé avant de soumettre la même chaîne de traitement.

## Choix techniques & architecture

- **Frontend** : Astro (rendu statique) + React pour les composants interactifs, TailwindCSS. Déployé comme conteneur Docker aux côtés de ce portfolio, sur le même LXC de mon homelab.
- **Backend** : Flask/Gunicorn, déployé en conteneur séparé. Anti-spam par honeypot, validation stricte de tous les champs (y compris ceux extraits par l'IA - jamais de texte libre non filtré avant l'envoi d'un email ou la création d'une tâche).
- **Assistant IA de devis** : API Interactions de Gemini (tier gratuit), sans état côté serveur Flask - l'historique de conversation vit chez Google, le backend ne relaie que le dernier message. Rendu explicitement optionnel dans le code : son absence de configuration ne doit jamais empêcher le formulaire classique de fonctionner.
- **Intégration Vikunja** : chaque demande (formulaire ou chatbot) devient une tâche dans un projet dédié, via l'API Vikunja déjà utilisée ailleurs dans mon homelab.
- **CI/CD** : Forgejo Actions, deux pipelines (frontend/backend) qui buildent, poussent l'image sur mon registre Docker interne et déploient par SSH - même pattern que ce portfolio.
- **Exposition publique** : Cloudflare Tunnel (connexion sortante uniquement, aucun port ouvert sur mon réseau), DNS et certificats gérés par Cloudflare.
- **SEO** : JSON-LD `ProfessionalService`, sitemap, `robots.txt`, mots-clés ciblés sur mon activité et ma localisation.

## Un vrai incident en le mettant en ligne

Le LXC qui héberge ce portfolio n'était dimensionné que pour lui seul (256 Mo de RAM). Le déploiement de rudy-ops.fr en co-location a saturé la mémoire disponible et fait tomber les deux sites en même temps, pas seulement le nouveau. Diagnostic et correctif appliqués en conditions réelles (RAM remontée, infrastructure resynchronisée) - l'occasion de vérifier concrètement l'impact d'un partage de ressources entre services avant de le faire à plus grande échelle.

## Résultat

Site en ligne sur [rudy-ops.fr](https://rudy-ops.fr), formulaire de contact et assistant de devis fonctionnels, chaque demande tracée automatiquement.
