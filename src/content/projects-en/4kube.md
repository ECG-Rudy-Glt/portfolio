---
title: "4KUBE - Highly available Kubernetes cluster"
category: ecole
summary: "Deployment of a microservices application (FleetMan, real-time GPS tracking) on a 3-node Kubernetes cluster with high availability."
period: "SUPINFO - 4th year"
role: "Individual project"
stack: ["Kubernetes", "kubeadm", "containerd", "Calico", "MongoDB", "ActiveMQ", "Nginx", "Vagrant"]
tags: ["Kubernetes", "Infrastructure as Code", "Microservices", "Networking", "High availability"]
images: ["/projets/4kube/infrastucture-reseau.png", "/projets/4kube/application-microservice.png"]
links:
  repo: "https://github.com/paulmzzn/4KUBE"
relevance: "pertinent"
order: 10
---

## The problem

FleetMan is a microservices GPS tracking application (API gateway, position service, simulator, database, message queue). Deployed on a single machine, the slightest failure of one component makes the whole system unavailable - unacceptable for a real-time tracking system.

## The solution

Orchestrate everything on a high-availability Kubernetes cluster (1 master + 2 workers), with a fully automated and reproducible deployment rather than a manual installation, so the cluster can be rebuilt identically when needed.

## Technical choices & architecture

- **Cluster built from scratch**: 3 bare Ubuntu 22.04 VMs (1 master with 4 vCPU/2 GB, 2 workers with 2 vCPU/1 GB each) - no managed component, everything configured by hand and then automated: hostname, `/etc/hosts`, swap disabled (mandatory for kubeadm), before even initialising the cluster.
- **Cluster**: Kubernetes v1.30 provisioned with kubeadm, containerd as the container runtime, Calico as the CNI for pod networking.
- **Data**: MongoDB in a ReplicaSet for database fault tolerance, ActiveMQ as the message broker to decouple the microservices from one another.
- **Exposure**: Nginx as the entry point to the web application.
- **Provisioning**: automated deployment with Vagrant to reproduce the environment in a single command, with a step-by-step manual procedure documented via kubeadm to understand each bootstrap step rather than treating it as a black box.

## Result

A working 3-node cluster with real (tested) fault tolerance, versioned manifests for each component (namespace, MongoDB, queue, API gateway, webapp) and automation scripts for joining nodes.
