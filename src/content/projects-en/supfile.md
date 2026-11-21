---
title: "SUPFile - Sovereign cloud storage"
category: ecole
summary: "A French alternative to Dropbox/Drive: end-to-end encryption, vault, advanced sharing, MFA and an embedded document AI (Bobby), on web, mobile and desktop."
period: "SUPINFO - 4th year"
role: "Project team member"
stack: ["Node.js", "React", "React Native", "Electron", "PostgreSQL", "Prisma", "Docker", "Ollama", "ChromaDB", "GitHub Actions"]
tags: ["Security", "AI / RAG", "Full-stack", "Mobile", "Desktop", "CI/CD", "Group project", "Data modelling", "Websites"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/4PROJ-"
  demo: "https://supfile.gault-rudy.com"
  sandbox: "https://supfile-demo.gault-rudy.com"
images: ["/projets/supfile/fichiers.webp", "/projets/supfile/apercu.webp", "/projets/supfile/tableau-de-bord.webp"]
groupProject: true
contributors: []
relevance: "majeur"
order: 6
---

## The problem

Dropbox and Google Drive host data outside Europe and offer neither a native encrypted vault nor intelligent search inside documents. The brief aimed for a sovereign alternative, deployable with one command, with a real level of security (encryption, MFA) and an AI able to query the content of files rather than just metadata.

## The solution

A complete cloud storage platform: end-to-end file encryption, a vault, advanced sharing with permissions, multi-factor authentication, and an embedded document AI assistant ("Bobby") able to answer questions about the content of stored documents. Available on web, mobile (iOS/Android) and desktop (Windows client with automatic synchronisation).

## Technical choices & architecture

- **Backend**: Node.js with Prisma as the ORM, PostgreSQL for persistence.
- **Frontend**: React, with state managed by Zustand.
- **Mobile**: React Native / Expo.
- **Desktop**: Electron client with automatic background synchronisation (Windows).
- **Document AI (Bobby)**: a dedicated microservice implementing a RAG (Retrieval-Augmented Generation) pipeline - documents are indexed in ChromaDB (vector database), and Ollama runs the language model locally to answer questions without sending data to a third-party service.
- **CI/CD**: a GitHub Actions pipeline with SAST analysis (detection of vulnerabilities in the code) and automatic SBOM generation (inventory of dependencies) on every build.
- **Infrastructure**: containerised VPS deployment with Docker Compose.

## My role

Covering the whole chain as part of the SUPINFO 4th-year curriculum: backend, frontend, mobile, desktop and CI/CD hardening - a project that requires understanding how each layer fits with the others, not just delivering an isolated feature.

## Result

A [presentation page](https://supfile.gault-rudy.com) and an [online demo](https://supfile-demo.gault-rudy.com), with no account, read-only and on fictional documents (the Bobby assistant is not enabled there).
