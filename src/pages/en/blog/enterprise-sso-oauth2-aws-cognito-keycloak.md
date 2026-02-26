---
layout: ../../../layouts/BlogPost.astro
lang: en
title: "Enterprise SSO done right: how we integrated OAuth 2.0 with AWS Cognito for ShopVirge"
description: "Single Sign-On isn't just a checkbox feature — it's the backbone of enterprise identity. Here's how we built SSO integrations with AWS Cognito and why OAuth 2.0 expertise matters more than ever."
date: 2026-02-26
author: "Virge.io"
---

![](/images/enterprise-sso.png)


When enterprise clients evaluate your platform, one of the first questions they ask isn't about features or pricing — it's about authentication. *"Can we use our own identity provider? Do you support SSO? Is it OAuth 2.0 or SAML?"*

Get this wrong and you lose the deal. Get it right and you unlock a market segment that most SaaS platforms never reach.

Here's how we built enterprise-grade SSO for [ShopVirge](https://virge.io) using AWS Cognito — and what we learned along the way.

## Why SSO matters in eCommerce

In a B2C context, authentication is simple: email and password, maybe social login. But the moment you serve B2B clients — wholesale buyers, marketplace operators, multi-brand retailers — everything changes.

Enterprise buyers expect:

- **Single Sign-On** with their corporate identity provider (Azure AD, Okta, Google Workspace)
- **Role-based access control** that maps to their organizational structure
- **Compliance** with their security policies — no separate passwords, enforced MFA, audit trails
- **Automated provisioning** — when someone joins or leaves, access updates automatically

Without SSO, every enterprise onboarding becomes a manual, error-prone process. With it, their entire team gets secure access on day one.

## The architecture: AWS Cognito as identity broker

We chose AWS Cognito as the identity layer for ShopVirge because it acts as an **identity broker** — sitting between your application and any number of external identity providers.

The core flow:

1. **User hits the login page** → redirected to Cognito's hosted UI (or a custom UI backed by Cognito)
2. **Cognito checks the identity source** → could be its own user pool, a federated SAML provider, or an OIDC-compliant IdP
3. **OAuth 2.0 Authorization Code Flow** → Cognito handles the token exchange, issuing JWT access tokens and refresh tokens
4. **Application receives verified identity** → user profile, roles, and permissions all in a standardized format

This means we write the authentication logic once, and enterprise clients can plug in whatever identity provider they use.

### What this looks like in practice

For a typical enterprise client connecting Azure AD:

- We configure a SAML or OIDC federation in Cognito
- The client's IT team adds our application in their Azure AD tenant
- Attribute mapping translates their directory fields (department, role, group membership) into our application's permission model
- Users log in with their corporate credentials — no new passwords, no separate accounts

The entire setup takes hours, not weeks. And once it's configured, it's zero-maintenance.

## OAuth 2.0: the details that matter

OAuth 2.0 is a framework, not a recipe. The specification is flexible by design, which means there are countless ways to implement it — and most of them are wrong for your use case. Here's where our expertise makes a difference:

### Authorization Code Flow with PKCE

For web and mobile applications, we exclusively use the Authorization Code Flow with Proof Key for Code Exchange (PKCE). The implicit flow is deprecated for good reason — it exposes tokens in browser URLs. PKCE adds a cryptographic challenge that prevents authorization code interception attacks, even in public clients.

### Token lifecycle management

Getting tokens is easy. Managing them properly is where things get complex:

- **Short-lived access tokens** (15-60 minutes) with automatic refresh
- **Refresh token rotation** — every use issues a new refresh token, invalidating the old one
- **Token revocation on logout** — sounds obvious, but many implementations skip this
- **Scope management** — users get exactly the permissions they need, nothing more

### Machine-to-machine authentication

Not all authentication involves humans. Service-to-service communication — webhooks, API integrations, automated workflows — uses the OAuth 2.0 Client Credentials flow. Cognito issues scoped tokens for machine identities, replacing the fragile pattern of shared API keys.

### Multi-tenancy

ShopVirge serves multiple organizations on the same platform. Each tenant needs isolated identity management while sharing the same infrastructure. Cognito's user pool model maps well to this — we use custom attributes and groups to enforce tenant boundaries without spinning up separate instances.

## Beyond Cognito: Keycloak for self-hosted scenarios

Not every client runs on AWS. Some enterprises require on-premises identity management — either for compliance, data sovereignty, or because their infrastructure is built around different cloud providers.

For these scenarios, we bring in **Keycloak** — the open-source identity and access management platform. Our team has deep Keycloak expertise across:

- **Self-hosted deployments** on Kubernetes, Docker, or bare metal
- **Identity federation** with LDAP, Active Directory, and external SAML/OIDC providers
- **Custom authentication flows** — step-up authentication, conditional MFA, organization-specific login pages
- **Fine-grained authorization** with Keycloak's built-in policy engine

The beauty of building on OAuth 2.0 and OpenID Connect standards is that switching between Cognito and Keycloak — or running both — doesn't require rewriting application code. The token format is the same. The flows are the same. Only the infrastructure changes.

## Common pitfalls we've solved

After implementing SSO across multiple enterprise clients, these are the issues that catch teams off guard:

**Session synchronization.** When a user logs out of their corporate IdP, your application should log them out too. Implementing back-channel logout properly requires handling logout tokens and session invalidation across services.

**Attribute mapping conflicts.** Every IdP structures user data differently. Department might be a string in one system and a nested object in another. Building a flexible attribute mapping layer upfront saves endless debugging later.

**Clock skew in token validation.** JWTs contain timestamps. If your server clock is a few minutes off from Cognito's, valid tokens get rejected. We build in configurable tolerance windows.

**Rate limiting during federation.** When thousands of users authenticate through a federated IdP simultaneously (Monday morning, anyone?), you need proper queuing and retry logic to handle IdP rate limits gracefully.

**Migration from legacy auth.** Moving existing users from password-based auth to SSO without forcing everyone to re-register. Cognito's migration Lambda trigger handles this transparently — validating existing credentials on first login and migrating the account in the background.

## The business impact

For ShopVirge, proper SSO implementation unlocked enterprise clients that were previously out of reach. The numbers speak clearly:

- **Onboarding time** dropped from days to hours for new enterprise accounts
- **Support tickets** related to authentication dropped significantly — no more password reset requests from corporate users
- **Security posture** improved — centralized identity means centralized audit trails, enforced MFA, and automatic deprovisioning
- **Sales conversations** shortened — "Yes, we support SSO with your IdP" removes the biggest technical blocker in enterprise procurement

## When to invest in SSO

If you're building a B2B platform, the answer is: earlier than you think. We see three tipping points:

1. **Your first enterprise prospect asks about SSO** — if one is asking, more will follow
2. **You're managing passwords for other people's employees** — that's a liability you don't want
3. **You need role-based access that maps to organizational structures** — custom auth won't scale

The upfront investment in proper OAuth 2.0 architecture pays for itself the moment you close your first enterprise deal without a six-month "custom authentication integration" line item in the contract.

---

*Need SSO integration for your platform? Whether it's AWS Cognito, Keycloak, or a custom OAuth 2.0 implementation — [we've done it](/en/contact). Let's talk.*
