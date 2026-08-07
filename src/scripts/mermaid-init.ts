// Rendu client des diagrammes Mermaid — chargé uniquement si la page en contient.
// Thème calé sur les variables CSS du site (voir src/styles/global.css).

function readVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

async function initMermaid() {
  if (!document.querySelector(".mermaid")) return;

  const mermaid = (await import("mermaid")).default;

  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    themeVariables: {
      background: readVar("--bg"),
      primaryColor: readVar("--bg-elevated"),
      primaryTextColor: readVar("--fg"),
      primaryBorderColor: readVar("--border"),
      lineColor: readVar("--fg-muted"),
      secondaryColor: readVar("--bg-elevated"),
      tertiaryColor: readVar("--bg"),
      fontFamily: "inherit",
    },
  });

  await mermaid.run({ querySelector: ".mermaid" });
}

initMermaid();
