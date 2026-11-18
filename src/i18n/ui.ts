// Dictionnaire de l'interface (FR par défaut, EN sous /en/). Le contenu long (fiches projets, blog) reste en français.
export type Lang = "fr" | "en";

export const langs: Lang[] = ["fr", "en"];

/** Chemin localisé : /projets/ -> /en/projets/ pour l'anglais. */
export const lp = (lang: Lang, path: string) => (lang === "en" ? `/en${path === "/" ? "/" : path}` : path);

/** Chemin équivalent dans l'autre langue. */
export const swapPath = (lang: Lang, path: string) =>
  lang === "en" ? path.replace(/^\/en(?=\/|$)/, "") || "/" : `/en${path === "/" ? "/" : path}`;

export const ui = {
  fr: {
    htmlLang: "fr",
    locale: "fr_FR",
    dateLocale: "fr-FR",
    home: "Rudy Gault, accueil",
    nav: { journey: "Parcours", projects: "Projets", skills: "Compétences", blog: "Blog", modes: "Modes" },
    contact: "Me contacter",
    cv: "CV",
    cvFull: "Télécharger mon CV",
    cvFooter: "CV (PDF)",
    menu: "Menu",
    switchLabel: "EN",
    switchTitle: "Read this page in English",
    footer: {
      served: "Servi depuis mon homelab : nginx dans un conteneur sur Proxmox.",
      browse: "Naviguer",
      elsewhere: "Ailleurs",
      contact: "Contact",
      freelance: "rudy-ops.fr (freelance)",
      tour: "Visite du homelab",
    },
    counter: (n: number, since: string) => `${n.toLocaleString("fr-FR")} page${n > 1 ? "s" : ""} vue${n > 1 ? "s" : ""} depuis le ${since}`,
    solutionsLabel: "Mes solutions open source",
    solutionNewTab: "nouvel onglet",
    defaultTitle: "Rudy Gault - Portfolio",
    defaultDescription: "Alternant infrastructure & développement - projets école, projets personnels et alternance.",
    ogAlt: "Capture de la page d'accueil du portfolio de Rudy Gault, ingénieur DevOps / Platform",
    jobTitle: "Alternant infrastructure & développement",
  },
  en: {
    htmlLang: "en",
    locale: "en_US",
    dateLocale: "en-GB",
    home: "Rudy Gault, home",
    nav: { journey: "Journey", projects: "Projects", skills: "Skills", blog: "Blog (FR)", modes: "Modes (FR)" },
    contact: "Contact me",
    cv: "CV",
    cvFull: "Download my CV (FR)",
    cvFooter: "CV (PDF, French)",
    menu: "Menu",
    switchLabel: "FR",
    switchTitle: "Lire cette page en français",
    footer: {
      served: "Served from my homelab: nginx in a container on Proxmox.",
      browse: "Browse",
      elsewhere: "Elsewhere",
      contact: "Contact",
      freelance: "rudy-ops.fr (freelance)",
      tour: "Homelab tour",
    },
    counter: (n: number, since: string) => `${n.toLocaleString("en-GB")} page view${n > 1 ? "s" : ""} since ${since}`,
    solutionsLabel: "My open source solutions",
    solutionNewTab: "new tab",
    defaultTitle: "Rudy Gault - Portfolio",
    defaultDescription: "Infrastructure & DevOps engineer on a work-study contract - school projects, personal projects and professional experience.",
    ogAlt: "Screenshot of the home page of Rudy Gault's portfolio, DevOps / Platform engineer",
    jobTitle: "Infrastructure & DevOps engineer (work-study)",
  },
} as const;
