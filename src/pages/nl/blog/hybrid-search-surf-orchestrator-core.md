---
layout: ../../../layouts/BlogPost.astro
lang: nl
title: "Hoe We Hybrid Search Bouwden voor SURF's Orchestrator-Core — Komt in v5.0"
description: "Een samenwerking tussen Virge.io en SURF met een klein team resulteerde in een schema-agnostisch hybrid search systeem, volledig gebouwd op PostgreSQL. Zo hebben we het gedaan — en waarom het ertoe doet."
date: 2026-02-19
author: "Virge.io"
---

We zijn trots om een project te delen waar we aan hebben gewerkt met [SURF](https://www.surf.nl), de coöperatieve ICT-organisatie voor Nederlands onderwijs en onderzoek. Samen, met een klein maar gefocust team, hebben we een **hybrid search systeem** gebouwd voor [orchestrator-core](https://github.com/workfloworchestrator/orchestrator-core) — en het wordt meegeleverd in de aankomende **5.0 release**.

## De Uitdaging

Orchestrator-core is een open-source framework voor het beheren van productlevenscycli en workflows. Het draait op kritieke netwerkinfrastructuur bij organisaties zoals SURF, waar duizenden subscriptions, producten en workflows betrouwbaar beheerd moeten worden.

Het probleem? Deze domeinmodellen zijn **dynamisch en door gebruikers gedefinieerd**. Een enkele subscription kan honderden attributen bevatten, verdeeld over diep geneste structuren. Het doorzoekbare schema staat niet vast — het evolueert naarmate gebruikers nieuwe producten en product blocks definiëren.

Traditionele zoekoplossingen — Elasticsearch, statische kolom-indexen of simpele `LIKE`-queries — volstaan hier niet. We hadden iets nodig dat:

- Kan zoeken over **geneste, dynamische schema's** zonder de structuur vooraf te kennen
- **Full-text search** combineert met **semantische (vector) search**
- **Gestructureerd filteren** ondersteunt op getypeerde velden (datums, enums, booleans)
- **Binnen PostgreSQL** blijft — geen apart zoekinfrastructuur om te onderhouden
- **Veilig is voor AI-agents** om te bevragen zonder rauwe SQL te genereren

## De Oplossing: PostgreSQL-Native Hybrid Search

In plaats van externe zoekinfrastructuur eraan te plakken, bouwden we alles bovenop PostgreSQL met drie krachtige extensies:

### pgvector — Semantische Search

[pgvector](https://github.com/pgvector/pgvector) maakt vectorgebaseerde similarity search mogelijk, direct in PostgreSQL. We genereren embeddings voor tekstattributen en slaan ze op naast de data. Wanneer een gebruiker zoekt naar "netwerkverbinding in Amsterdam," begrijpt het systeem de *betekenis*, niet alleen de sleutelwoorden.

### pg_trgm — Fuzzy Text Search

PostgreSQL's [trigram-extensie](https://www.postgresql.org/docs/current/pgtrgm.html) verzorgt fuzzy matching en typfouttolerantie. Gecombineerd met full-text search vangt het queries op die semantische search alleen zou missen — zoals zoeken op een specifiek subscription-ID of een productcode met een typfout.

### ltree — Hiërarchische Paden

De [ltree-extensie](https://www.postgresql.org/docs/current/ltree.html) stelt ons in staat om de geneste structuur van domeinmodellen weer te geven als hiërarchische paden. Een veld als `subscription.product_block.interface.speed` wordt een doorzoekbaar boompad, waarmee queries op elk nestniveau mogelijk zijn.

### Reciprocal Rank Fusion

De magie zit in hoe deze retrievers samenwerken. We gebruiken **Reciprocal Rank Fusion (RRF)** om resultaten van semantische search, trigram matching en gestructureerde filters samen te voegen tot één uniforme ranking. Elke retriever levert zijn eigen ranking, en RRF combineert ze zonder scorenormalisatie.

## Schema-Agnostische Indexering met EAV

De kerninnovatie is onze **Entity-Attribute-Value (EAV) indexering**. In plaats van dynamische schema's te mappen naar vaste kolommen, ontleden we elke entiteit in individuele attribuutrijen:

```
entity_type: SUBSCRIPTION
entity_id: 550e8400-e29b-41d4-a716-446655440000
path: product.interface.speed
value: "10Gbps"
value_type: STRING
embedding: [0.023, -0.041, ...]
```

Elk attribuut krijgt zijn eigen rij met hiërarchisch pad (via ltree), getypeerde waarde en optionele embedding vector. Dit betekent:

- **Nieuwe producttypen** zijn direct doorzoekbaar — geen herindexering, geen migraties
- **Geneste attributen** op elke diepte zijn volledig bevraagbaar
- **Type safety** blijft behouden — datums zijn datums, booleans zijn booleans
- **Incrementele indexering** houdt de index gesynchroniseerd zonder volledige rebuilds

## Type-Safe Query DSL

Rauwe SQL-generatie door AI-agents is gevaarlijk. Eén gehallucineerde `DROP TABLE` en je dag is verpest. In plaats daarvan bouwden we een **Pydantic-gebaseerde Query DSL** die compileert naar gevalideerde SQL:

```python
query = SearchQuery(
    search="amsterdam network",
    filters=[
        FilterPredicate(
            path="product.status",
            operator="eq",
            value="active"
        )
    ],
    sort_by="created_at",
    limit=25
)
```

Dezelfde Pydantic-modellen dienen als **gestructureerde tool-argumenten voor PydanticAI**, waardoor AI-agents queries kunnen construeren via gevalideerde, beperkte interfaces. De agent raakt nooit SQL aan — hij vult een gestructureerd formulier in, en het systeem compileert het veilig.

## Waarom Dit Ertoe Doet

### Voor Netwerkbeheerders

SURF beheert netwerkinfrastructuur voor 100+ Nederlandse onderwijs- en onderzoeksinstellingen. Snelle, intelligente search over alle subscriptions, producten en workflows betekent dat operators in seconden vinden wat ze nodig hebben, in plaats van door geneste pagina's te klikken.

### Voor de Open-Source Community

Dit is geen propriëtaire oplossing — het gaat in **orchestrator-core 5.0** als open-source feature. Elke organisatie die orchestrator-core draait, krijgt hybrid search out of the box.

### Voor AI-Gedreven Operations

De Query DSL + AI agent-integratie betekent dat operators uiteindelijk in natuurlijke taal vragen kunnen stellen: *"Toon me alle 10Gbps interfaces in de regio Amsterdam die vorige maand zijn ingericht"* — en accurate, gevalideerde resultaten krijgen.

## Klein Team, Grote Impact

Een van de dingen waar we het meest trots op zijn, is hoe dit is bereikt. Dit was geen massaal project met tientallen engineers. Het was een **klein, gefocust team** dat nauw samenwerkte — de diepe domeinexpertise van SURF in netwerkorchestratie combinerend met onze ervaring in AI, search en Python backend-ontwikkeling.

Het resultaat? Een productierijpe feature die echte waarde toevoegt, efficiënt gebouwd en meegeleverd in een grote release.

## Technische Deep Dive

Voor de volledige technische details — inclusief de EAV-indexeringsimplementatie, retriever routing-strategie, keyset pagination en AI agent-architectuur — lees de uitstekende write-up van Tim Fröhlich: [Building a Schema-Agnostic Hybrid Search System in PostgreSQL](https://timfrohlich.com/blog/postgresql-hybrid-search).

## Wat Komt Er Nog

Met hybrid search in orchestrator-core 5.0 kijken we naar:

- **Uitgebreide AI agent-mogelijkheden** — natuurlijke taalqueries voor netwerkoperations
- **Aggregatie-ondersteuning** — analytics en rapportage op dynamische schema's
- **Cross-entity search** — uniforme search over subscriptions, workflows en processen
- **Performance-optimalisatie** — schalen naar miljoenen geïndexeerde attributen

Wil je meer weten over hoe wij search- en AI-oplossingen bouwen voor complexe systemen? [Neem contact op](/nl/contact/) — we horen graag over je uitdagingen.
