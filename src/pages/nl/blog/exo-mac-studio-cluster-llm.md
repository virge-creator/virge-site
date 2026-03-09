---
layout: ../../../layouts/BlogPost.astro
lang: nl
title: "exo: draai 671B parameter modellen op een cluster van Mac Studios"
description: "Het open-source exo framework maakt van meerdere Mac Studios één AI-supercomputer. Zo draai je DeepSeek V3 en andere frontier modellen lokaal."
date: 2026-03-09
author: "Virge.io"
---

![](/images/exo-mac-cluster.png)


Frontier AI-modellen lokaal draaien vereiste vroeger enterprise-grade hardware. Een model van 671 miljard parameters zoals DeepSeek V3 heeft meer dan 400GB geheugen nodig alleen om te laden — ver voorbij wat een enkel consumenten-apparaat kan bieden.

Enter **exo**, een open-source framework dat meerdere Apple Silicon apparaten clustert tot één gedistribueerd inference-systeem. Vier Mac Studios met elk 512GB RAM worden plotseling een 2TB unified memory pool die de grootste open-source modellen kan draaien.

De resultaten zijn indrukwekkend: DeepSeek V3 (671B) draait op 5.37 tokens per seconde op een cluster van acht M4 Pro Mac Minis. Dat is sneller dan Llama 70B op dezelfde hardware — ondanks bijna 10x meer parameters.

## Hoe het werkt

exo bundelt computationele resources van meerdere machines — Mac Studios, Mac Minis, MacBooks — in één gedistribueerd inference-cluster. Apparaten die exo draaien ontdekken elkaar automatisch op het netwerk. Geen handmatige configuratie nodig.

De magie gebeurt door verschillende sleuteltechnologieën:

**RDMA over Thunderbolt 5** — exo heeft day-0 support voor Remote Direct Memory Access over Thunderbolt, wat 99% reductie in latency tussen apparaten mogelijk maakt. Verbind je Mac Studios met Thunderbolt-kabels en ze communiceren bijna alsof ze één machine zijn.

**Tensor Parallelism** — Het framework shard modellen intelligent over apparaten. Op 2 apparaten krijg je tot 1.8x speedup; op 4 apparaten tot 3.2x. Dit gaat niet alleen over meer parameters fitten — het maakt inference sneller.

**MLX distributed** — Onder de motorkap gebruikt exo Apple's native [MLX](https://github.com/ml-explore/mlx) framework en diens distributed computing capabilities. Dit betekent optimale performance op Apple Silicon met unified memory access patterns.

**Topology-aware auto-parallel** — exo bepaalt de beste manier om je model te splitsen gebaseerd op een realtime view van je device-topologie, rekening houdend met resources en netwerklatency tussen apparaten.

## Waarom Apple Silicon verrassend goed is hierin

Apple Silicon heeft een verborgen voordeel voor LLM-inference dat vaak over het hoofd wordt gezien.

LLM-inference bij batch_size=1 (één token per keer genereren voor één gebruiker) is typisch **memory-bandwidth-bound**, niet compute-bound. Voor elke token moet je elke parameter door de GPU laden, berekeningen uitvoeren, en de volgende token genereren.

De sleutelmetric is de ratio van memory bandwidth tot compute (FLOPS):

| Apparaat | Memory Bandwidth | FLOPS (FP16) | Ratio |
|----------|------------------|--------------|-------|
| M4 Max | 546 GB/s | ~34 TFLOPS | **8.02** |
| RTX 4090 | 1008 GB/s | ~330 TFLOPS | 1.52 |

De M4 Max heeft een ratio van 8.02 — meer dan 5x beter geschikt voor memory-bound workloads dan een RTX 4090. Apple Silicon's unified memory architectuur betekent dat de GPU al het systeemgeheugen kan benaderen op volledige bandbreedte, zonder de bottleneck van data kopiëren over een PCIe-bus.

Dit is waarom een cluster van Mac Studios beter presteert dan je op papier zou verwachten.

## Het DeepSeek-voordeel

Hier wordt het interessant. DeepSeek V3 gebruikt een Mixture of Experts (MoE) architectuur — het heeft 671B totale parameters, maar activeert slechts een kleine subset voor elke token.

Draaiend op 8 × M4 Pro 64GB Mac Minis (512GB totaal):

| Model | Parameters | TTFT | Tokens/sec |
|-------|------------|------|------------|
| DeepSeek V3 (4-bit) | 671B | 2.91s | **5.37** |
| Llama 3.1 (4-bit) | 405B | 29.71s | 0.88 |
| Llama 3.3 (4-bit) | 70B | 3.14s | 3.89 |

DeepSeek V3 draait *sneller* dan Llama 70B ondanks bijna 10x meer totale parameters. De MoE-architectuur betekent dat slechts een fractie van de parameters wordt berekend voor elke token, wat de memory bandwidth requirements drastisch verlaagt.

Dit maakt Chinese open-source modellen zoals DeepSeek en Qwen bijzonder aantrekkelijk voor lokale deployment — ze leveren frontier-level capabilities terwijl ze efficiënter draaien.

## Wat je kunt bouwen

Een 4 × Mac Studio M3 Ultra (512GB elk) cluster met exo kan draaien:

- **DeepSeek V3.1** (671B, 8-bit) — Volledige precisie, geen quantisatie-compromis
- **Qwen3-235B** (8-bit) — Chinees/Engels tweetalig reasoning
- **Kimi-K2-Thinking** (4-bit) — Extended reasoning capabilities
- **Llama 3.1 405B** — Meta's grootste open model

De API is compatibel met OpenAI, Claude en Ollama — wat betekent dat je bestaande tools en clients out-of-the-box werken. Wijs je applicatie naar `localhost:52415` en het ziet een ChatGPT-compatible endpoint aangedreven door je lokale cluster.

## De economie

Laten we DeepSeek V3 lokaal draaien vergelijken met cloud:

**Cloud (API pricing):**
- ~$0.14/miljoen input tokens, ~$0.28/miljoen output tokens
- Maandelijkse kosten bij matig gebruik: $500-2000+
- Data verlaat je netwerk

**Lokaal cluster (4 × Mac Studio M3 Ultra 512GB):**
- Hardware: ~€30.000 eenmalig
- Stroom: ~€50/maand
- Break-even: 16-32 maanden
- Data blijft lokaal

Voor enterprises met privacy-eisen, compliance-beperkingen, of voorspelbaar hoog-volume gebruik, zijn de economics gunstig voor lokale deployment. En in tegenstelling tot cloud APIs heeft je cluster geen rate limits en gaat niet down tijdens piekbelasting.

## Aan de slag

Installatie is eenvoudig op macOS:

```bash
# Clone exo
git clone https://github.com/exo-explore/exo
cd exo

# Build dashboard
cd dashboard && npm install && npm run build && cd ..

# Run exo
uv run exo
```

Elk apparaat dat exo draait ontdekt automatisch anderen op het netwerk. Het dashboard op `http://localhost:52415` toont je clusterstatus en laat je direct met modellen chatten.

Voor optimale performance, verbind apparaten met Thunderbolt 5 kabels en schakel RDMA in (vereist macOS 26.2+). Dit verlaagt inter-device latency van milliseconden naar microseconden.

## Het grotere plaatje

exo representeert een verschuiving in hoe we denken over AI-infrastructuur. In plaats van massieve gecentraliseerde datacenters, maakt distributed inference mogelijk:

- **Privacy-first AI** — Gevoelige data verlaat nooit je premises
- **Incrementeel schalen** — Voeg apparaten toe als nodig, niet alles tegelijk
- **Hardware flexibiliteit** — Mix Mac Studios, Minis en MacBooks
- **Kosten voorspelbaarheid** — Geen per-token prijsverrassingen

Het Chinese open-source AI ecosysteem (DeepSeek, Qwen, Kimi) gecombineerd met Apple Silicon's memory bandwidth voordeel en frameworks zoals exo creëert een overtuigend alternatief voor cloud-afhankelijke AI-infrastructuur.

Voor enterprises die lokale LLM-deployment evalueren, verdient deze stack serieuze overweging.

---

*Lokale AI-infrastructuur bouwen? We hebben distributed inference setups geëvalueerd en kunnen je helpen de juiste oplossing te architecten. [Laten we praten](/nl/contact).*
