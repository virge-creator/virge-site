---
layout: ../../../layouts/BlogPost.astro
lang: en
title: "Kagent + MCP: AI Agents That Actually Understand Your Kubernetes Cluster"
description: "How Kagent brings agentic AI to Kubernetes as CRDs, exposes agents via MCP for integration with tools like LibreChat, and why this changes the game for platform engineering."
date: 2026-05-14
author: "Virge.io"
image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop"
tags: ["kubernetes","ai","agents","mcp","devops","kagent"]
---

What if your Kubernetes cluster had an AI teammate that could diagnose a failing deployment, query Prometheus for anomalies, and fix a misconfigured Gateway — all without you writing a single kubectl command?

That's not a pitch deck fantasy. It's **Kagent**, a CNCF sandbox project that brings agentic AI to cloud-native environments as first-class Kubernetes resources.

## What is Kagent?

[Kagent](https://kagent.dev) was created at Solo.io in 2025 and donated to the Cloud Native Computing Foundation. It's an open-source framework that lets you define AI agents as **Kubernetes Custom Resource Definitions (CRDs)** — meaning they're versioned in Git, reviewed in PRs, and deployed with the same tools you already use for everything else.

The core architecture has three components:

- **Tools**: MCP-compatible functions that agents use to interact with your cluster. Built-in tools include fetching pod logs, querying Prometheus metrics, generating K8s manifests, and managing Argo Rollouts.
- **Agents**: Autonomous systems that plan, execute, and analyze multi-step tasks using available tools. Each agent has a system prompt, a model configuration, and a set of tools it can access.
- **Framework**: Built on Google's Agent Development Kit (ADK), providing a UI dashboard, CLI, and declarative YAML interface.

A typical agent definition looks like regular Kubernetes YAML:

```yaml
apiVersion: kagent.dev/v1alpha2
kind: Agent
metadata:
  name: k8s-troubleshooter
  namespace: kagent
spec:
  description: "Diagnoses and fixes K8s deployment issues"
  declarative:
    systemMessage: |
      You are a Kubernetes expert. Diagnose issues
      by checking pod logs, events, and metrics.
    modelConfig:
      name: openai-gpt4
    tools:
      - name: kubernetes-tools
      - name: prometheus-tools
```

That's it. `kubectl apply -f agent.yaml` and you have an AI agent running in your cluster.

## The MCP Connection: Why It Matters

Here's where it gets really interesting. Kagent doesn't just *consume* MCP tools — it speaks MCP natively. This means:

1. **Agents can connect to any MCP server** to gain new capabilities (database access, external APIs, custom tooling)
2. **Agents themselves can be exposed as MCP servers**, making them available to any MCP-compatible client
3. **The A2A (Agent-to-Agent) protocol** enables agents to collaborate, with a planning agent delegating tasks to specialized agents

### Connecting MCP Tools to Agents

Adding an MCP tool to a Kagent agent is straightforward. You create an `MCPServer` resource and reference it in your agent:

```yaml
apiVersion: kagent.dev/v1alpha2
kind: MCPServer
metadata:
  name: fetch-tool
  namespace: kagent
spec:
  transport:
    stdio:
      command: ["npx"]
      args: ["-y", "@anthropic/mcp-fetch"]
---
apiVersion: kagent.dev/v1alpha2
kind: Agent
metadata:
  name: web-aware-agent
spec:
  declarative:
    tools:
      - name: fetch-tool
      - name: kubernetes-tools
```

Now your agent can fetch web pages, read documentation, or call external APIs — all while having full access to your cluster's Kubernetes tools.

### Exposing Agents as MCP Servers

This is the game-changing part. Kagent agents can be exposed via MCP, which means **any tool that speaks MCP can interact with your Kubernetes agents**. Think about what this enables:

- **VS Code / Cursor / Claude Code** can call your K8s troubleshooting agent directly from your editor
- **LibreChat** can provide a beautiful chat interface on top of your cluster agents
- **Other agents** in completely different systems can delegate Kubernetes tasks to your Kagent agents

The architecture looks like this:

```
┌─────────────────┐     MCP      ┌──────────────┐
│   LibreChat UI  │ ◄──────────► │  Kagent MCP  │
│   (Chat GUI)    │              │   Server     │
└─────────────────┘              └──────┬───────┘
                                        │
                                 ┌──────▼───────┐
                                 │   Kagent     │
                                 │   Agents     │
                                 │  (K8s CRDs)  │
                                 └──────┬───────┘
                                        │
                            ┌───────────┼───────────┐
                            ▼           ▼           ▼
                     ┌──────────┐ ┌──────────┐ ┌──────────┐
                     │ kubectl  │ │Prometheus│ │  Argo    │
                     │  tools   │ │  tools   │ │ Rollouts │
                     └──────────┘ └──────────┘ └──────────┘
```

## LibreChat: A Production-Grade Chat GUI for Your Agents

[LibreChat](https://www.librechat.ai) is an open-source chat platform that supports multiple AI providers and — crucially — **native MCP integration**. It's essentially a self-hosted ChatGPT alternative with full agent capabilities.

When you combine LibreChat with Kagent's MCP exposure, you get:

- **A polished chat interface** for interacting with your Kubernetes agents
- **Multi-agent support**: configure different agents for different tasks (one for debugging, one for deployments, one for monitoring)
- **Conversation history**: all agent interactions are logged and searchable
- **Team access**: multiple engineers can interact with the same agents through a shared UI
- **Deferred tool loading**: agents can have access to many MCP tools without loading them all into context upfront

The LibreChat configuration to connect to a Kagent MCP server is minimal:

```yaml
# librechat.yaml
mcpServers:
  kagent-k8s:
    url: "http://kagent-mcp.kagent.svc.cluster.local:8080"
    chatMenu: true
```

Once connected, your engineers get a ChatGPT-like interface where they can ask questions like:

- *"Why is the payment-service pod crash-looping?"*
- *"Show me the p99 latency for the API gateway over the last hour"*
- *"Create a canary rollout for the new checkout service version"*

And the agent will autonomously query logs, metrics, and cluster state to provide answers and take action.

## Real-World Use Case: Self-Healing Clusters

Here's a practical example that ties everything together. Imagine this setup:

1. **Kagent agent** monitoring your cluster with Prometheus tools
2. **AlertManager** fires a webhook when a pod is OOMKilled
3. The agent receives the alert, inspects the pod's memory usage history, analyzes the container's resource limits, and **automatically patches the deployment** with appropriate resource requests
4. All of this is visible in **LibreChat** where your on-call engineer can see what happened and approve or rollback

This isn't theoretical — people are already building [self-healing Kubernetes setups](https://kyrylai.com/2025/05/23/build-a-self-healing-k8s-agent-with-librechat-mcp/) with exactly this stack.

## Why Not Just Use kubectl + Scripts?

Fair question. The difference is **reasoning**. A bash script follows a fixed path. A Kagent agent:

- **Plans**: breaks complex problems into steps
- **Adapts**: if the first approach doesn't work, it tries alternatives
- **Correlates**: connects information from different sources (logs + metrics + events)
- **Explains**: tells you *why* it took certain actions

And because agents are Kubernetes CRDs, you get all the operational benefits: RBAC, namespace isolation, GitOps workflows, audit logging.

## Getting Started

```bash
# Install Kagent with demo agents
kagent install --profile demo

# Open the dashboard
kagent dashboard

# Or use the CLI
kagent chat --agent k8s-troubleshooter
```

The demo profile comes with pre-built agents for Kubernetes troubleshooting, Prometheus queries, and Argo Rollouts management.

## The Bigger Picture

Kagent represents a shift in how we think about Kubernetes operations. Instead of building more dashboards and writing more runbooks, we're moving toward **agents that understand the system** and can act on it.

The MCP protocol is the glue that makes this practical. It's not about replacing engineers — it's about giving them AI teammates that speak the same protocols as the rest of the toolchain.

With Kagent as the brain, MCP as the nervous system, and LibreChat as the face, you get a setup where anyone on the team can interact with the cluster's AI capabilities through a familiar chat interface.

The future of platform engineering isn't more YAML. It's agents that write the YAML for you.

---

*Kagent is a CNCF sandbox project. Learn more at [kagent.dev](https://kagent.dev) and join the community on [Discord](https://bit.ly/kagentdiscord).*
