---
layout: ../../../layouts/BlogPost.astro
lang: nl
title: "GitNexus: Maak van elke codebase een doorzoekbare knowledge graph"
description: "GitNexus indexeert je hele repository in een interactieve knowledge graph — met alle dependencies, call chains en execution flows in kaart gebracht. Dit is waarom dat belangrijk is voor iedereen die met grote codebases werkt."
date: 2026-02-25
author: "Virge.io"
---

![GitNexus — Code Knowledge Graph](/images/gitnexus-knowledge-graph.png)

Als je ooit aan een groot project bent begonnen en dagen hebt besteed aan uitzoeken welk bestand wat aanroept, welke module waarvan afhangt, en wat er kapotgaat als je één functie aanpast — dan begrijp je precies het probleem dat [GitNexus](https://github.com/abhigyanpatwari/GitNexus) oplost.

## Wat is GitNexus?

GitNexus is een open-source tool die elke codebase indexeert in een **knowledge graph**. Elke functie, elke dependency, elke call chain, elke execution flow — in kaart gebracht en doorzoekbaar. Het draait volledig lokaal (CLI) of in de browser (Web UI), zonder server-infrastructuur.

Zie het als de stap van een platte lijst met bronbestanden naar een **levende kaart** van je software-architectuur.

## Waarom een knowledge graph beter werkt dan "gewoon de code lezen"

Grote codebases zijn misleidend complex. Een monorepo met 500+ bestanden kan duizenden impliciete relaties bevatten die geen enkele ontwikkelaar volledig overziet. Traditionele tools geven je:

- **grep/zoeken** — vindt tekstmatches, geen relaties
- **IDE "go to definition"** — toont één stap per keer
- **Documentatie** — vaak verouderd zodra het is geschreven

Een knowledge graph legt **structurele relaties** vast: welke functies welke aanroepen, hoe modules clusteren, en hoe de daadwerkelijke execution flows eruitzien. Dit is precies de informatie die je nodig hebt wanneer je:

- **Nieuwe teamleden inwerkt** — "Hoe werkt dit systeem eigenlijk?" wordt een verkenbare graaf in plaats van een weekje speurtocht
- **Refactors plant** — Voordat je een functie hernoemt of een module opsplitst, zie je de volledige impact door de hele codebase
- **Productie-issues debugt** — Volg een bug door de daadwerkelijke call chains in plaats van te gokken
- **Pull requests reviewt** — Begrijp de impact van een wijziging voorbij de bestanden die zijn aangepast
- **Dependencies auditet** — Zie welke delen van je systeem afhankelijk zijn van een specifieke library of interne module

Niets hiervan vereist AI. Het zijn fundamentele software-engineeringtaken die dramatisch eenvoudiger worden met een relatiekaart.

## Hoe het werkt

### CLI (aanbevolen voor dagelijks gebruik)

```bash
# Installeer globaal
npm install -g gitnexus

# Indexeer je repo (draai vanuit de project root)
gitnexus analyze

# Bekijk wat er geïndexeerd is
gitnexus status
```

De CLI slaat de knowledge graph lokaal op met [KuzuDB](https://kuzudb.com/), een embedded graph-database. Na indexering kun je direct queries uitvoeren of het beschikbaar maken voor je editor via MCP (Model Context Protocol).

### Web UI (ideaal voor verkenning)

Ga naar [gitnexus.vercel.app](https://gitnexus.vercel.app), voer een GitHub repo-URL of ZIP-bestand in, en krijg een interactieve grafvisualisatie. Alles draait in de browser — er verlaat geen data je machine.

### Belangrijkste functionaliteiten

| Feature | Wat het doet |
|---|---|
| **Hybride zoeken** | Combineert BM25-tekstzoeken met semantisch zoeken voor nauwkeurige resultaten |
| **Symbol context** | 360°-weergave van elk symbool — alle referenties, alle aanroepers, alle dependencies |
| **Impact-analyse** | Toont de blast radius van een wijziging met betrouwbaarheidsscores |
| **Change detection** | Koppelt git-diffs aan getroffen processen en execution flows |
| **Clusterdetectie** | Identificeert functionele groeperingen in je codebase met cohesiescores |
| **Process tracing** | Visualiseert complete execution flows stap voor stap |
| **Multi-repo support** | Indexeer en doorzoek meerdere repositories vanuit één server |

## Voor AI-ondersteunde ontwikkeling (maar niet alleen)

Ja, GitNexus integreert naadloos met AI-codeertools. Het biedt een MCP-server die editors zoals Cursor, Claude Code en Windsurf diep architecturaal inzicht geeft in je codebase. Hierdoor kunnen AI-assistenten dependencies begrijpen vóórdat ze wijzigingen voorstellen, in plaats van blind op individuele bestanden te werken.

Maar de kernwaarde is niet AI-specifiek. **Elke ontwikkelaar profiteert van de mogelijkheid om een codebase als graaf te doorzoeken.** De AI-integratie is een versterker bovenop een tool die op zichzelf al waardevol is.

## Privacy-first architectuur

Alles blijft lokaal:

- **CLI**: Indexering en queries draaien op je eigen machine, geen netwerkverkeer
- **Web UI**: Draait volledig in de browser via WebAssembly — geen server, geen data-upload
- **Bridge mode**: Verbind de web UI met je lokale CLI-server voor het beste van beide werelden

Dit maakt het geschikt voor propriëtaire codebases waar het versturen van code naar externe diensten geen optie is.

## Wanneer gebruiken

GitNexus is op z'n best wanneer je codebase het punt voorbij is waarop één persoon de volledige architectuur in het hoofd kan houden. Die drempel is lager dan de meeste teams denken — zelfs een goed gestructureerd project van 50 bestanden kan niet-voor-de-hand-liggende dependency chains hebben die onverwachte problemen veroorzaken.

Als je team tijd besteedt aan een van deze taken, is het de moeite waard om te proberen:

- "Wie roept deze functie aan?"-onderzoeken
- Impact-analyse vóór refactors
- Ontwikkelaars inwerken op complexe projecten
- Architectuurdocumentatie die daadwerkelijk actueel blijft
- Cross-module dependency-audits

## Aan de slag

```bash
npx gitnexus analyze
```

Eén commando. Je codebase, in kaart gebracht.

→ [GitHub repository](https://github.com/abhigyanpatwari/GitNexus) | [Web UI](https://gitnexus.vercel.app)
