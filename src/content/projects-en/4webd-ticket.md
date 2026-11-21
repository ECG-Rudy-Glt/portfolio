---
title: "TicketApp - Highly available ticketing SaaS"
category: ecole
summary: "An event ticketing SaaS designed to absorb a small school event as well as an international tour, with no overselling and no downtime on payments."
period: "SUPINFO - 4th year"
role: "Individual project"
stack: ["Node.js", "Express", "PostgreSQL", "Patroni", "RabbitMQ", "Redis", "PgBouncer", "Nginx", "Zipkin", "Docker", "Docker Compose"]
tags: ["Microservices", "High availability", "Docker", "Full-stack", "Data modelling"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/4WEBD-TICKET"
relevance: "secondaire"
order: 12
---

## The problem

The brief called for a ticketing system able to serve a small school event as well as an international tour, with no ticket overselling, asynchronous purchase confirmation, card payment, and differentiated criticality depending on the operation: losing a payment transaction does not have the same impact as losing a like.

## The solution

A microservices architecture in which each business domain (auth, users, events, booking, payment, notification) is an independent service, replicated and balanced by its own load balancer, with asynchronous event-driven processing through RabbitMQ so the user is never blocked on a slow operation.

## Technical choices & architecture

- **Gateway**: an API Gateway at the front, routing to the internal load balancers of each microservice (auth, user, event, booking, payment), each with several instances.
- **Asynchronous booking flow**: `POST /bookings` publishes to a RabbitMQ queue - the booking-service atomically decrements capacity (preventing overselling), creates the pending ticket, then publishes to the payment queue. The payment-service processes the payment and republishes the result to a notification queue, which logs and persists the final outcome - each step can be retried independently without blocking the others.
- **Targeted high availability**: critical data (bookings, payments) lives in a Patroni cluster (PostgreSQL HA with automatic failover, coordinated by etcd), while less critical data (auth, users, events) uses a simple primary/replica - HA complexity goes where it has the most value, not everywhere by default.
- **Performance**: Redis as a cache for frequent reads, PgBouncer for connection pooling in front of PostgreSQL, and an explicit separation of read (replica) and write (primary) query pools in the code.
- **Observability**: distributed tracing with Zipkin across all the microservices, to follow a request end to end through the chain of services.
- **Infrastructure**: everything is containerised and orchestrated with Docker Compose, with two deliverables - a standalone application version and a version including the full deployment infrastructure.

## Result

A system where the criticality of each piece of data dictates the level of robustness applied (Patroni HA for payment, a simple replica for the rest), rather than a uniform architecture - the hardest trade-off to justify in the project's technical report.
