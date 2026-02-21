---
layout: ../../../layouts/BlogPost.astro
lang: en
title: "How We Built Hybrid Search for SURF's Orchestrator-Core — Coming in v5.0"
description: "A small team collaboration between Virge.io and SURF resulted in a schema-agnostic hybrid search system built entirely on PostgreSQL. Here's how we did it — and why it matters for network orchestration."
date: 2026-02-19
author: "Virge.io"
---

We're excited to share a project we've been working on with [SURF](https://www.surf.nl), the collaborative ICT organization for Dutch education and research. Together, with a small but focused team, we built a **hybrid search system** for [orchestrator-core](https://github.com/workfloworchestrator/orchestrator-core) — and it's shipping in the upcoming **5.0 release**.

## The Challenge

Orchestrator-core is an open-source framework for managing product lifecycles and workflows. It powers critical network infrastructure at organizations like SURF, where thousands of subscriptions, products, and workflows need to be managed reliably.

The problem? These domain models are **dynamic and user-defined**. A single subscription can contain hundreds of attributes distributed across deeply nested structures. The searchable schema isn't fixed — it evolves as users define new products and product blocks.

Traditional search approaches — Elasticsearch, static column indexes, or simple `LIKE` queries — don't cut it here. We needed something that could:

- Search across **nested, dynamic schemas** without knowing the structure at design time
- Combine **full-text search** with **semantic (vector) search**
- Support **structured filtering** on typed fields (dates, enums, booleans)
- Stay **inside PostgreSQL** — no separate search infrastructure to maintain
- Be **safe for AI agents** to query without generating raw SQL

## The Solution: PostgreSQL-Native Hybrid Search

Instead of bolting on external search infrastructure, we built everything on top of PostgreSQL using three powerful extensions:

### pgvector — Semantic Search

[pgvector](https://github.com/pgvector/pgvector) enables vector similarity search directly in PostgreSQL. We generate embeddings for text attributes and store them alongside the data. When a user searches for "network connection in Amsterdam," the system understands the *meaning*, not just the keywords.

### pg_trgm — Fuzzy Text Search

PostgreSQL's [trigram extension](https://www.postgresql.org/docs/current/pgtrgm.html) handles fuzzy matching and typo tolerance. Combined with full-text search, it catches queries that semantic search alone might miss — like searching for a specific subscription ID or a product code with a typo.

### ltree — Hierarchical Paths

The [ltree extension](https://www.postgresql.org/docs/current/ltree.html) lets us represent the nested structure of domain models as hierarchical paths. A field like `subscription.product_block.interface.speed` becomes a traversable tree path, enabling queries across any level of nesting.

### Reciprocal Rank Fusion

The magic is in how these retrievers work together. We use **Reciprocal Rank Fusion (RRF)** to merge results from semantic search, trigram matching, and structured filters into a single, unified ranking. Each retriever contributes its own ranking, and RRF combines them without requiring score normalization.

## Schema-Agnostic Indexing with EAV

The core innovation is our **Entity-Attribute-Value (EAV) indexing** approach. Instead of mapping dynamic schemas to fixed columns, we decompose each entity into individual attribute rows:

```
entity_type: SUBSCRIPTION
entity_id: 550e8400-e29b-41d4-a716-446655440000
path: product.interface.speed
value: "10Gbps"
value_type: STRING
embedding: [0.023, -0.041, ...]
```

Each attribute gets its own row with its hierarchical path (via ltree), typed value, and optional embedding vector. This means:

- **New product types** are searchable immediately — no reindexing, no migrations
- **Nested attributes** at any depth are fully queryable
- **Type safety** is preserved — dates are dates, booleans are booleans
- **Incremental indexing** keeps the index in sync without full rebuilds

## Type-Safe Query DSL

Raw SQL generation by AI agents is dangerous. One hallucinated `DROP TABLE` and your day is ruined. Instead, we built a **Pydantic-based Query DSL** that compiles into validated SQL:

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

The same Pydantic models serve as **structured tool arguments for PydanticAI**, allowing AI agents to construct queries through validated, constrained interfaces. The agent never touches SQL — it fills in a structured form, and the system compiles it safely.

## Why This Matters

### For Network Operators

SURF manages network infrastructure for 100+ Dutch educational and research institutions. Having fast, intelligent search across all subscriptions, products, and workflows means operators can find what they need in seconds instead of clicking through nested pages.

### For the Open-Source Community

This isn't a proprietary solution — it's going into **orchestrator-core 5.0** as an open-source feature. Any organization running orchestrator-core gets hybrid search out of the box.

### For AI-Driven Operations

The query DSL + AI agent integration means that operators can eventually ask questions in natural language: *"Show me all 10Gbps interfaces in the Amsterdam region that were provisioned last month"* — and get accurate, validated results.

## Small Team, Big Impact

One of the things we're most proud of is how this was achieved. This wasn't a massive project with dozens of engineers. It was a **small, focused team** working closely together — combining SURF's deep domain expertise in network orchestration with our experience in AI, search, and Python backend development.

The result? A production-ready feature that adds genuine value, built efficiently and shipping in a major release.

## Technical Deep Dive

For the full technical details — including the EAV indexing implementation, retriever routing strategy, keyset pagination, and AI agent architecture — check out the excellent write-up by Tim Fröhlich: [Building a Schema-Agnostic Hybrid Search System in PostgreSQL](https://timfrohlich.com/blog/postgresql-hybrid-search).

## What's Next

With hybrid search landing in orchestrator-core 5.0, we're looking at:

- **Enhanced AI agent capabilities** — natural language queries for network operations
- **Aggregation support** — analytics and reporting on dynamic schemas
- **Cross-entity search** — unified search across subscriptions, workflows, and processes
- **Performance optimization** — scaling to millions of indexed attributes

Want to learn more about how we build search and AI solutions for complex systems? [Get in touch](/en/contact/) — we'd love to hear about your challenges.
