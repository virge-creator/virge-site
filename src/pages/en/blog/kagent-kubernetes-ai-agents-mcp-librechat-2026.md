---
layout: ../../../layouts/BlogPost.astro
lang: en
title: "Kagent + MCP + LibreChat: Building AI-Powered Kubernetes Operations with a Chat GUI"
description: "How Kagent brings agentic AI to Kubernetes as CRDs, exposes agents via MCP for tool interoperability, and how LibreChat provides the perfect chat interface to orchestrate it all."
date: 2026-05-14
author: "Virge.io Team"
image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop"
tags: ["kubernetes","ai-agents","mcp","devops","open-source"]
---

What if your Kubernetes cluster could troubleshoot itself? Not with rigid runbooks, but with AI agents that reason about problems, chain tools together, and take action — all defined as Kubernetes custom resources, versioned in Git, and rolled out with `kubectl`.

That's exactly what **Kagent** does. And when you combine it with the **Model Context Protocol (MCP)** and a chat interface like **LibreChat**, you get something genuinely powerful: a self-healing infrastructure stack with a beautiful GUI on top.

## What is Kagent?

[Kagent](https://kagent.dev/) is a CNCF sandbox project created by Solo.io in 2025. It's a Kubernetes-native framework for building, deploying, and managing AI agents. The key word is *native* — agents aren't bolted onto Kubernetes, they *are* Kubernetes resources.

An agent definition looks like this:

```yaml
apiVersion: kagent.dev/v1
kind: Agent
metadata:
  name: k8s-troubleshooter
spec:
  description: "Diagnoses pod failures and network issues"
  model:
    provider: anthropic
    name: claude-sonnet-4-5
  tools:
    - mcpServer: kubernetes-tools
    - mcpServer: prometheus-tools
  systemPrompt: |
    You are a Kubernetes operations expert.
    When a user reports an issue, investigate using
    available tools before suggesting a fix.
```

Define it in YAML, review it in a PR, deploy it with ArgoCD. The same GitOps workflow you already use for everything else.

### Core components

- **Agents**: System prompt + tools + LLM config, defined as CRDs
- **Tools**: MCP-compatible functions — pod logs, Prometheus queries, Helm operations, Istio config, Cilium policies
- **Multi-runtime**: Go and Python ADK runtimes in the same cluster
- **Human-in-the-loop**: Approval gates before destructive actions
- **Agent-to-Agent (A2A)**: Agents can discover and delegate tasks to each other
- **Long-term memory**: Vector-backed persistence across sessions

## The MCP connection: why it matters

Here's where it gets interesting. Kagent doesn't just *consume* MCP tools — it's working toward **exposing agents as MCP servers** themselves ([GitHub issue #1160](https://github.com/kagent-dev/kagent/issues/1160)). This is a game-changer for interoperability.

### What MCP enables

The [Model Context Protocol](https://modelcontextprotocol.io/) is an open standard for connecting AI models to external tools and data sources. Think of it as USB-C for AI: one protocol, any tool, any model.

With Kagent's MCP support:

1. **Agents consume MCP tools**: Your k8s-troubleshooter agent can use any MCP server — kubectl operations, Prometheus queries, Grafana dashboards, custom HTTP endpoints
2. **Agents become MCP servers**: Other tools (VS Code, Cursor, Claude Code, LibreChat) can invoke your Kagent agents as if they were just another tool
3. **Composability**: Build a chain where LibreChat talks to a Kagent agent, which delegates to sub-agents, which use MCP tools — all through a standardized protocol

This creates a clean architecture:

```
┌─────────────┐     MCP      ┌──────────┐     MCP      ┌────────────┐
│  LibreChat   │────────────▶│  Kagent   │────────────▶│ K8s Tools  │
│  (Chat GUI)  │             │  Agent    │             │ Prometheus │
│              │◀────────────│           │────────────▶│ Istio      │
└─────────────┘   responses  └──────────┘             └────────────┘
```

## LibreChat: the missing GUI layer

Kagent ships with its own dashboard, but [LibreChat](https://www.librechat.ai/) takes the experience to another level. It's an open-source chat UI that supports MCP natively, meaning you can wire Kagent agents directly into a polished chat interface.

### Why LibreChat fits perfectly

- **MCP-native**: Configure MCP servers in `librechat.yaml` and they're instantly available to agents
- **Multi-model**: Switch between OpenAI, Anthropic, Ollama, or any OpenAI-compatible endpoint
- **Agent builder**: Create agents with specific tool sets, system prompts, and model configs — visually
- **Deferred tools**: Load MCP tools on-demand instead of stuffing everything into the context window
- **Self-hostable**: Deploy alongside Kagent in your cluster

### A practical setup

Here's how you'd connect LibreChat to a Kagent agent exposed via MCP:

```yaml
# librechat.yaml
mcpServers:
  kagent-k8s:
    url: "http://kagent-mcp.kagent-system:8080/mcp"
    tools:
      - get_pod_logs
      - query_prometheus
      - describe_deployment
      - rollout_restart
    chatMenu: true  # Available in agent builder
```

Now any LibreChat agent can use your Kubernetes tools. A platform engineer types "why is the checkout service returning 503s?" and the agent:

1. Queries pod status via Kagent's k8s tools
2. Pulls error logs from the failing pods
3. Checks Prometheus for latency spikes
4. Identifies an OOMKilled container
5. Suggests increasing memory limits — or does it automatically if approved

All through a clean chat interface, with full conversation history and audit trail.

## Real-world use cases

### Self-healing deployments

Configure a Kagent agent that monitors Prometheus alerts and automatically investigates failures. When a pod crashes, the agent checks logs, identifies the root cause, and either fixes it or creates a Jira ticket with full diagnostics.

A recent [demonstration](https://kyrylai.com/2025/05/23/build-a-self-healing-k8s-agent-with-librechat-mcp/) showed a LibreChat + MCP agent detecting a broken Deployment, identifying the wrong image tag, patching the manifest, and verifying all pods came back healthy — in under 30 seconds.

### GitOps-driven agent management

Since agents are CRDs, you can manage them like any other Kubernetes resource:

```bash
# Deploy a new agent
kubectl apply -f agents/security-scanner.yaml

# Check agent status
kubectl get agents -n kagent-system

# View agent logs
kubectl logs -l kagent.dev/agent=security-scanner
```

Version them in Git, review changes in PRs, roll back with `kubectl rollout undo`. Your AI agents follow the same lifecycle as your applications.

### Multi-agent orchestration

Kagent supports agent teams with a planning agent that delegates:

- **Triage agent**: Classifies incoming alerts by severity
- **Network agent**: Investigates connectivity issues with Istio/Cilium tools
- **Performance agent**: Analyzes Prometheus metrics and suggests scaling changes
- **Security agent**: Scans for CVEs and misconfigurations

The planning agent routes each problem to the right specialist, and LibreChat gives you a unified view of all conversations.

## Getting started

The quickest path to a working setup:

```bash
# Install Kagent with demo agents
kagent install --profile demo

# Open the Kagent dashboard
kagent dashboard

# Or connect LibreChat
helm install librechat librechat/librechat \
  --set mcpServers.kagent.url="http://kagent-mcp:8080/mcp"
```

Kagent supports all major LLM providers: OpenAI, Anthropic, Google Vertex AI, Azure OpenAI, and Ollama for fully local setups.

## Why this matters for platform teams

The combination of Kagent + MCP + LibreChat solves three problems at once:

1. **Agent lifecycle**: Agents are Kubernetes resources — deploy, version, monitor, scale with existing tools
2. **Tool interoperability**: MCP means no vendor lock-in — swap LLMs, swap UIs, swap tools without rewriting agents
3. **Developer experience**: LibreChat gives non-DevOps team members a natural language interface to infrastructure operations

We're moving toward a world where "kubectl" isn't the only way to operate a cluster. Natural language, backed by well-defined agents with proper guardrails, is a legitimate operations interface.

Kagent is still a CNCF sandbox project, but with Solo.io backing and a growing community, it's one of the most interesting projects in the cloud-native AI space right now.

---

*Want to explore how AI agents can automate your Kubernetes operations? [Contact Virge.io](/en/contact) — we help teams implement cloud-native AI solutions.*
