---
title: "rudy-ops.fr - Freelance DevOps/DevSecOps showcase site"
category: perso
summary: "Showcase and contact site for my freelance activity (DevOps, Platform Engineering, DevSecOps): Astro/React frontend, Flask backend with an AI quoting assistant, Vikunja integration, deployed through CI/CD on my homelab."
period: "2026 - ongoing"
role: "Solo design, development and deployment"
stack: ["Astro", "React", "TailwindCSS", "Flask", "Python", "Docker", "Forgejo Actions", "Cloudflare Tunnel", "Gemini API", "Vikunja API"]
tags: ["Full-stack", "AI / Conversational assistant", "CI/CD", "SEO", "Freelance", "Websites"]
links:
  demo: "https://rudy-ops.fr"
images: ["/projets/rudy-ops/freelance-illustration.png"]
featured: true
relevance: "majeur"
order: 0
---

## The need

Launch my freelance activity (DevOps, Platform Engineering, DevSecOps) with a professional website rather than a simple contact page: present the services, a transparent daily rate, a way to book a meeting, and a reliable way to capture every request without it getting lost in a mailbox.

## The solution

An Astro/React site (home, services, pricing, availability, contact) coupled with a Flask backend that receives each request, sends an acknowledgement to the client, a notification to me (email + Telegram), and automatically creates a task in my Vikunja instance - no request gets lost, everything becomes traceable. In addition to the classic form, an AI quoting assistant (Gemini API) asks a few qualification questions tailored to the requested service before submitting to the same processing chain.

## Technical choices & architecture

- **Frontend**: Astro (static rendering) + React for the interactive components, TailwindCSS. Deployed as a Docker container alongside this portfolio, on the same LXC of my homelab.
- **Backend**: Flask/Gunicorn, deployed as a separate container. Honeypot anti-spam, strict validation of all fields (including those extracted by the AI - never unfiltered free text before an email is sent or a task is created).
- **AI quoting assistant**: Gemini's Interactions API (free tier), with no state on the Flask side - the conversation history lives at Google, the backend only relays the latest message. Explicitly optional in the code: the absence of its configuration must never prevent the classic form from working.
- **Vikunja integration**: each request (form or chatbot) becomes a task in a dedicated project, through the Vikunja API already used elsewhere in my homelab.
- **CI/CD**: Forgejo Actions, two pipelines (frontend/backend) that build, push the image to my internal Docker registry and deploy over SSH - the same pattern as this portfolio.
- **Public exposure**: Cloudflare Tunnel (outbound connection only, no open port on my network), DNS and certificates managed by Cloudflare.
- **SEO**: `ProfessionalService` JSON-LD, sitemap, `robots.txt`, keywords targeting my activity and location.

## Result

Site live at [rudy-ops.fr](https://rudy-ops.fr), contact form and quoting assistant working, every request traced automatically.
