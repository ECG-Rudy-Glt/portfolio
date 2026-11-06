// Menu déroulant « Mes solutions open source » : clic, clavier, Échap, clic extérieur.
const roots = Array.from(document.querySelectorAll<HTMLElement>("[data-oss]"));

function parts(root: HTMLElement) {
  return {
    btn: root.querySelector<HTMLButtonElement>("[data-oss-btn]")!,
    panel: root.querySelector<HTMLElement>("[data-oss-panel]")!,
  };
}

function setOpen(root: HTMLElement, open: boolean) {
  const { btn, panel } = parts(root);
  btn.setAttribute("aria-expanded", String(open));
  if (open) panel.setAttribute("data-open", "");
  else panel.removeAttribute("data-open");
}

const isOpen = (root: HTMLElement) => parts(root).btn.getAttribute("aria-expanded") === "true";

for (const root of roots) {
  const { btn } = parts(root);
  btn.addEventListener("click", () => {
    const next = !isOpen(root);
    roots.forEach((r) => setOpen(r, false));
    setOpen(root, next);
  });
  root.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen(root)) {
      setOpen(root, false);
      btn.focus();
    }
  });
  // Fermeture quand le focus quitte le menu (navigation clavier).
  root.addEventListener("focusout", (e) => {
    const to = (e as FocusEvent).relatedTarget as Node | null;
    if (to && !root.contains(to)) setOpen(root, false);
  });
}

document.addEventListener("click", (e) => {
  for (const root of roots) if (isOpen(root) && !root.contains(e.target as Node)) setOpen(root, false);
});
