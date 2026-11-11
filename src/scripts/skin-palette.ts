// Palettes partagées par les styles Dossier, Baie et Topologie (mémorisées sur l'appareil).
const PAL: Record<string, Record<string, string>> = {
  Parchemin: { bg: "#ece6d9", el: "#f3efe4", fg: "#2a1d13", mu: "#6f5a45", bd: "#cdbfa6", ac: "#a8602f", ink: "#8a4a1f", on: "#fbf6ec" },
  Nuit: { bg: "#14100c", el: "#1e1712", fg: "#f0e6d8", mu: "#ad9a85", bd: "#3a2f24", ac: "#e0a868", ink: "#e0a868", on: "#14100c" },
  Éco: { bg: "#f7f5f1", el: "#fbfaf8", fg: "#111111", mu: "#4d4d4d", bd: "#cfccc5", ac: "#111111", ink: "#111111", on: "#ffffff" },
  Forêt: { bg: "#e9eee4", el: "#f3f6ef", fg: "#14200f", mu: "#4c5c46", bd: "#bccab3", ac: "#2d5a27", ink: "#2d5a27", on: "#f3f6ef" },
  Ardoise: { bg: "#0f141a", el: "#17202a", fg: "#e6edf3", mu: "#9aa7b4", bd: "#2c3a49", ac: "#d98a4e", ink: "#e39a5c", on: "#0f141a" },
};
const root = document.querySelector<HTMLElement>(".sk")!;
const fallback = root.dataset.palette || "Parchemin";
function apply(name: string) {
  const v = PAL[name] ?? PAL[fallback];
  Object.entries(v).forEach(([k, val]) => root.style.setProperty("--" + k, val));
  const label = document.getElementById("sk-pal-name");
  if (label) label.textContent = PAL[name] ? name : fallback;
  document.documentElement.style.colorScheme = ["Nuit", "Ardoise"].includes(name) ? "dark" : "light";
  try { localStorage.setItem("skin-palette", name); } catch (e) {}
}
let saved = fallback;
try { saved = localStorage.getItem("skin-palette") || fallback; } catch (e) {}
apply(saved);
document.querySelectorAll<HTMLButtonElement>("[data-pal]").forEach((b) => b.addEventListener("click", () => apply(b.dataset.pal!)));
