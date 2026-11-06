export interface Solution {
  name: string;
  description: string;
  links: { label: string; href: string }[];
}

export const solutionsLabel = "Mes solutions open source";

export const solutions: Solution[] = [
  {
    name: "COACH",
    description: "Coach sportif multisport auto-hébergé, à moteur de règles déterministe.",
    links: [
      { label: "Site", href: "https://coach.gault-rudy.com" },
      { label: "Démo", href: "https://coach-demo.gault-rudy.com" },
      { label: "GitHub", href: "https://github.com/ECG-Rudy-Glt/COACH" },
    ],
  },
  {
    name: "Relai",
    description: "Passer le relais entre humains et agents IA sans perdre le contexte.",
    links: [
      { label: "Site", href: "https://relai.gault-rudy.com" },
      { label: "GitHub", href: "https://github.com/ECG-Rudy-Glt/RELAI" },
    ],
  },
  {
    name: "Patrimoine",
    description: "Gestion de patrimoine auto-hébergée : comptes de la famille, conseils IA par e-mail.",
    links: [
      { label: "Site", href: "https://patrimoine-open.gault-rudy.com" },
      { label: "Démo", href: "https://patrimoine-demo.gault-rudy.com" },
      { label: "GitHub", href: "https://github.com/ECG-Rudy-Glt/PATRIMOINE" },
    ],
  },
];
