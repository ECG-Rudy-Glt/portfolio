// Périodes des projets en années fractionnaires (sept. = .67), tirées de la frise du parcours
// (BTS 2022-2024, SUPINFO 3e/4e/5e année, Cloud Temple depuis 2024) et du champ « period » des projets.
export const NOW = 2026.88; // fin novembre 2026
const [BTS, Y3, Y4] = [[2022.67, 2024.5], [2024.67, 2025.5], [2025.67, 2026.5]] as const;
export const PERIODS: Record<string, readonly [number, number]> = {
  "ethan-consulting": [2022.67, 2024.67],
  "bts-sio": BTS,
  "3dokr": Y3,
  "supchat": Y3,
  "supinfo-formation": [2024.67, 2026.5],
  "4agql-proj": Y4,
  "4arcl": Y4,
  "4kube": Y4,
  "4webd-ticket": Y4,
  "supfile": Y4,
  "cloud-temple": [2024.67, NOW],
  "plateforme-automatisation": [2025.67, NOW],
  "ops-delivery-suite": [2025.0, NOW],
  "homelab": [2026.42, NOW], // premier journal : juin 2026
  "coach": [2026.0, NOW],
  "patrimoine": [2026.0, NOW],
  "relai": [2026.0, NOW],
  "rudy-ops": [2026.0, NOW],
  "supinfo-lab": [2026.0, NOW],
};
export const TOOLS: { name: string; keys: string[] }[] = [
  { name: "Docker", keys: ["Docker", "Docker Compose", "Docker Swarm"] },
  { name: "Python", keys: ["Python"] },
  { name: "VMware ESXi", keys: ["VMware ESXi"] },
  { name: "Ansible", keys: ["Ansible"] },
  { name: "GitLab CI", keys: ["GitLab CI"] },
  { name: "Kubernetes", keys: ["Kubernetes", "K3s"] },
  { name: "Prometheus", keys: ["Prometheus", "Nagios"] },
  { name: "Proxmox", keys: ["Proxmox"] },
  { name: "Terraform", keys: ["Terraform"] },
  { name: "OPNsense", keys: ["OPNsense"] },
  { name: "OpenBao", keys: ["OpenBao"] },
  { name: "Traefik", keys: ["Traefik"] },
];
