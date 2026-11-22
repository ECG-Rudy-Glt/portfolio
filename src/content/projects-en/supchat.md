---
title: "SUPCHAT - Communication platform"
category: ecole
summary: "My 3rd-year final project: a real-time cross-platform chat platform (web, iOS, Android) with built-in Mistral AI, workspaces, file sharing and push notifications. Live no-account demo, read-only and without AI."
period: "SUPINFO - 3rd year (final project)"
role: "Project team member"
stack: ["Node.js", "React", "React Native", "PostgreSQL", "Docker", "Socket.IO", "Mistral AI", "S3"]
tags: ["Real time", "AI", "Full-stack", "Mobile", "Docker", "Group project", "Websites"]
links:
  demo: "https://supchat.gault-rudy.com"
  sandbox: "https://supchat-demo.gault-rudy.com"
  repo: "https://github.com/paulmzzn/SUPCHAT"
images: ["/projets/supchat/images.jpg", "/projets/supchat/canal.jpg", "/projets/supchat/messages-prives.jpg"]
groupProject: true
contributors: ["Paul Mzzn"]
relevance: "majeur"
order: 10
---

## The problem

The team communication tools on the market (Slack, Discord, Teams) are closed, paid at scale, and do not natively include an AI assistant aware of the conversation context. The goal of the SUPINFO brief: build a complete, cross-platform alternative with real AI integration - not just one more chat.

## The solution

A team communication platform with real-time chat, workspace organisation, file sharing, OAuth authentication, push notifications, and a built-in AI assistant (Mistral) able to answer within the context of the conversation. SUPCHAT is my 3rd-year final project at SUPINFO. The platform includes a web client (PWA) and iOS and Android mobile clients.

## Technical choices & architecture

- **Real time**: Socket.IO for instant message and presence broadcasting, rather than polling.
- **Backend**: Node.js 18, PostgreSQL 16 for persistence (messages, workspaces, users).
- **Web**: React 18.3 as a PWA, installable and partially usable offline.
- **Mobile**: React Native 0.79, with business logic shared with the web.
- **File storage**: S3 (Scaleway) for attachments, decoupled from the application server.
- **AI**: integration of the Mistral API for contextual answers inside conversations, rather than a separate chatbot.
- **Infrastructure**: full Docker containerisation for a reproducible production deployment.

## My role

A project carried out as a team with [Paul Mzzn](https://github.com/paulmzzn) - I contributed on the application side (web/backend), with the coordination needed to integrate mobile, backend and AI without the three teams blocking one another.

## Result

A [presentation page](https://supchat.gault-rudy.com) and a [live demo](https://supchat-demo.gault-rudy.com), with no account, read-only and on fictional data. The demo is a lighter, hardened variant of the project: no authentication (a fictional user), every write refused by the server, by nginx and by the SQL role, and no language model (the Mistral assistant is removed). The demo's "Portfolio de Rudy" workspace presents my other projects (Relai, my freelance site, COACH, Patrimoine, my homelab) with screenshots.

The original repository, published by Paul, remains the reference for the full code, mobile included. The former `supchat.fr` site is no longer online.
