---
title: "SUPCHAT - Communication platform"
category: ecole
summary: "A real-time cross-platform chat platform (web, iOS, Android) with built-in Mistral AI, workspaces, file sharing and push notifications."
period: "SUPINFO - 3rd year"
role: "Project team member"
stack: ["Node.js", "React", "React Native", "PostgreSQL", "Docker", "Socket.IO", "Mistral AI", "S3"]
tags: ["Real time", "AI", "Full-stack", "Mobile", "Docker", "Group project"]
links:
  demo: "https://supchat.fr"
  repo: "https://github.com/paulmzzn/SUPCHAT"
images: []
groupProject: true
contributors: ["Paul Mzzn"]
relevance: "majeur"
order: 5
---

## The problem

The team communication tools on the market (Slack, Discord, Teams) are closed, paid at scale, and do not natively include an AI assistant aware of the conversation context. The goal of the SUPINFO brief: build a complete, cross-platform alternative with real AI integration - not just one more chat.

## The solution

A team communication platform with real-time chat, workspace organisation, file sharing, OAuth authentication, push notifications, and a built-in AI assistant (Mistral) able to answer within the context of the conversation. Deployed and available online at supchat.fr, with native web (PWA), iOS and Android clients.

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

Platform online at [supchat.fr](https://supchat.fr), usable today on web, iOS and Android.
