---
title: "Alternance chez Cloud Temple - Infrastructure & Automatisation"
category: entreprise
summary: "Alternance de 3 ans chez Cloud Temple : automatisation ESXi/Ansible, supervision réseau à grande échelle (~1000 équipements), et AIOps (IA appliquée au CI/CD et au reporting)."
period: "2024 - 2027"
role: "Alternant infrastructure & automatisation"
stack: ["VMware ESXi", "Ansible", "govc", "Nagios", "SNMP", "Azure DevOps", "Confluence", "SendGrid", "Python", "Bash", "YAML"]
tags: ["Virtualisation", "Ansible", "CI/CD", "Monitoring", "Scripting", "IA / AIOps", "Gestion de projet"]
images: ["/logos/cloud-temple.png"]
featured: true
relevance: "majeur"
order: 1
---

Alternance de 3 ans chez **Cloud Temple**, hébergeur cloud. Les clients finaux restent confidentiels ; ce qui suit décrit les missions et compétences développées, sans nommer d'environnement client spécifique.

## Automatisation & virtualisation

- **Cycle de vie des hyperviseurs** : automatisation complète de la configuration et de la post-configuration des hôtes ESXi via Ansible, là où c'était fait hôte par hôte à la main.
- **Déploiement de VM** : déploiement automatisé de machines virtuelles (Windows/Linux) sur ESXi standalone via la librairie `govc`.
- **Audit de conformité** : conception de pipelines d'audit pour vérifier que les ESXi distants respectent les exigences contractuelles des clients, et rôle Ansible dédié à l'audit des VM Windows/Linux.

## Supervision & réseau à grande échelle

- **Gestion automatisée du monitoring** : déploiement et gestion automatisés d'infrastructures de supervision Nagios couvrant environ 1000 équipements (switches, routeurs).
- **Configuration des sondes** : génération automatique des sondes de monitoring ICMP/SNMP, sans configuration manuelle équipement par équipement.
- **Supervision événementielle** : conception d'un projet en microservices pour superviser automatiquement des équipements via des triggers inter-pipeline sur Nagios - la détection d'un événement sur un pipeline déclenche une action de supervision sur un autre.

## DevOps & innovation (AIOps)

- **Automatisation Azure DevOps** : conception de pipelines CI/CD sur Azure DevOps pour fiabiliser la livraison des outils internes (build, tests, déploiement), avec intégration de modèles d'IA pour générer des feedbacks automatisés directement sur les pull requests et les builds - réduction du temps de revue manuelle.
- **Livraison de rapports automatisée** : chaîne complète de génération et d'envoi de rapports d'activité et de KPI via SendGrid, déclenchée automatiquement par les pipelines plutôt que produite à la main en fin de période.
- **KPI & pilotage** : construction d'indicateurs de suivi (avancement, conformité, incidents) consolidés automatiquement, pour donner une vision chiffrée à jour sans extraction manuelle de données.
- **Documentation vivante** : génération dynamique de documentation technique sur Confluence à partir des pipelines, pour qu'elle reste synchronisée avec l'état réel de l'infrastructure plutôt que de devenir obsolète.
- **Audit matériel** : rôle Ansible dédié à l'audit ESXi/iLO/iDRAC, avec génération automatique de PDF d'audit et de fiches de recette - le même principe appliqué à l'audit des VM Windows/Linux.
- **Monitoring automatisé** de l'ensemble de ces processus, pour détecter une dérive sans intervention manuelle.

## Méthode et posture

Travail quotidien en Bash, Python et YAML, avec une exigence de documentation systématique (toute automatisation doit pouvoir être reprise par un collègue). Au-delà du volet technique, cette alternance a aussi été l'occasion de prendre en charge le suivi de projets transverses - planification, coordination avec plusieurs équipes - avec une appétence affirmée pour évoluer vers des responsabilités combinant expertise technique et pilotage de projet.
