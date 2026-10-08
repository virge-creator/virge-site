---
layout: ../../../layouts/BlogPost.astro
lang: en
title: "Why (y)our agents need a gateway (part 1)"
description: "Who is calling, what may they do, and what does it cost? The cross-cutting questions of an agent network, and the requirements we have for a gateway to answer them once, at one front door."
date: 2026-10-08
author: "Virge.io Team"
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop"
tags: ["ai-agents","mcp","gateway","oidc","librechat","security"]
---

Setting up an agent network can get messy very quickly. There are plenty of "oh, we need that, and I want to connect to that MCP, and can we also think about..." moments, which means we might end up building a lot of things on top of our agent runtime. In [our last article](/en/blog/librechat-as-agent-orchestrator) we talked about how we set up that runtime: a handful of Pydantic AI agents (`shop`, `support`, `wfo`, ...) served as an OpenAI-compatible API, with LibreChat as the chat client in front and our shopvirge and wfo MCP servers behind it. But we haven't yet talked about the many what-ifs and other use cases that are still to come.

## Who is calling, and what may they do?

Let's start with something simple and crucial that we haven't fully thought about: who is calling, and what are they allowed to do? In other words, authentication and authorisation, for users and for machines.

For users this works today. LibreChat sends the user's own Cognito token along with every message.[^librechat-headers] Our agent runtime checks the user's Cognito groups to decide which agents they may talk to, and passes the same token on to the shopvirge and wfo MCP servers, which check again what this user may do. Simple, and it works, because we own every link in the chain.

*Pfff*, users, who cares about users, right! We only care about other agents. But that is where it gets interesting. Say we have an agent that looks for the latest TikTok trends for one of our shopvirge shops. It runs on its own, so there is no user token to pass on. The obvious move is to give it a machine-to-machine (M2M) token, the same kind our other services use. *Noooo!* That would make a massively over-privileged agent.

Our backends treat an M2M token as admin: shopvirge gives it full access and wfo skips the group check. Sure, the trends agent only knows the few shopvirge tools we gave it, like reading product descriptions. But that list lives in the agent's code, not in the token. The token itself can still change prices or delete products. So the only thing standing between the agent and admin rights is our own code getting every agent right, every time. One forgotten tool list, one new agent copied from an old one, or one token that ends up in a log or at someone else's MCP server, and it can do everything. We would rather have the server say no than trust every agent to say no to itself.[^embedauth-service-account][^mcp-scope]

Then there is the question of who did what. Today a call to our MCP servers carries exactly one identity. With the user's token, the backend sees the user but not the agent that acted for them. With an M2M token it sees neither: every token from our shared M2M client looks the same,[^cognito-m2m] so the shopvirge audit log can't tell the trends agent apart from any other service using that client. What we actually want is both at once: "this shop owner's request, carried out by the trends agent".[^spiffe][^rfc8693-act] For agents that is not the exception, it is the normal case: one message can turn into a dozen tool calls, all made by an agent on someone's behalf.

You might think an observability platform like Langfuse covers this. It helps, but not enough. LibreChat's trace knows the user, our runtime's trace knows which agent ran and which tools it called, and the backend's audit log knows which token was used. Three logs, three partial answers, and nothing links them.[^w3c-trace] When something goes wrong, we are matching timestamps.

"Just give every agent its own Cognito client" helps with the naming, but it brings its own chores: another secret to store and rotate, and another entry in every service that keeps a list of accepted clients.

## What do our agents call?

So far we looked at who calls us. The other side is what our agents call, and what they may do there. MCP itself has no standard way to give each user their own list of tools. Unless the server, or something in front of it, filters that list, an agent sees every tool a server offers, even the ones its user isn't allowed to use.[^redhat] In our case right now this isn't an issue. We own the whole chain from the shopvirge REST API/MCP to our LibreChat client, so our backend can check whether this user may use this tool or endpoint. But once we no longer own the MCP server, we can't add those checks, and the auth protocols change too: one MCP server has a static key, another wants cloud provider credentials, a third wants a full OAuth exchange.[^redhat][^agentgateway-authn] Worse, if we keep forwarding the user's Cognito token, we hand a third-party server a credential that our own backends accept.[^mcp-passthrough][^embedauth-forward] And each server reads that token its own way, so the same token can mean different things in different places.

Take Stripe's hosted MCP. For a single user it does the right thing: you log in with OAuth and Stripe applies your own permissions. But imagine shopvirge ran as a Stripe Connect platform, with every shop as a connected account. Stripe's MCP doesn't support OAuth for connected accounts. Instead the platform uses its own key, limited to what the agent needs, and picks the shop with a `Stripe-Account` header on each call. So Stripe knows it's us, and it knows which shop, but it has no idea which of our users or agents is behind the call. Whether this user may refund that order is up to whoever holds the key.[^stripe-mcp] Stripe can't check that, and we can't change Stripe, so something on our side has to.

## And what does it cost?

And all of this costs money, which brings us to the last crucial thing we haven't fully thought about: cost management. How do we manage our costs, and what about cost cut-offs?

At the moment we can see what each user costs in Langfuse and bill them afterwards. Langfuse can even ping us when spending crosses a threshold. But a ping is not a stop.[^langfuse-cost][^langfuse-alerts] Nothing rejects the next call when a user is over their allowance, there is no rate limit and there is no off switch. If nobody acts on the alert, the meter keeps running.

Remember the trends agent? For agents it is worse, because nobody is watching. How do we make sure it doesn't go over its spending limit? One agent stuck in a loop can burn through OpenAI credits overnight, and we can't just pass that bill on to the customer. OpenAI can put a hard spend limit on a whole project, but that stops every agent and every user at once: it knows our project, not our users or our agents.[^openai-limits] We need a hard cap on these things, per user and per agent.

Well, I think you get the point of cost management.

## Seen it before

So if we think just a tiny bit ahead, we can see that the future brings a bunch of small and bigger cross-cutting concerns: questions every single request has to answer (who are you, who are you acting for, what may you do, which credential goes to the next hop, and how much may you spend) that no single agent or MCP server should have to answer on its own. A gateway answers them once, at one front door, for everything behind it.

Good thing for us that most of this isn't a new, agent-only problem. We have seen these issues before with APIs. Public APIs such as Stripe's or OpenAI's give every customer an account with its own keys, its own limits and its own bill. Go over the limit and you get the familiar `429 Too Many Requests`. Stripe draws that line per account, OpenAI per organisation or project.[^stripe-rate][^openai-limits][^rfc6585] But those lines are drawn around customers like us, not around our users and our agents. Drawing the finer lines is our job. Inside companies, API gateways like Kong or AWS API Gateway have for years checked the token once at the door, routed the call to the right service and swapped in the credential that service needs.[^kong][^aws-a2a] Now there are agent gateways that bring the same ideas to agents and MCP servers.[^kong-ai][^agentgateway-authn]

What is new is the fine print. Costs are mostly counted in tokens, and you only know what a call cost once the answer is done: you know what you sent, but not how long the answer will be. In our setup most calls are made by an agent on someone else's behalf, so "who did this" usually has two answers.[^rfc8693-act] And MCP is new, with its own way of listing and calling tools. So: the same problems, with a few agent-shaped twists, and those twists are exactly what we need to check the gateways on.

## What we want from a gateway

Below is our list of requirements. In part 2 we use it to compare the existing gateways and see which one fits our problems best, the ones we have now and the ones we will face in the future. The first two rows are knock-outs: a gateway that fails either one is out, however well it does the rest.

| Requirement | Passes if | Why it matters |
|---|---|---|
| **Runs where we run** (knock-out) | Runs on a plain server with Docker, without Kubernetes and without a vendor's control plane. The features below are in the open-source version, not only in the paid one | We want to own the setup, and a feature behind a licence we don't buy doesn't count |
| **Stays out of the way** (knock-out) | Passes our agents' API through untouched: streaming, tool calls, errors, cancellation and long runs | If the gateway changes our responses on the way through, chat breaks in small ways: answers arrive in one lump, tool calls go missing, a stopped chat keeps running (and costing). We want to put a gateway in front of our agents, not rewrite them for it |
| **Knows who is calling** | Checks our identity provider's tokens (Cognito, Keycloak) and bases its rules on the claims in them, without its own user list. Every machine or agent gets its own identity | Users and machines both need a name, and machines shouldn't all share one admin token |
| **Knows who they act for** | Passes the user and the agent on together (token exchange with an `act` claim), instead of swapping in one service account | So the audit log can say "this shop owner's request, carried out by the trends agent", and the backend can decide on both |
| **Gives each backend its own key** | Uses a different credential per backend (API key, cloud credentials, OAuth exchange) and strips the original token | We should never hand our users' tokens to an MCP server we don't own |
| **Shows only what you may use** | Filters the list of agents and the list of tools per user or caller, and blocks calls to the rest | An agent picks from the tools it is shown. Show it tools its user may not use and it will try them, and then every backend has to get the refusal right |
| **Caps the spend** | Budgets per user and per agent, with a hard stop and a kill switch, that survive a restart | One looping agent can burn the budget overnight. An alert doesn't stop it, and the model provider only knows our project, not our users |
| **Tells you what happened** | Shows usage per user and agent (tokens, cost), in its own dashboard or as an export, and can alert on it. Traces carry the caller and link up with `traceparent` | We bill from this data, and when something goes wrong we want one trace from chat message to tool call, not three logs we line up by timestamp |
| **Speaks the agent protocols** | Proxies MCP and A2A with the same auth and limits, and rewrites A2A agent-card URLs to its own address | Everything above only works if all traffic goes through the gateway. If an agent can reach a tool over MCP, or another agent over A2A, without passing it, none of these checks apply. Same if an agent card hands out an internal address |
| **One exit to the models** | Also sits between our agents and the model providers, and ties each model call to the user and agent behind it | One chat message can mean ten model calls inside a single agent run, and the front door only sees one request in and one answer out. A gateway on the way out sees each call and its cost, so that is where a budget can stop the next call, and where we can switch models without touching the agents |
| **Setup and maintenance effort** | Few moving parts, config in git, an active project, upgrades we can follow | Time spent keeping the gateway running is money too. If it takes more effort than the problems it solves, we could just as well have built our own |


[^librechat-headers]: LibreChat, custom endpoint `headers`: supports `{{LIBRECHAT_OPENID_*}}` placeholders, among others. https://www.librechat.ai/docs/configuration/librechat_yaml/object_structure/custom_endpoint
[^embedauth-service-account]: embedauth, "OAuth token exchange explained": with a static service account, "Every authorization decision downstream collapses to 'is this service allowed,' which means the orders service must correctly enforce every user-level rule for every downstream system." https://embedauth.com/blog/oauth/oauth-token-exchange-explained
[^embedauth-forward]: embedauth, "OAuth token exchange explained", section "The three wrong answers", on forwarding user tokens: "If the inventory service is compromised, or simply has a logging bug that writes headers to disk, the attacker has a credential that works against billing, admin, everything." https://embedauth.com/blog/oauth/oauth-token-exchange-explained
[^mcp-scope]: MCP specification (2026-07-28), Security Best Practices, "Scope Minimization": a stolen broad token gives an "Expanded blast radius". https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices#scope-minimization
[^mcp-passthrough]: MCP specification (2026-07-28), Security Best Practices, "Token Passthrough", an "anti-pattern": "If the token is accepted by multiple services without proper validation, an attacker compromising one service can use the token to access other connected services." https://modelcontextprotocol.io/specification/2026-07-28/basic/security_best_practices#token-passthrough
[^cognito-m2m]: AWS, "Understanding the access token": in an M2M token "the `sub` and `client_id` claims have the same value", and there are no `cognito:groups`. https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-user-pools-using-the-access-token.html
[^spiffe]: Federico Carbone, "SPIFFE token exchange for agent workloads": "A protected API may see 'the agent service called me,' but not that a specific agent acted for a specific user after a specific tool decision." https://carbonefederico.github.io/blog-content/posts/spiffe-token-exchange-for-agent-workloads/
[^rfc8693-act]: RFC 8693, section 4.1: "The `act` (actor) claim provides a means within a JWT to express that delegation has occurred and identify the acting party to whom authority has been delegated." https://datatracker.ietf.org/doc/html/rfc8693#section-4.1
[^w3c-trace]: W3C Trace Context: "The `traceparent` HTTP header field identifies the incoming request in a tracing system." https://www.w3.org/TR/trace-context/
[^redhat]: Red Hat Developer, "Advanced authentication and authorization for an MCP gateway": "An agent sees all available tools, even if the user isn't authorized to use some of them." And: "Different MCP servers might require different authentication methods." https://developers.redhat.com/articles/2025/12/12/advanced-authentication-authorization-mcp-gateway
[^agentgateway-authn]: agentgateway, Backend authentication: static key, passthrough, cloud provider credentials, signed JWT, OAuth token exchange and Cross App Access. https://agentgateway.dev/docs/standalone/latest/documentation/configuration/security/backend-authn/
[^stripe-mcp]: Stripe, MCP, "Use MCP with connected accounts": "MCP doesn't support OAuth when acting on behalf of connected accounts. Instead, authenticate with a restricted API key for your platform and grant only the connected-account permissions that your agent needs." and "To make an MCP call as a connected account, pass the `Stripe-Account` header." From 2026-10-31 Stripe MCP only accepts OAuth or keys with the Agent tag. https://docs.stripe.com/mcp#connected-accounts
[^langfuse-cost]: Langfuse, Token and cost tracking: cost can be monitored "across models, tags, or users"; the page describes monitoring and alerts, no hard limits. https://langfuse.com/docs/observability/features/token-and-cost-tracking
[^langfuse-alerts]: Langfuse, Alerts (launched 2026-06-19): "Alerts allow you to catch cost and quality issues before they impact your users. You can receive notifications over Slack, trigger GitHub Actions, or call your own Webhooks." https://langfuse.com/docs/observability/features/alerts
[^openai-limits]: OpenAI, Rate limits: "Rate limits are defined at the organization level and at the project level, not user level." Spend limits per organization or project. https://developers.openai.com/api/docs/guides/rate-limits
[^stripe-rate]: Stripe, Rate limits: "per Stripe account"; exceeding them returns `429 Too Many Requests`. https://docs.stripe.com/rate-limits
[^rfc6585]: RFC 6585, section 4: "The 429 status code indicates that the user has sent too many requests in a given amount of time ("rate limiting")." https://datatracker.ietf.org/doc/html/rfc6585#section-4
[^kong]: Kong Gateway: "a lightweight, fast, and flexible cloud-native API gateway" with authentication, rate limiting and load balancing. https://developer.konghq.com/gateway/
[^aws-a2a]: AWS, "Building a serverless A2A gateway for agent discovery, routing, and access control". https://aws.amazon.com/blogs/machine-learning/building-a-serverless-a2a-gateway-for-agent-discovery-routing-and-access-control/
[^kong-ai]: Kong AI Gateway 3.14: A2A proxying, RFC 8693 token exchange, MCP tool filtering. https://konghq.com/blog/product-releases/kong-ai-gateway-3-14
