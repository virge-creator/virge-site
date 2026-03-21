---
layout: ../../../layouts/BlogPost.astro
title: "IEEE Bombshell: LLM Inference Is Fundamenteel Kapot op Hardware-Niveau"
description: "Turing Award-winnaar David Patterson onthult waarom GPU's het verkeerde gereedschap zijn voor AI inference. Geheugenbandbreedte, niet rekenkracht, is de echte bottleneck."
pubDate: 2026-03-21
author: "Virge.io Team"
heroImage: "/images/blog/llm-inference-hardware-broken/hero.png"
tags: ["AI", "Hardware", "LLM", "GPU", "Infrastructuur"]
---

Een baanbrekend paper geaccepteerd door IEEE Computer magazine dwingt de AI-industrie om een ongemakkelijke waarheid onder ogen te zien: **de hardware die we gebruiken voor LLM inference was er nooit voor ontworpen.**

Het onderzoek, geschreven door Google's Xiaoyu Ma en Turing Award-winnaar David Patterson, betoogt dat geheugen en interconnect—niet rekenkracht—de primaire bottlenecks zijn die large language model prestaties beperken. Na een decennium van jagen op steeds hogere GPU FLOPS, heeft de industrie mogelijk de verkeerde metric geoptimaliseerd.

## Het Kernprobleem: Een Kloof van 4,7x

Hier is de ongemakkelijke wiskunde:

- **GPU rekenkracht** is **80x** gegroeid in het afgelopen decennium
- **Geheugenbandbreedte** is slechts **17x** gegroeid

Dit verschil van 4,7x is geen kleine inefficiëntie—het is een fundamentele architecturale mismatch. Moderne GPU's zijn ontworpen met enorme rekenunits gekoppeld aan dure High Bandwidth Memory (HBM), geoptimaliseerd voor trainingsworkloads waar parallelle berekeningen domineren.

Maar inference is anders. De autoregressieve decode-fase van transformer-modellen genereert één token per keer, wat herhaalde geheugentoegang vereist in plaats van intensieve parallelle berekeningen. Je dure GPU-cores zitten werkeloos terwijl het systeem wacht op data uit het geheugen.

> "Large Language Model (LLM) inference is moeilijk. De autoregressieve Decode-fase van het onderliggende Transformer-model maakt LLM inference fundamenteel anders dan training. Verergerd door recente AI-trends zijn de primaire uitdagingen geheugen en interconnect in plaats van rekenkracht."
>
> — Xiaoyu Ma en David Patterson

## Waarom Dit Ertoe Doet: De $200 Miljard Vraag

Cloudproviders hebben meer dan **$200 miljard in GPU's** geïnvesteerd, maar hun omzet komt uit inference, niet training. En hier is het vuile geheim: veel organisaties kopen GPU's voornamelijk voor hun VRAM, niet hun rekencapaciteiten.

Dit creëert een bizarre economische situatie:

- **HBM wordt duurder** per GB en per GB/s over tijd
- **Standaard DDR blijft goedkoper worden** (langetermijntrend)
- Organisaties betalen voor rekenkracht die ze niet volledig kunnen benutten
- Geheugencapaciteit, niet FLOPS, bepaalt welke modellen je kunt serveren

De prijsinversie werkt andersom voor inference-workloads. Je betaalt premiumprijzen voor rekencapaciteiten die werkeloos zitten terwijl je geheugensubsysteem worstelt om bij te blijven.

## De Technische Realiteit: Memory-Bound Tot Aan de Bodem

Recent onderzoek van IBM en Barcelona Supercomputing Center bevestigt Patterson's bevindingen met harde data. Hun GPU-niveau analyse onthult:

- **L1 cache hit rates**: gemiddeld niet meer dan 12%
- **L2 cache hit rates**: gemiddeld slechts 2%
- **Hit rates dalen** naarmate batch size toeneemt

Zelfs bij grote batch sizes—waarvan conventionele wijsheid aannam dat ze workloads naar compute-bound territorium zouden verschuiven—blijft inference **hardnekkig memory-bound**. Het attention-mechanisme, cruciaal voor transformer-prestaties, toont DRAM-bandbreedteverzadiging als de belangrijkste beperkende factor.

Meer dan 50% van de attention kernel-cycli staan stil wachtend op data. Je GPU is niet traag—hij verhongert.

## Vier Paden Vooruit

Patterson's paper identificeert vier architecturale mogelijkheden om de geheugenbottleneck aan te pakken:

### 1. High Bandwidth Flash (HBF)

Sla bevroren modelgewichten op in flash-gebaseerd geheugen met HBM-achtige bandbreedte. SK Hynix, Samsung en SanDisk ontwikkelen HBF voor integratie in NVIDIA-, AMD- en Google-producten binnen 24 maanden.

De logica: modelgewichten veranderen niet tijdens inference, wat ze ideale kandidaten maakt voor hoge-capaciteit, lagere-bandbreedte opslag. Maak dure HBM vrij voor dynamische data zoals KV-caches.

### 2. Processing-Near-Memory (PNM)

Houd compute en geheugen gescheiden maar verminder dataverplaatsing door verwerkingselementen dichter bij het geheugen te plaatsen. In plaats van data naar compute te verplaatsen, verplaats compute naar data.

### 3. 3D Memory-Logic Stacking

Plaats geheugenlagen direct op compute-chips, wat de afstand die data moet afleggen dramatisch vermindert. Deze aanpak vereist fundamentele veranderingen in chipfabricage maar biedt de hoogste potentiële bandbreedtewinsten.

### 4. Low-Latency Interconnect

Versnel communicatie tussen chips in gedistribueerde inference-scenario's. Naarmate modellen groter worden dan single-GPU-capaciteit, wordt inter-chip communicatie een andere bottleneck.

## De Marktimplicaties

TrendForce voorspelt dat tegen 2029 **AI inference training zal inhalen** als primaire driver van vraag naar AI-servers. Deze verschuiving creëert strategische kansen:

**Voor hardwareleveranciers:**
- Geheugen-geoptimaliseerde inference-chips kunnen marge winnen van compute-gefocuste GPU's
- Custom silicon voor specifieke modelarchitecturen kan beter presteren dan general-purpose GPU's
- Het HBM-tekort (70%+ groei verwacht in 2026) creëert prijsmacht voor geheugenproducenten

**Voor AI-bedrijven:**
- Modelarchitectuurkeuzes die geheugenbandbreedtevereisten verminderen worden waardevoller
- Technieken zoals speculative decoding, die compute inruilen voor geheugenefficiëntie, winnen aan belang
- On-device inference met geoptimaliseerde geheugentoegangspatronen kan cloudinfernce overtreffen voor sommige workloads

**Voor cloudproviders:**
- Huidige GPU-vloten kunnen over-provisioned zijn voor inference-workloads
- Purpose-built inference-hardware (zoals Google's TPU inference-varianten) wordt aantrekkelijker
- Geheugencapaciteit, niet compute FLOPS, kan de primaire scaling-metric worden

## Wat Dit Betekent voor AI-Deployment

Als je AI-systemen deployt, heeft Patterson's onderzoek praktische implicaties:

### 1. Heroverweeg Hardwareselectie

Stop met alleen optimaliseren voor FLOPS. Geheugenbandbreedte en -capaciteit kunnen belangrijker zijn voor inference-workloads dan piek-rekenprestaties.

### 2. Monitor Geheugengebruik

Je GPU-gebruiksmetrics kunnen misleidend zijn. Hoge compute-utilisatie betekent niet efficiënte inference als geheugen de bottleneck is.

### 3. Overweeg Modelarchitectuur

Modellen die geheugentoegangspatronen minimaliseren (minder attention heads, efficiënt KV-cache management) kunnen in de praktijk beter presteren dan architecturaal "superieure" alternatieven.

### 4. Volg de Hardware-Roadmap

De volgende generatie AI inference-hardware kan er heel anders uitzien dan huidige GPU-ontwerpen. Purpose-built inference-chips kunnen binnen 2-3 jaar betere economics bieden.

## Het Grotere Plaatje

Patterson's geloofsbrieven geven dit onderzoek ongewoon gewicht. Als mede-schepper van RISC-processors en architect van Google's TPU heeft hij meerdere generaties computerhardware gevormd. Wanneer hij zegt dat de industrie het verkeerde heeft geoptimaliseerd, is het de moeite waard om te luisteren.

De AI-industrie heeft een decennium besteed aan de aanname dat meer GPU-rekenkracht inference-uitdagingen zou oplossen. Dit paper suggereert dat we fundamenteel moeten heroverwegen hoe we hardware ontwerpen voor AI-workloads—prioriteit geven aan geheugenbandbreedte en -capaciteit boven ruwe FLOPS.

De bedrijven die deze verschuiving vroeg herkennen en hun infrastructuur dienovereenkomstig aanpassen, zullen een significant voordeel hebben naarmate AI-deployment schaalt. Degenen die vasthouden aan compute-centrisch denken kunnen merken dat ze dure hardware hebben die de modellen die hun klanten eisen niet efficiënt kan serveren.

---

*Bij Virge helpen we organisaties het evoluerende AI-infrastructuurlandschap te navigeren. Begrip van hardwarebeperkingen is essentieel voor geïnformeerde beslissingen over modeldeployment en schaling. [Neem contact op](/nl/contact) om je AI-infrastructuurstrategie te bespreken.*

**Bron:** Ma, X., & Patterson, D. (2026). [Challenges and Opportunities for LLM Inference](https://arxiv.org/abs/2601.05047). Geaccepteerd voor publicatie in IEEE Computer magazine.
