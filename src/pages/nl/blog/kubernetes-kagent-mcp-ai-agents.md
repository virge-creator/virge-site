---
layout: ../../../layouts/BlogPost.astro
lang: nl
title: "Kagent + MCP: AI-agents die je Kubernetes-cluster echt begrijpen"
description: "Hoe Kagent agentic AI naar Kubernetes brengt als CRDs, agents via MCP ontsluit voor tools zoals LibreChat, en waarom dit een game-changer is voor platform engineering."
date: 2026-05-14
author: "Virge.io"
image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop"
tags: ["kubernetes","ai","agents","mcp","devops","kagent"]
---

Wat als je Kubernetes-cluster een AI-teamgenoot had die een falende deployment kon diagnosticeren, Prometheus kon bevragen op anomalieën, en een verkeerd geconfigureerde Gateway kon fixen — allemaal zonder dat jij een enkel kubectl-commando hoeft te typen?

Dat is geen toekomstmuziek. Het is **Kagent**, een CNCF sandbox-project dat agentic AI naar cloud-native omgevingen brengt als eersteklas Kubernetes-resources.

## Wat is Kagent?

[Kagent](https://kagent.dev) is in 2025 gecreëerd bij Solo.io en gedoneerd aan de Cloud Native Computing Foundation. Het is een open-source framework waarmee je AI-agents definieert als **Kubernetes Custom Resource Definitions (CRDs)** — ze worden dus geversioned in Git, gereviewd in PRs, en uitgerold met dezelfde tools die je al gebruikt.

De kernarchitectuur bestaat uit drie componenten:

- **Tools**: MCP-compatibele functies die agents gebruiken om met je cluster te interacteren. Ingebouwde tools zijn onder andere het ophalen van pod logs, Prometheus-queries, het genereren van K8s-manifests en het beheren van Argo Rollouts.
- **Agents**: Autonome systemen die multi-stap taken plannen, uitvoeren en analyseren met beschikbare tools. Elke agent heeft een system prompt, een modelconfiguratie en een set tools.
- **Framework**: Gebouwd op Google's Agent Development Kit (ADK), met een UI-dashboard, CLI en declaratieve YAML-interface.

Een typische agent-definitie ziet eruit als gewone Kubernetes YAML:

```yaml
apiVersion: kagent.dev/v1alpha2
kind: Agent
metadata:
  name: k8s-troubleshooter
  namespace: kagent
spec:
  description: "Diagnosticeert en fixt K8s deployment-issues"
  declarative:
    systemMessage: |
      Je bent een Kubernetes-expert. Diagnosticeer
      problemen door pod logs, events en metrics te checken.
    modelConfig:
      name: openai-gpt4
    tools:
      - name: kubernetes-tools
      - name: prometheus-tools
```

Dat is het. `kubectl apply -f agent.yaml` en je hebt een AI-agent die draait in je cluster.

## De MCP-connectie: waarom dit ertoe doet

Hier wordt het pas echt interessant. Kagent *consumeert* niet alleen MCP-tools — het spreekt MCP van nature. Dit betekent:

1. **Agents kunnen verbinden met elke MCP-server** voor nieuwe capabilities (database-toegang, externe API's, custom tooling)
2. **Agents zelf kunnen als MCP-servers worden ontsloten**, waardoor ze beschikbaar worden voor elke MCP-compatibele client
3. **Het A2A (Agent-to-Agent) protocol** maakt samenwerking tussen agents mogelijk, waarbij een planning-agent taken delegeert aan gespecialiseerde agents

### MCP-tools koppelen aan agents

Een MCP-tool toevoegen aan een Kagent-agent is eenvoudig. Je maakt een `MCPServer`-resource en verwijst ernaar in je agent:

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

Nu kan je agent webpagina's ophalen, documentatie lezen of externe API's aanroepen — terwijl het volledige toegang heeft tot de Kubernetes-tools van je cluster.

### Agents ontsluiten als MCP-servers

Dit is het game-changing deel. Kagent-agents kunnen via MCP ontsloten worden, wat betekent dat **elke tool die MCP spreekt met je Kubernetes-agents kan communiceren**. Denk aan wat dit mogelijk maakt:

- **VS Code / Cursor / Claude Code** kunnen je K8s troubleshooting-agent direct vanuit je editor aanroepen
- **LibreChat** kan een mooie chat-interface bieden bovenop je cluster-agents
- **Andere agents** in compleet andere systemen kunnen Kubernetes-taken delegeren aan je Kagent-agents

De architectuur ziet er zo uit:

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

## LibreChat: een productie-grade chat-GUI voor je agents

[LibreChat](https://www.librechat.ai) is een open-source chatplatform dat meerdere AI-providers ondersteunt en — cruciaal — **native MCP-integratie** biedt. Het is in feite een self-hosted ChatGPT-alternatief met volledige agent-capabilities.

Wanneer je LibreChat combineert met Kagent's MCP-ontsluiting, krijg je:

- **Een gepolijste chat-interface** voor interactie met je Kubernetes-agents
- **Multi-agent support**: configureer verschillende agents voor verschillende taken (debuggen, deployments, monitoring)
- **Gespreksgeschiedenis**: alle agent-interacties worden gelogd en zijn doorzoekbaar
- **Team-toegang**: meerdere engineers kunnen via een gedeelde UI met dezelfde agents werken
- **Deferred tool loading**: agents hebben toegang tot veel MCP-tools zonder ze allemaal tegelijk in context te laden

De LibreChat-configuratie om te verbinden met een Kagent MCP-server is minimaal:

```yaml
# librechat.yaml
mcpServers:
  kagent-k8s:
    url: "http://kagent-mcp.kagent.svc.cluster.local:8080"
    chatMenu: true
```

Eenmaal verbonden krijgen je engineers een ChatGPT-achtige interface waar ze vragen kunnen stellen als:

- *"Waarom crash-loopt de payment-service pod?"*
- *"Laat de p99 latency van de API gateway zien over het afgelopen uur"*
- *"Maak een canary rollout voor de nieuwe checkout-service versie"*

En de agent zal autonoom logs, metrics en clusterstatus bevragen om antwoorden te geven en actie te ondernemen.

## Praktijkcase: self-healing clusters

Hier is een praktisch voorbeeld dat alles samenbrengt. Stel je deze setup voor:

1. **Kagent-agent** monitort je cluster met Prometheus-tools
2. **AlertManager** vuurt een webhook af wanneer een pod OOMKilled wordt
3. De agent ontvangt het alert, inspecteert de memory-gebruikshistorie van de pod, analyseert de resource limits van de container, en **patcht automatisch de deployment** met passende resource requests
4. Dit alles is zichtbaar in **LibreChat** waar je on-call engineer kan zien wat er is gebeurd en kan goedkeuren of terugdraaien

Dit is geen theorie — ontwikkelaars bouwen al [self-healing Kubernetes setups](https://kyrylai.com/2025/05/23/build-a-self-healing-k8s-agent-with-librechat-mcp/) met precies deze stack.

## Waarom niet gewoon kubectl + scripts?

Terechte vraag. Het verschil zit in **reasoning**. Een bash-script volgt een vast pad. Een Kagent-agent:

- **Plant**: breekt complexe problemen op in stappen
- **Past zich aan**: als de eerste aanpak niet werkt, probeert het alternatieven
- **Correleert**: verbindt informatie uit verschillende bronnen (logs + metrics + events)
- **Legt uit**: vertelt je *waarom* het bepaalde acties heeft ondernomen

En omdat agents Kubernetes CRDs zijn, krijg je alle operationele voordelen: RBAC, namespace-isolatie, GitOps-workflows, audit logging.

## Aan de slag

```bash
# Installeer Kagent met demo-agents
kagent install --profile demo

# Open het dashboard
kagent dashboard

# Of gebruik de CLI
kagent chat --agent k8s-troubleshooter
```

Het demo-profiel wordt geleverd met kant-en-klare agents voor Kubernetes troubleshooting, Prometheus-queries en Argo Rollouts-beheer.

## Het grotere plaatje

Kagent vertegenwoordigt een verschuiving in hoe we denken over Kubernetes-operations. In plaats van meer dashboards bouwen en meer runbooks schrijven, bewegen we richting **agents die het systeem begrijpen** en ernaar kunnen handelen.

Het MCP-protocol is de lijm die dit praktisch maakt. Het gaat niet om het vervangen van engineers — het gaat om het geven van AI-teamgenoten die dezelfde protocollen spreken als de rest van de toolchain.

Met Kagent als het brein, MCP als het zenuwstelsel en LibreChat als het gezicht, krijg je een setup waarin iedereen in het team via een vertrouwde chat-interface met de AI-capabilities van het cluster kan interacteren.

De toekomst van platform engineering is niet meer YAML. Het zijn agents die de YAML voor je schrijven.

---

*Kagent is een CNCF sandbox-project. Meer info op [kagent.dev](https://kagent.dev) en join de community op [Discord](https://bit.ly/kagentdiscord).*
