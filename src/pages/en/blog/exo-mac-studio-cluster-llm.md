---
layout: ../../../layouts/BlogPost.astro
lang: en
title: "exo: run 671B parameter models on a cluster of Mac Studios"
description: "The open-source exo framework turns multiple Mac Studios into a single AI supercomputer. Here's how to run DeepSeek V3 and other frontier models locally."
date: 2026-03-09
author: "Virge.io"
---

![](/images/exo-mac-cluster.png)


Running frontier AI models locally used to require enterprise-grade hardware. A 671 billion parameter model like DeepSeek V3 needs over 400GB of memory just to load — far beyond what any single consumer device can offer.

Enter **exo**, an open-source framework that clusters multiple Apple Silicon devices into a single distributed inference system. Four Mac Studios with 512GB RAM each suddenly becomes a 2TB unified memory pool capable of running the largest open-source models available.

The results are impressive: DeepSeek V3 (671B) runs at 5.37 tokens per second on a cluster of eight M4 Pro Mac Minis. That's faster than Llama 70B on the same hardware — despite having nearly 10x more parameters.

## How it works

exo pools computational resources from multiple machines — Mac Studios, Mac Minis, MacBooks — into a single distributed inference cluster. Devices running exo automatically discover each other on the network. No manual configuration required.

The magic happens through several key technologies:

**RDMA over Thunderbolt 5** — exo ships with day-0 support for Remote Direct Memory Access over Thunderbolt, enabling 99% reduction in latency between devices. Connect your Mac Studios with Thunderbolt cables and they communicate almost as if they were a single machine.

**Tensor Parallelism** — The framework shards models across devices intelligently. On 2 devices you get up to 1.8x speedup; on 4 devices up to 3.2x. This isn't just about fitting more parameters — it's about making inference faster.

**MLX distributed** — Under the hood, exo uses Apple's native [MLX](https://github.com/ml-explore/mlx) framework and its distributed computing capabilities. This means optimal performance on Apple Silicon with unified memory access patterns.

**Topology-aware auto-parallel** — exo figures out the best way to split your model based on a realtime view of your device topology, taking into account each device's resources and network latency between links.

## Why Apple Silicon is surprisingly good at this

Apple Silicon has a secret advantage for LLM inference that's often overlooked.

LLM inference at batch_size=1 (generating one token at a time for a single user) is typically **memory-bandwidth-bound**, not compute-bound. For each token, you need to load every parameter through the GPU, perform computations, and generate the next token.

The key metric is the ratio of memory bandwidth to compute (FLOPS):

| Device | Memory Bandwidth | FLOPS (FP16) | Ratio |
|--------|------------------|--------------|-------|
| M4 Max | 546 GB/s | ~34 TFLOPS | **8.02** |
| RTX 4090 | 1008 GB/s | ~330 TFLOPS | 1.52 |

The M4 Max has a ratio of 8.02 — over 5x better suited for memory-bound workloads than an RTX 4090. Apple Silicon's unified memory architecture means the GPU can access all system memory at full bandwidth, without the bottleneck of copying data across a PCIe bus.

This is why a cluster of Mac Studios can outperform what you'd expect on paper.

## The DeepSeek advantage

Here's where it gets interesting. DeepSeek V3 uses a Mixture of Experts (MoE) architecture — it has 671B total parameters, but only activates a small subset for each token.

Running on 8 × M4 Pro 64GB Mac Minis (512GB total):

| Model | Parameters | TTFT | Tokens/sec |
|-------|------------|------|------------|
| DeepSeek V3 (4-bit) | 671B | 2.91s | **5.37** |
| Llama 3.1 (4-bit) | 405B | 29.71s | 0.88 |
| Llama 3.3 (4-bit) | 70B | 3.14s | 3.89 |

DeepSeek V3 runs *faster* than Llama 70B despite having nearly 10x more total parameters. The MoE architecture means only a fraction of parameters are computed on for each token, dramatically reducing the memory bandwidth requirements.

This makes Chinese open-source models like DeepSeek and Qwen particularly attractive for local deployment — they deliver frontier-level capabilities while being more efficient to run.

## What you can build

A 4 × Mac Studio M3 Ultra (512GB each) cluster running exo can handle:

- **DeepSeek V3.1** (671B, 8-bit) — Full precision, no quantization compromise
- **Qwen3-235B** (8-bit) — Chinese/English bilingual reasoning
- **Kimi-K2-Thinking** (4-bit) — Extended reasoning capabilities
- **Llama 3.1 405B** — Meta's largest open model

The API is compatible with OpenAI, Claude, and Ollama — meaning your existing tools and clients work out of the box. Point your application at `localhost:52415` and it sees a ChatGPT-compatible endpoint powered by your local cluster.

## The economics

Let's compare running DeepSeek V3 locally versus cloud:

**Cloud (API pricing):**
- ~$0.14/million input tokens, ~$0.28/million output tokens
- Monthly cost for moderate usage: $500-2000+
- Data leaves your network

**Local cluster (4 × Mac Studio M3 Ultra 512GB):**
- Hardware: ~$32,000 one-time
- Power: ~$50/month
- Break-even: 16-32 months
- Data stays local

For enterprises with privacy requirements, compliance constraints, or predictable high-volume usage, the economics favor local deployment. And unlike cloud APIs, your cluster doesn't have rate limits or go down during peak demand.

## Getting started

Installation is straightforward on macOS:

```bash
# Clone exo
git clone https://github.com/exo-explore/exo
cd exo

# Build dashboard
cd dashboard && npm install && npm run build && cd ..

# Run exo
uv run exo
```

Each device running exo automatically discovers others on the network. The dashboard at `http://localhost:52415` shows your cluster status and lets you chat with models directly.

For optimal performance, connect devices with Thunderbolt 5 cables and enable RDMA (requires macOS 26.2+). This drops inter-device latency from milliseconds to microseconds.

## The bigger picture

exo represents a shift in how we think about AI infrastructure. Instead of massive centralized data centers, distributed inference enables:

- **Privacy-first AI** — Sensitive data never leaves your premises
- **Incremental scaling** — Add devices as needed, not all at once
- **Hardware flexibility** — Mix Mac Studios, Minis, and MacBooks
- **Cost predictability** — No per-token pricing surprises

The Chinese open-source AI ecosystem (DeepSeek, Qwen, Kimi) combined with Apple Silicon's memory bandwidth advantage and frameworks like exo creates a compelling alternative to cloud-dependent AI infrastructure.

For enterprises evaluating local LLM deployment, this stack deserves serious consideration.

---

*Building local AI infrastructure? We've been evaluating distributed inference setups and can help you architect the right solution. [Let's talk](/en/contact).*
