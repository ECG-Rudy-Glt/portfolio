// Pool de questions QCM pour l'article AZ-104 - questions originales écrites pour couvrir
// les 5 domaines de l'examen (pas de dump d'examen réel, contraire aux règles de certification
// Microsoft). Un sous-ensemble aléatoire en est tiré à chaque partie par le composant Quiz.
export interface QuizQuestion {
  domain: string;
  question: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
}

export const azQuestions: QuizQuestion[] = [
  {
    domain: "Identités & gouvernance",
    question: "Quelle fonctionnalité Entra ID permet à un utilisateur de réinitialiser lui-même son mot de passe, sans intervention d'un administrateur ?",
    choices: ["Conditional Access", "Self-Service Password Reset (SSPR)", "Privileged Identity Management (PIM)", "Identity Protection"],
    correctIndex: 1,
    explanation: "SSPR permet à l'utilisateur de réinitialiser son mot de passe via des méthodes de vérification qu'il a lui-même enregistrées (email, téléphone, questions).",
  },
  {
    domain: "Identités & gouvernance",
    question: "Quelle est la différence fondamentale entre RBAC et Azure Policy ?",
    choices: [
      "RBAC gère les coûts, Policy gère les identités",
      "RBAC contrôle qui peut faire quoi, Policy contrôle quelles configurations sont autorisées",
      "RBAC s'applique aux VMs, Policy aux storage accounts uniquement",
      "Ce sont deux noms pour la même fonctionnalité",
    ],
    correctIndex: 1,
    explanation: "RBAC répond à \"qui a le droit d'agir\", Azure Policy répond à \"quelles configurations sont conformes\", indépendamment de qui les crée.",
  },
  {
    domain: "Identités & gouvernance",
    question: "À quels niveaux (scopes) une assignation de rôle RBAC peut-elle être faite ?",
    choices: [
      "Uniquement au niveau abonnement",
      "Uniquement au niveau groupe de ressources",
      "Management group, abonnement, groupe de ressources ou ressource individuelle",
      "Uniquement au niveau tenant Entra ID",
    ],
    correctIndex: 2,
    explanation: "RBAC est hiérarchique : une assignation à un niveau supérieur (ex. management group) est héritée par tous les scopes en dessous.",
  },
  {
    domain: "Identités & gouvernance",
    question: "Qu'empêche un resource lock de type \"ReadOnly\" par rapport à un lock \"CanNotDelete\" ?",
    choices: [
      "ReadOnly empêche seulement la suppression, comme CanNotDelete",
      "ReadOnly empêche la suppression ET la modification, CanNotDelete empêche seulement la suppression",
      "ReadOnly ne s'applique qu'aux storage accounts",
      "Il n'y a aucune différence entre les deux",
    ],
    correctIndex: 1,
    explanation: "CanNotDelete autorise toujours la modification de la ressource ; ReadOnly bloque en plus toute modification, y compris souvent des opérations bénignes qui échouent silencieusement (ex. écriture de métriques).",
  },
  {
    domain: "Identités & gouvernance",
    question: "Quel effet Azure Policy utilise-t-on pour bloquer la création d'une ressource qui ne respecte pas une règle (ex. région non autorisée) ?",
    choices: ["Audit", "Append", "Deny", "DeployIfNotExists"],
    correctIndex: 2,
    explanation: "\"Deny\" bloque la requête de création/modification si elle ne respecte pas la policy ; \"Audit\" se contente de journaliser sans bloquer.",
  },
  {
    domain: "Stockage",
    question: "Quelle option de redondance de stockage réplique les données sur trois zones de disponibilité physiquement séparées au sein de la même région ?",
    choices: ["LRS", "ZRS", "GRS", "RA-GRS"],
    correctIndex: 1,
    explanation: "ZRS (Zone-Redundant Storage) réplique sur 3 zones de disponibilité de la même région, protégeant contre la perte d'un datacenter entier - contrairement à LRS, limité à un seul datacenter.",
  },
  {
    domain: "Stockage",
    question: "Quel tier d'accès Blob nécessite une opération de \"réhydratation\" avant de pouvoir lire les données, avec un délai pouvant aller jusqu'à plusieurs heures ?",
    choices: ["Hot", "Cool", "Cold", "Archive"],
    correctIndex: 3,
    explanation: "Le tier Archive est optimisé pour le coût de stockage minimal, pas pour l'accès - toute lecture nécessite de rapatrier le blob vers un tier en ligne au préalable.",
  },
  {
    domain: "Stockage",
    question: "Qu'apporte une Shared Access Signature (SAS) par rapport à une clé de storage account partagée directement ?",
    choices: [
      "Rien, les deux donnent exactement les mêmes droits",
      "Un accès délégué, limité dans le temps et scopé à des permissions précises",
      "La SAS ne fonctionne que pour Azure Files, jamais pour Blob",
      "La SAS remplace définitivement le besoin d'authentification",
    ],
    correctIndex: 1,
    explanation: "Une clé de storage account donne un accès total et permanent au compte entier ; une SAS peut être scopée à un conteneur/blob précis, à des permissions précises (lecture seule par exemple) et à une fenêtre de temps limitée.",
  },
  {
    domain: "Stockage",
    question: "Quel outil est conçu pour des transferts de données en masse vers/depuis Azure Storage, scriptables et optimisés en performance ?",
    choices: ["Storage Explorer", "AzCopy", "Azure Data Factory uniquement", "Azure Migrate"],
    correctIndex: 1,
    explanation: "AzCopy est l'outil en ligne de commande dédié aux transferts haute performance, parallélisés, vers/depuis Blob et Azure Files - Storage Explorer est plutôt une interface graphique d'exploration.",
  },
  {
    domain: "Stockage",
    question: "Quelle différence sépare Azure Files d'Azure Blob Storage ?",
    choices: [
      "Blob expose des partages de fichiers SMB/NFS, Files du stockage objet",
      "Azure Files expose des partages de fichiers montables (SMB/NFS), Blob est du stockage objet non structuré",
      "Ce sont deux noms commerciaux pour le même service",
      "Azure Files ne peut pas être monté depuis une VM",
    ],
    correctIndex: 1,
    explanation: "Azure Files fournit de vrais partages réseau montables comme un lecteur (SMB ou NFS), pensé pour remplacer un serveur de fichiers classique ; Blob Storage est du stockage objet accédé via API/HTTP.",
  },
  {
    domain: "Compute",
    question: "Quelle est la différence entre un Availability Set et une Availability Zone ?",
    choices: [
      "Un Availability Set répartit les VMs sur plusieurs régions, une Zone sur un seul datacenter",
      "Un Availability Set répartit les VMs sur des domaines de panne/mise à jour dans un même datacenter, une Availability Zone les répartit sur des datacenters physiquement séparés dans la région",
      "Les deux garantissent exactement le même SLA",
      "Availability Zone est déprécié au profit d'Availability Set",
    ],
    correctIndex: 1,
    explanation: "Availability Set protège contre une panne matérielle/maintenance au sein d'un même datacenter ; Availability Zone protège contre la perte d'un datacenter entier, avec un SLA plus élevé.",
  },
  {
    domain: "Compute",
    question: "À quoi sert un Virtual Machine Scale Set (VMSS) ?",
    choices: [
      "Sauvegarder automatiquement des VMs individuelles",
      "Gérer un groupe de VMs identiques avec scaling automatique selon la charge",
      "Migrer des VMs entre abonnements",
      "Chiffrer les disques managés",
    ],
    correctIndex: 1,
    explanation: "Un VMSS déploie et gère un ensemble de VMs identiques, avec montée/descente en charge automatique (autoscale) selon des métriques comme le CPU.",
  },
  {
    domain: "Compute",
    question: "Lequel de ces types de disque managé offre les performances les plus élevées, avec un débit et des IOPS configurables indépendamment de la taille du disque ?",
    choices: ["Standard HDD", "Standard SSD", "Premium SSD", "Ultra Disk"],
    correctIndex: 3,
    explanation: "Ultra Disk permet de régler IOPS et débit indépendamment de la taille allouée, pour les charges les plus exigeantes (bases de données à forte volumétrie de transactions par exemple).",
  },
  {
    domain: "Compute",
    question: "À quoi servent les deployment slots d'Azure App Service ?",
    choices: [
      "Uniquement à réduire la facture",
      "Déployer une nouvelle version en parallèle de la prod puis basculer (swap) sans interruption de service",
      "Chiffrer le trafic HTTPS entrant",
      "Répartir la charge entre plusieurs régions",
    ],
    correctIndex: 1,
    explanation: "Un slot de staging permet de valider une nouvelle version en conditions réelles avant de l'échanger (swap) avec le slot de production, sans downtime perceptible.",
  },
  {
    domain: "Compute",
    question: "Quel est l'avantage principal de Bicep par rapport à un template ARM en JSON brut ?",
    choices: [
      "Bicep s'exécute plus vite au runtime",
      "Bicep est un langage déclaratif plus concis qui se transpile en ARM JSON, sans changer ce qui est réellement déployé",
      "Bicep remplace complètement le besoin de Resource Manager",
      "Bicep ne fonctionne que pour les VMs",
    ],
    correctIndex: 1,
    explanation: "Bicep est une syntaxe de plus haut niveau (moins verbeuse, avec de la complétion IDE) qui compile vers exactement le même JSON ARM sous le capot - même moteur de déploiement, meilleure ergonomie d'écriture.",
  },
  {
    domain: "Réseau",
    question: "Le peering entre deux réseaux virtuels (VNet) est-il transitif par défaut ?",
    choices: [
      "Oui, toujours",
      "Non - si A est peeré avec B et B avec C, A ne peut pas joindre C sans peering direct ou une route explicite",
      "Seulement si les VNets sont dans la même région",
      "Seulement avec Azure Firewall en place",
    ],
    correctIndex: 1,
    explanation: "Le peering VNet n'est pas transitif par défaut - chaque paire de VNets qui doit communiquer a besoin de son propre peering direct, sauf mise en place d'un hub de routage dédié.",
  },
  {
    domain: "Réseau",
    question: "Quelle est la différence entre un NSG et une UDR (User Defined Route) ?",
    choices: [
      "Le NSG filtre le trafic (autorise/bloque), l'UDR contrôle le chemin emprunté par le trafic",
      "Ce sont deux noms pour la même fonctionnalité",
      "L'UDR filtre le trafic, le NSG contrôle le routage",
      "Le NSG ne s'applique qu'aux sous-réseaux, jamais aux NIC",
    ],
    correctIndex: 0,
    explanation: "Un NSG décide si un paquet est autorisé ou bloqué ; une UDR décide par où le trafic autorisé doit passer (ex. forcer la sortie via une appliance de sécurité).",
  },
  {
    domain: "Réseau",
    question: "Quel service permet de se connecter en RDP/SSH à une VM depuis le portail Azure, sans lui attribuer d'IP publique ni ouvrir de port RDP/SSH sur Internet ?",
    choices: ["Azure Firewall", "Azure Bastion", "Network Watcher", "ExpressRoute"],
    correctIndex: 1,
    explanation: "Azure Bastion fournit un accès RDP/SSH via le navigateur, directement depuis le portail, sans exposer la VM elle-même sur Internet.",
  },
  {
    domain: "Réseau",
    question: "Pour répartir du trafic HTTP(S) en fonction du chemin d'URL (path-based routing), quel service Azure est le plus adapté ?",
    choices: ["Azure Load Balancer (niveau 4)", "Application Gateway (niveau 7)", "Traffic Manager", "Azure Bastion"],
    correctIndex: 1,
    explanation: "Application Gateway opère au niveau 7 (HTTP) et comprend le contenu de la requête (URL, headers) - Load Balancer opère au niveau 4 (TCP/UDP) et ne voit que l'IP/le port.",
  },
  {
    domain: "Réseau",
    question: "Quelle est la différence entre un Private Endpoint et un Service Endpoint ?",
    choices: [
      "Un Private Endpoint attribue une IP privée dans le VNet pour le service cible ; un Service Endpoint optimise la route vers le service mais celui-ci garde son IP publique",
      "Les deux fonctionnent exactement de la même façon",
      "Un Service Endpoint attribue une IP privée, un Private Endpoint non",
      "Private Endpoint ne fonctionne qu'avec les storage accounts",
    ],
    correctIndex: 0,
    explanation: "Le Private Endpoint crée une véritable carte réseau avec IP privée dans le VNet, faisant apparaître le service comme une ressource locale ; le Service Endpoint reste sur l'IP publique du service mais restreint/optimise l'accès depuis le sous-réseau.",
  },
  {
    domain: "Monitoring",
    question: "Quels sont les deux piliers de données collectées par Azure Monitor ?",
    choices: ["Metrics et Logs", "Backups et Snapshots", "Policies et Locks", "Tags et Costs"],
    correctIndex: 0,
    explanation: "Azure Monitor collecte des métriques numériques (séries temporelles légères) et des logs (interrogeables en KQL via un workspace Log Analytics) - deux natures de données, deux usages différents.",
  },
  {
    domain: "Monitoring",
    question: "Qu'est-ce qu'un Action Group dans Azure Monitor ?",
    choices: [
      "Un groupe de ressources à surveiller",
      "L'ensemble des notifications/actions déclenchées quand une alerte se déclenche (email, SMS, webhook, fonction...)",
      "Une politique de sauvegarde automatique",
      "Un type de règle RBAC",
    ],
    correctIndex: 1,
    explanation: "Une règle d'alerte définit la condition à surveiller ; l'Action Group définit ce qui se passe une fois l'alerte déclenchée - il est réutilisable entre plusieurs règles d'alerte.",
  },
  {
    domain: "Monitoring",
    question: "À quoi sert Network Watcher ?",
    choices: [
      "Uniquement à afficher la facture réseau",
      "Diagnostiquer et surveiller le réseau (vérification de flux IP, diagnostics NSG, capture de paquets...)",
      "Remplacer les NSG",
      "Gérer les certificats TLS",
    ],
    correctIndex: 1,
    explanation: "Network Watcher regroupe des outils de diagnostic réseau - IP flow verify (pourquoi un paquet est bloqué/autorisé), diagnostics NSG, capture de paquets à distance, topologie réseau.",
  },
  {
    domain: "Monitoring",
    question: "Quelle est la différence entre Azure Backup et Azure Site Recovery ?",
    choices: [
      "Ce sont deux noms pour le même service",
      "Azure Backup protège/restaure des données, Azure Site Recovery réplique des charges de travail pour un basculement en cas de sinistre (DR)",
      "Azure Backup ne fonctionne que sur les storage accounts",
      "Azure Site Recovery ne fonctionne que sur les VMs Linux",
    ],
    correctIndex: 1,
    explanation: "Azure Backup répond à la question \"comment restaurer une donnée perdue/corrompue\", tandis qu'Azure Site Recovery répond à \"comment faire basculer une charge de travail entière vers un autre site en cas de sinistre\".",
  },
  {
    domain: "Monitoring",
    question: "Quel outil permet d'analyser et de prévoir les dépenses sur un abonnement Azure ?",
    choices: ["Azure Advisor uniquement", "Cost Management + Billing", "Azure Policy", "Resource Health"],
    correctIndex: 1,
    explanation: "Cost Management + Billing fournit l'analyse des coûts, les budgets, les alertes de dépassement et les prévisions - Azure Advisor donne des recommandations mais n'est pas l'outil d'analyse de coûts lui-même.",
  },
];
