---
layout: ../../../layouts/BlogPost.astro
lang: nl
title: "Kagent + MCP + LibreChat: AI-Gestuurde Kubernetes Operaties met een Chat Interface"
description: "Hoe Kagent agentic AI naar Kubernetes brengt als CRDs, agents via MCP beschikbaar maakt voor tool-interoperabiliteit, en hoe LibreChat de perfecte chat-interface biedt om alles te orkestreren."
date: 2026-05-14
author: "Virge.io Team"
image: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&h=450&fit=crop"
tags: ["kubernetes","ai-agents","mcp","devops","open-source"]
---

Wat als je Kubernetes-cluster zichzelf kon troubleshooten? Niet met rigide runbooks, maar met AI-agents die redeneren over problemen, tools aan elkaar koppelen en actie ondernemen — allemaal gedefinieerd als Kubernetes custom resources, versiebeheerd in Git en uitgerold met `kubectl`.

Dat is precies wat **Kagent** doet. En wanneer je het combineert met het **Model Context Protocol (MCP)** en een chat-interface zoals **LibreChat**, krijg je iets bijzonders: een zelfherstellende infrastructuurstack met een strakke GUI erop.

## Wat is Kagent?

[Kagent](https://kagent.dev/) is een CNCF sandbox-project, gecreëerd door Solo.io in 2025. Het is een Kubernetes-native framework voor het bouwen, deployen en beheren van AI-agents. Het sleutelwoord is *native* — agents worden niet aan Kubernetes vastgeschroefd, ze *zijn* Kubernetes-resources.

Een agent-definitie ziet er zo uit:

```yaml
apiVersion: kagent.dev/v1
kind: Agent
metadata:
  name: k8s-troubleshooter
spec:
  description: "Diagnosticeert pod-fouten en netwerkproblemen"
  model:
    provider: anthropic
    name: claude-sonnet-4-5
  tools:
    - mcpServer: kubernetes-tools
    - mcpServer: prometheus-tools
  systemPrompt: |
    Je bent een Kubernetes operations expert.
    Wanneer een gebruiker een probleem meldt, onderzoek
    het eerst met beschikbare tools voordat je een
    oplossing voorstelt.
```

Definieer het in YAML, review het in een PR, deploy het met ArgoCD. Dezelfde GitOps-workflow die je al gebruikt voor al het andere.

### Kerncomponenten

- **Agents**: Systeemprompt + tools + LLM-configuratie, gedefinieerd als CRDs
- **Tools**: MCP-compatibele functies — pod logs, Prometheus queries, Helm operaties, Istio-configuratie, Cilium policies
- **Multi-runtime**: Go en Python ADK runtimes in hetzelfde cluster
- **Human-in-the-loop**: Goedkeuringsgates voor destructieve acties
- **Agent-to-Agent (A2A)**: Agents ontdekken en delegeren taken naar elkaar
- **Langetermijngeheugen**: Vector-gebaseerde persistentie over sessies heen

## De MCP-connectie: waarom het ertoe doet

Hier wordt het pas écht interessant. Kagent *consumeert* niet alleen MCP-tools — het werkt eraan om **agents zelf als MCP-servers te ontsluiten** ([GitHub issue #1160](https://github.com/kagent-dev/kagent/issues/1160)). Dit is een gamechanger voor interoperabiliteit.

### Wat MCP mogelijk maakt

Het [Model Context Protocol](https://modelcontextprotocol.io/) is een open standaard voor het verbinden van AI-modellen met externe tools en databronnen. Zie het als USB-C voor AI: één protocol, elke tool, elk model.

Met Kagent's MCP-ondersteuning:

1. **Agents consumeren MCP-tools**: Je k8s-troubleshooter agent kan elke MCP-server gebruiken — kubectl operaties, Prometheus queries, Grafana dashboards, custom HTTP endpoints
2. **Agents worden MCP-servers**: Andere tools (VS Code, Cursor, Claude Code, LibreChat) kunnen je Kagent-agents aanroepen alsof het gewoon een andere tool is
3. **Composability**: Bouw een keten waarbij LibreChat praat met een Kagent-agent, die delegeert naar sub-agents, die MCP-tools gebruiken — alles via een gestandaardiseerd protocol

Dit creëert een schone architectuur:

```
┌─────────────┐     MCP      ┌──────────┐     MCP      ┌────────────┐
│  LibreChat   │────────────▶│  Kagent   │────────────▶│ K8s Tools  │
│  (Chat GUI)  │             │  Agent    │             │ Prometheus │
│              │◀────────────│           │────────────▶│ Istio      │
└─────────────┘  responses   └──────────┘             └────────────┘
```

## LibreChat: de ontbrekende GUI-laag

Kagent wordt geleverd met een eigen dashboard, maar [LibreChat](https://www.librechat.ai/) tilt de ervaring naar een hoger niveau. Het is een open-source chat UI die MCP native ondersteunt, waardoor je Kagent-agents rechtstreeks kunt koppelen aan een gepolijste chat-interface.

### Waarom LibreChat perfect past

- **MCP-native**: Configureer MCP-servers in `librechat.yaml` en ze zijn direct beschikbaar voor agents
- **Multi-model**: Schakel tussen OpenAI, Anthropic, Ollama of elke OpenAI-compatibele endpoint
- **Agent builder**: Maak agents met specifieke toolsets, systeemprompts en modelconfiguraties — visueel
- **Deferred tools**: Laad MCP-tools on-demand in plaats van alles in het contextvenster te proppen
- **Self-hostable**: Deploy naast Kagent in je cluster

### Een praktische setup

Zo koppel je LibreChat aan een Kagent-agent die via MCP is ontsloten:

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
    chatMenu: true  # Beschikbaar in agent builder
```

Nu kan elke LibreChat-agent je Kubernetes-tools gebruiken. Een platform engineer typt "waarom geeft de checkout-service 503s terug?" en de agent:

1. Bevraagt pod-status via Kagent's k8s tools
2. Haalt foutlogs op van de falende pods
3. Checkt Prometheus op latency-pieken
4. Identificeert een OOMKilled container
5. Stelt voor om geheugenlimieten te verhogen — of doet het automatisch indien goedgekeurd

Alles via een strakke chat-interface, met volledige gespreksgeschiedenis en audit trail.

## Praktijkvoorbeelden

### Zelfherstellende deployments

Configureer een Kagent-agent die Prometheus-alerts monitort en automatisch storingen onderzoekt. Wanneer een pod crasht, controleert de agent logs, identificeert de oorzaak en lost het op of maakt een Jira-ticket aan met volledige diagnostiek.

Een recente [demonstratie](https://kyrylai.com/2025/05/23/build-a-self-healing-k8s-agent-with-librechat-mcp/) toonde een LibreChat + MCP agent die een kapotte Deployment detecteerde, de verkeerde image tag identificeerde, het manifest patchte en verifieerde dat alle pods weer gezond waren — in minder dan 30 seconden.

### GitOps-gestuurd agent management

Omdat agents CRDs zijn, beheer je ze als elke andere Kubernetes-resource:

```bash
# Deploy een nieuwe agent
kubectl apply -f agents/security-scanner.yaml

# Check agent status
kubectl get agents -n kagent-system

# Bekijk agent logs
kubectl logs -l kagent.dev/agent=security-scanner
```

Versiebeheer in Git, review wijzigingen in PRs, rollback met `kubectl rollout undo`. Je AI-agents volgen dezelfde levenscyclus als je applicaties.

### Multi-agent orkestratie

Kagent ondersteunt agent-teams met een planningsagent die delegeert:

- **Triage agent**: Classificeert binnenkomende alerts op ernst
- **Network agent**: Onderzoekt connectiviteitsproblemen met Istio/Cilium tools
- **Performance agent**: Analyseert Prometheus-metrics en stelt schaalwijzigingen voor
- **Security agent**: Scant op CVE's en misconfiguraties

De planningsagent routeert elk probleem naar de juiste specialist, en LibreChat geeft je een geünificeerd overzicht van alle gesprekken.

## Aan de slag

Het snelste pad naar een werkende setup:

```bash
# Installeer Kagent met demo agents
kagent install --profile demo

# Open het Kagent dashboard
kagent dashboard

# Of koppel LibreChat
helm install librechat librechat/librechat \
  --set mcpServers.kagent.url="http://kagent-mcp:8080/mcp"
```

Kagent ondersteunt alle grote LLM-providers: OpenAI, Anthropic, Google Vertex AI, Azure OpenAI en Ollama voor volledig lokale setups.

## Waarom dit belangrijk is voor platformteams

De combinatie Kagent + MCP + LibreChat lost drie problemen tegelijk op:

1. **Agent lifecycle**: Agents zijn Kubernetes-resources — deploy, versiebeheer, monitor en schaal met bestaande tools
2. **Tool interoperabiliteit**: MCP betekent geen vendor lock-in — wissel van LLM, wissel van UI, wissel van tools zonder agents te herschrijven
3. **Developer experience**: LibreChat geeft niet-DevOps teamleden een natural language interface naar infrastructuuroperaties

We bewegen naar een wereld waarin "kubectl" niet de enige manier is om een cluster te beheren. Natuurlijke taal, ondersteund door goed gedefinieerde agents met juiste guardrails, is een legitieme operations-interface.

Kagent is nog een CNCF sandbox-project, maar met Solo.io als backing en een groeiende community is het een van de meest interessante projecten in de cloud-native AI-ruimte op dit moment.

---

*Benieuwd hoe AI-agents je Kubernetes-operaties kunnen automatiseren? [Neem contact op met Virge.io](/nl/contact) — wij helpen teams bij het implementeren van cloud-native AI-oplossingen.*
