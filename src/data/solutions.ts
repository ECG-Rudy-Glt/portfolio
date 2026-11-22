export interface Solution {
  name: string;
  description: string;
  descriptionEn: string;
  links: { label: string; labelEn: string; href: string }[];
}

export const solutionsLabel = "Mes solutions open source";
export const solutionsLabelEn = "My open source solutions";

export const solutions: Solution[] = [
  {
    name: "COACH",
    description: "Coach sportif multisport auto-hébergé, à moteur de règles déterministe.",
    descriptionEn: "Self-hosted multisport coach driven by a deterministic rules engine.",
    links: [
      { label: "Site", labelEn: "Website", href: "https://coach.gault-rudy.com" },
      { label: "Démo", labelEn: "Demo", href: "https://coach-demo.gault-rudy.com" },
      { label: "GitHub", labelEn: "GitHub", href: "https://github.com/ECG-Rudy-Glt/COACH" },
    ],
  },
  {
    name: "Relai",
    description: "Reprendre un projet avec un agent IA sans tout relire : résumé de reprise, plusieurs dépôts, conventions partagées. Un binaire Go, git seulement.",
    descriptionEn: "Pick a project back up with an AI agent without rereading everything: resume summary, several repositories, shared conventions. One Go binary, git only.",
    links: [
      { label: "Site", labelEn: "Website", href: "https://relai.gault-rudy.com" },
      { label: "GitHub", labelEn: "GitHub", href: "https://github.com/ECG-Rudy-Glt/RELAI" },
      { label: "Relai-Team", labelEn: "Relai-Team", href: "https://github.com/ECG-Rudy-Glt/RELAI-TEAM" },
    ],
  },
  {
    name: "Patrimoine",
    description: "Gestion de patrimoine auto-hébergée : comptes de la famille, conseils IA par e-mail.",
    descriptionEn: "Self-hosted wealth tracking: the whole family's accounts, AI advice by e-mail.",
    links: [
      { label: "Site", labelEn: "Website", href: "https://patrimoine-open.gault-rudy.com" },
      { label: "Démo", labelEn: "Demo", href: "https://patrimoine-demo.gault-rudy.com" },
      { label: "GitHub", labelEn: "GitHub", href: "https://github.com/ECG-Rudy-Glt/PATRIMOINE" },
    ],
  },
  {
    name: "Ops Delivery Suite",
    description: "Onze outils DevOps autonomes : durcissement, audit de sécurité, sauvegarde S3, migration, proxy HTTPS, supervision.",
    descriptionEn: "Eleven standalone DevOps tools: hardening, security audits, S3 backups, migration, HTTPS proxy, monitoring.",
    links: [
      { label: "Modules", labelEn: "Modules", href: "/projets/ops-delivery-suite/" },
      { label: "GitHub", labelEn: "GitHub", href: "https://github.com/ECG-Rudy-Glt/ops-delivery-suite" },
    ],
  },
];
