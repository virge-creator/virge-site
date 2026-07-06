---
layout: ../../../layouts/BlogPost.astro
lang: nl
title: "De WFO-agent instellen met LibreChat: zonder Kubernetes"
description: "Hoe we een multi-agent orkestratielaag bouwden met LibreChat op een gewone VPS - één UI, specialistagents per domein, MCP-verbonden backends en echte gebruikersidentiteit doorgestuurd bij elke aanroep."
date: 2026-07-06
author: "Virge.io Team"
image: "/images/librechat-agent-orchestrator.png"
imagePosition: "top"
tags: ["librechat","mcp","ai-agents","oidc","open-source","wfo"]
---

We wilden één chat-interface waarmee operators twee afzonderlijke backends konden bevragen en beheren - een shop/catalogusdienst en de Workflow Orchestrator (WFO) - zonder van tool te wisselen, API-sleutels te delen of een Kubernetes-cluster op te zetten. Zo hebben we het gedaan met LibreChat op een gewone VPS.

Als je de WFO-agent instelt en een concreet startpunt zoekt: dit is het.

Een team van AI-agents dat met elkaar communiceert, gebruikersmachtigingen respecteert en observeerbaar blijft, klinkt als een Kubernetes-verhaal: service mesh, A2A-endpoints, gecentraliseerd beleid, de hele stapel. En uiteindelijk, voor een serieus multi-tenant productiesysteem, is het dat ook. Maar we zijn er nog niet, en jij waarschijnlijk ook niet.

LibreChat regelt dit alles met een `docker compose up`: één UI, specialistagents per domein, MCP-verbonden backends en de echte identiteit van de ingelogde gebruiker doorgestuurd bij elke backend-aanroep.

Het is geen vervanging voor kagent of agentgateway, maar LibreChat kan prima fungeren als UI en orkestratielaag, ook wanneer je later doorgroeit naar die diensten. De agent- en MCP-configuratie blijft bruikbaar. Hoe dan ook werkt dit artikel als startpunt.

## Het idee

De opzet volgt een "planner + specialisten"-patroon: één orchestratoragent die verzoeken routeert, en specialistagents die elk een domein bezitten:

```
Gebruiker
 └─► Orchestratoragent           (routeert op intentie)
       ├─► Shop-admin-agent      (catalogus CRUD via shop MCP)
       └─► WFO-agent             (abonnementen/workflows via WFO MCP)
```

In een echte Kubernetes-opzet met iets als kagent zou elk van deze een langlevend A2A-endpoint zijn met zijn eigen pod en netwerkadres. Dat geeft je onafhankelijke deployment en schaling, maar het is veel infrastructuur voor een eerste proof of concept. LibreChat laat je dat allemaal overslaan; agents leven in hetzelfde proces, communiceren intern en delen de gebruikerssessie zonder netwerkverkeer.

### Hoe agents met elkaar communiceren

We gebruiken momenteel de **[Agent Chain](https://www.librechat.ai/docs/features/agents#agent-chain)**-functionaliteit van LibreChat, die een Mixture-of-Agents (MoA)-aanpak volgt: specialistagents zijn geregistreerd als chain-deelnemers, en elke agent ontvangt de output van de vorige agents als context. Het werkt goed en is stabiel.

Het patroon dat beter aansluit op wat we hier doen is echter **[Subagents](https://www.librechat.ai/docs/features/subagents)**, waarbij de orchestrator specialistagents op aanvraag spawnt als tool-aanroepen en tijdens runtime beslist welke te roepen en in welke volgorde. In de praktijk levert dit schonere resultaten op: de orchestrator plant vooraf in plaats van dat agents in een vaste volgorde lopen en mogelijk op doodlopende wegen stuiten op basis van hun positie in de chain. Subagents zijn in beta en hebben in onze ervaring betrouwbaar gewerkt, maar behandel ze dienovereenkomstig. Wanneer ze stabiel worden, is dit het patroon om naartoe te migreren.

### Identiteit: het onderdeel dat er echt toe doet

Wat dit meer dan een speeltje maakt, is dat LibreChat het echte OIDC-toegangstoken van de ingelogde gebruiker kan doorsturen bij elke MCP-aanroep. Dat betekent dat je backends de machtigingen van *die gebruiker* afdwingen - geen gedeelde servicesleutel, geen hardcoded beheerderstoken. Als iemand niet in de juiste Cognito-groep zit, krijgt hij een 403 van de backend, ongeacht welke agent hij gebruikt.

We gebruiken AWS Cognito. Elke keer dat een agent een tool aanroept, leest LibreChat het Cognito-toegangstoken van de ingelogde gebruiker uit MongoDB en injecteert het als `Authorization: Bearer <token>` in het verzoek. De shop-backend valideert het tegen het JWKS-endpoint van Cognito; de WFO-backend valideert het en stuurt hetzelfde token vervolgens stroomafwaarts door.

## De opzet

### Stap 1: `librechat.yaml`: registreer je backends als MCP-servers

Hier vertel je LibreChat over je backends en hoe ze bereikbaar zijn. Het cruciale onderdeel is de tijdelijke aanduiding `{{LIBRECHAT_OPENID_ACCESS_TOKEN}}` in de `Authorization`-header; daarmee wordt het token van de ingelogde gebruiker bij elke tool-aanroep ingevoegd.

```yaml
# Sta LibreChat toe private-IP-backends te bereiken (standaard geblokkeerd).
mcpSettings:
  allowedAddresses:
    - 'host.docker.internal:8080'   # je shop/catalogusbackend
    - 'host.docker.internal:8091'   # je workflow/WFO-backend

mcpServers:
  catalog:
    type: streamable-http
    url: http://host.docker.internal:8080/mcp/
    timeout: 120000
    requiresOAuth: false
    headers:
      Authorization: "Bearer {{LIBRECHAT_OPENID_ACCESS_TOKEN}}"

  workflows:
    type: streamable-http
    url: http://host.docker.internal:8091/mcp/
    timeout: 120000
    requiresOAuth: false
    headers:
      Authorization: "Bearer {{LIBRECHAT_OPENID_ACCESS_TOKEN}}"
```

Een paar opties die het waard zijn te begrijpen voordat je er tegenaan loopt:

- `mcpSettings.allowedAddresses`: LibreChat blokkeert standaard privé-IP's. Je moet expliciet elke host:poort vermelden waarop je backends draaien; zonder dit mislukken verbindingen stil en zul je tijd besteden aan uitzoeken waarom.
- `requiresOAuth: false`: zonder dit ziet de MCP-client van LibreChat een 401 van je backend en probeert hij zijn eigen OAuth-flow te starten, wat een kapotte omleidingslus oplevert. Je backend doet de tokenvalidatie; LibreChat hoeft de header alleen door te sturen.
- `{{LIBRECHAT_OPENID_ACCESS_TOKEN}}`: dit werkt alleen in via `librechat.yaml` gedefinieerde servers, niet in servers die via de UI zijn aangemaakt (dat is opzettelijk, zie [CVE GHSA-pmw7-gqwj-f954](https://github.com/advisories/GHSA-pmw7-gqwj-f954)).
- `timeout: 120000`: de standaard is te kort voor alles wat een echte backend-workflow activeert. Stel dit in.

### Stap 2: `.env`: authenticatie en hergebruik van tokens

De cruciale regel is `OPENID_REUSE_TOKENS=true`. Zonder dit is `{{LIBRECHAT_OPENID_ACCESS_TOKEN}}` altijd leeg en zien je backends nooit de identiteit van de gebruiker.

```dotenv
ALLOW_EMAIL_LOGIN=false
ALLOW_REGISTRATION=false
ALLOW_SOCIAL_LOGIN=true

OPENID_ISSUER=https://<jouw-idp>/<realm-of-pool>
OPENID_CLIENT_ID=<jouw-app-client-id>
OPENID_CLIENT_SECRET=<jouw-client-secret>   # weglaten + OPENID_USE_PKCE=true voor publieke clients
OPENID_SCOPE=openid profile email
OPENID_CALLBACK_URL=/oauth/openid/callback
OPENID_SESSION_SECRET=<willekeurige-hex>
OPENID_REUSE_TOKENS=true                    # vereist voor het doorsturen van tokens
```

Eén ding om goed in te stellen: de `OPENID_CLIENT_ID` die je voor LibreChat-login gebruikt, moet een client zijn die je backends al vertrouwen. Als je shop-backend tokens valideert tegen een specifieke Cognito-appclient, gebruik dan hier dezelfde client, niet een aparte M2M-client. De `aud`-claim van het token moet overeenkomen met wat de backend verwacht.

Tokenverversing wordt automatisch afgehandeld: LibreChat draait elke ~50 minuten een achtergrondtaak die tokens vernieuwt voor gebruikers wier toegangstoken bijna verloopt. Cognito-toegangstokens leven een uur, dus dit houdt sessies permanent actief. Het zwakke punt is het verversingstoken zelf; na 30 dagen in Cognito verloopt het en moeten gebruikers opnieuw inloggen. Als een verversing om welke reden dan ook mislukt, krijgt de volgende tool-aanroep een 401; log gewoon uit en weer in.

### Stap 3: bouw je agents in de UI

Zodra LibreChat draait en je MCP-servers verbonden zijn, ga je naar **Agents → Aanmaken**.

Bouw een **specialistagent per domein**, één voor de shop, één voor WFO. Koppel de relevante MCP-server en schrijf instructies die de agent in zijn domein verankeren. Eén ding dat de moeite waard is expliciet in de instructies op te nemen: als de backend 401 of 403 retourneert, vertel de gebruiker dan dat hij niet geautoriseerd is in plaats van opnieuw te proberen. De backend dwingt echte machtigingen af; de agent moet dat signaal respecteren.

Bouw vervolgens een **orchestratoragent**. Koppel er geen MCP-servers direct aan; zijn taak is routering, niet tool-gebruik. Voeg in het gedeelte Tools je specialistagents toe. Schrijf daarna een routeringstabel in de instructies:

```
You are an orchestrator. Delegate every request to the right specialist agent.

| User intent | Delegate to |
|||
| Catalog, products, categories, orders | catalog-admin |
| Subscriptions, workflows, processes | workflow-agent |
| Cross-domain (e.g. "does this subscription have a product?") | call both |

Rules:
- Always delegate; never answer from memory or call tools yourself.
- For cross-domain questions, chain both agents and synthesize the result.
- If a sub-agent returns 401/403, tell the user they don't have access — don't retry.
- Never modify data without confirming with the user first.
```

## Zien hoe het werkt: een echte domeinoverstijgende query

Dit is onze echte use case die laat zien waarom de multi-agent opzet de configuratie-overhead waard is. Een van onze shopVirge-winkels heeft een referralprogramma: klanten melden zich aan via een formulier, WFO maakt een "Pokémon card Customer"-abonnement aan en stuurt hen een magic link per e-mail. Door op die link te klikken wordt `referral_verified: true` ingesteld op hun WFO-abonnement en wordt een eenmalig te gebruiken `approvaltoken` opgeslagen in localStorage, dat de winkelwagen valideert bij het afrekenen. Eenmaal gebruikt is het token verdwenen - het wordt niet vastgelegd bij de bestelling.

De gebruiker vraagt:

> *"Ik vraag me af of sommige van mijn Pokémon card shop-referrals iets hebben besteld in de Pokémon card shop en hun referraltoken hebben gebruikt en nu beëindigd zijn."*

Dit is een vraag die geen enkele single-backend-agent kan beantwoorden. De orchestrator herkent onmiddellijk dat het beide systemen omspant en plant dienovereenkomstig: ga eerst naar WFO om beëindigde referrals te vinden, en vergelijk daarna met shopbestellingen.

De WFO-agent vindt 6 beëindigde "Pokémon card Customer"-abonnementen, elk met `referral_verified: true`. De shop-admin-agent haalt de bestelgeschiedenis op. Beide agents benoemen eerlijk dezelfde kanttekening: het `approvaltoken` wordt verbruikt bij het afrekenen en is niet opgeslagen in het WFO-abonnement of de shopbestelling, er is dus geen tokenveld om op te matchen. De enige beschikbare join-sleutel is e-mail, en dat is wat de orchestrator gebruikt.

Resultaat: **2 van de 6 beëindigde referrals hebben voltooide bestellingen geplaatst in de winkel**, gematcht op e-mail. De andere 4 hadden geen overeenkomende bestellingen.

Geen van de agents verzon een match toen de data er niet was, en geen van beide had de vraag alleen kunnen beantwoorden. De moeite waard te vergelijken met de Agent Chain-versie van dezelfde query: daar liep shop-admin als eerste (het staat eerst in de chain), stootte op het dode punt van het ontbrekende tokenveld, en de WFO-agent pakte het daarna op vanuit die context. Hetzelfde resultaat, maar de subagent-versie was doelgerichter; de orchestrator plande de volgorde van bewerkingen vooraf in plaats van de beperking halverwege te ontdekken.

## Hoe identiteit daadwerkelijk stroomt

De korte versie: elke tool-aanroep leest het toegangstoken van de ingelogde gebruiker uit MongoDB en vervangt het in de `Authorization`-header voordat je backend wordt aangeroepen.

```
Gebruiker stuurt een bericht
  → LibreChat deserialiseert req.user uit sessie
  → Leest federatedTokens.access_token uit MongoDB
  → Vervangt het in de Authorization-header gedefinieerd in librechat.yaml
  → Roept POST /mcp/ aan op de backend met dat token
  → Backend valideert tegen het JWKS-endpoint van de IdP
  → Backend dwingt groepslidmaatschap / machtigingen van die gebruiker af
```

Autorisatie gebeurt bij de backend, niet in LibreChat. LibreChat is een vertrouwde doorstuurder; het neemt geen toegangsbeslissingen. Je kunt iemand geen toegang verlenen door hem naar een andere agent te wijzen; de backend wijst hem af op basis van zijn feitelijke token.

Een gedeelde API-sleutel zou elke gebruiker dezelfde machtigingen geven, wat het doel tenietdoet. Met tokens per gebruiker kan een niet-admin gebruiker letterlijk geen schrijfbewerkingen uitvoeren, ongeacht welke agent hij gebruikt.

Eén ding dat we op de harde manier hebben geleerd: **identiteit sterft bij elke hop die het token niet doorstuurt**. Dit is waarom we `cagent` (Docker Agent) hebben laten vallen: zijn MCP/A2A-endpoints hebben geen ondersteuning voor inkomende authenticatie en headers zijn statisch, dus het gebruikerstoken haalde de eerste hop nooit. Elke tussenpersoon die je later introduceert, moet expliciet `Authorization: Bearer <gebruikerstoken>` doorsturen, anders verbreek je de identiteitsketen ongemerkt.

## Observeerbaarheid met Langfuse

Zonder observeerbaarheid is een agentorchestrator een zwarte doos. Wanneer er iets misgaat in een multi-agent chain die echte backends aanroept met echte gebruikersidentiteiten, moet je weten welke agent welke tool heeft aangeroepen, met welk token en hoe lang het duurde. LibreChat heeft native Langfuse-ondersteuning: drie omgevingsvariabelen en alles wordt getraceerd:

```dotenv
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_BASE_URL=https://cloud.langfuse.com   # of zelf-gehost
```

Standaard gebruiken traces de interne gebruikers-ID van LibreChat in plaats van iets menselijk leesbaars. Er is een open PR om dit te verbeteren, maar in de tussentijd laat een kleine patch van de `@librechat/agents`-fork je `LIBRECHAT_TRACE_USER_ID_FIELD=email` instellen om traces filterbaar te maken op het echte e-mailadres van de gebruiker in de Langfuse UI.

## Dingen waar je tegenaan loopt

**Je backend moet binden aan `0.0.0.0`, niet `127.0.0.1`.**
LibreChat bereikt backends via `host.docker.internal`, dat oplost naar de Docker bridge-gateway, niet loopback. Als je backend start op `127.0.0.1` (de standaard van uvicorn zonder `--host`), kan de container hem niet bereiken. Het symptoom is `fetch failed (request aborted, likely after a timeout)` in de LibreChat-logs, gevolgd door het openen van de circuit breaker. Start met `--host 0.0.0.0`.

**De circuit breaker heeft afkoeltijd nodig na fouten.**
Na 3 mislukte verbindingspogingen blokkeert de circuit breaker van LibreChat verdere pogingen gedurende maximaal 30 seconden (met een afkoelfase van 15 seconden als hij te snel cycelt). De backend repareren en `librechat.yaml` opslaan helpt niet meteen; wacht op de afkoeling of herstart de LibreChat API-container.

**`mcpSettings.allowedAddresses` moet exact overeenkomen.**
Als je MCP-URL `http://host.docker.internal:8080/mcp/` is maar je `allowedAddresses`-vermelding is `host.docker.internal:8081`, wordt de verbinding geblokkeerd zonder nuttige foutmelding. Zorg voor exacte overeenkomst van host en poort. Privé-IP's (`192.168.x.x`, `10.x.x.x`) moeten ook worden vermeld.

**`{{LIBRECHAT_OPENID_ACCESS_TOKEN}}` werkt alleen in `librechat.yaml`.**
Servers aangemaakt via de LibreChat UI kunnen geen identity-forwarding placeholders gebruiken; dat is opzettelijk (CVE GHSA-pmw7-gqwj-f954). Definieer identity-forwarding servers altijd in `librechat.yaml`.

**Agent chains draaien op volgorde, één tegelijk.**
Agents worden sequentieel uitgevoerd. Een domeinoverstijgende vraag duurt zo lang als de som van de round-trips van elke agent. Dit is meestal prima, maar het is de moeite waard te weten als latentie belangrijk is.

**De orchestrator moet expliciet zijn over wat er tussen agents moet worden doorgegeven.**
In Agent Chain-modus zien agents eerdere outputs, maar dat betekent niet dat de orchestratorinstructies vaag kunnen zijn. "Vraag shop-admin om de product-SKU en vraag dan workflow-agent of er een abonnement voor bestaat" moet expliciet worden uitgeschreven; zonder duidelijke begeleiding worden identificatoren niet altijd correct doorgegeven.

**Groepen worden ingesteld bij inloggen, niet live bijgewerkt.**
Als je een gebruiker na het inloggen aan een Cognito-groep toevoegt, bevat zijn huidige sessie nog steeds de oude groepslijst. Hij moet uitloggen en opnieuw inloggen. De achtergrondtokenverversing werkt de verlooptijd bij maar herleest geen groepclaims.

## Waar dit niet schaalt

Deze opzet is bewust eenvoudig, geschikt voor een enkele vertrouwde VPS. Wanneer je eruit groeit, loop je hier tegenaan:

- **Geen gecentraliseerd beleid.** Elke backend dwingt zijn eigen regels af. Een domeinoverstijgende beperking (bijv. "geen schrijfbewerkingen buiten kantooruren") betekent alle backends afzonderlijk aanpassen.
- **Geen mTLS.** Verkeer tussen LibreChat en je backends is gewone HTTP op het hostnetwerk. Prima voor een enkele VPS, niet voor een multi-tenant cluster.
- **Geen onafhankelijke schaling.** Alle agents draaien binnen het LibreChat-proces. Je kunt de WFO-agent niet schalen zonder alles te schalen.
- **Agents zijn niet afzonderlijk te deployen.** Ze kunnen niet onafhankelijk worden bijgewerkt of hergebruikt door een andere orchestrator buiten LibreChat.

Het antwoord op dit alles is een service mesh, een agent-gateway (agentgateway / kgateway) die gecentraliseerd beleid en RFC 8693 tokenuitwisseling afhandelt, en agents als onafhankelijke A2A-endpoints. Dat is veel meer infrastructuur, en voor Cognito specifiek heb je een aangepaste STS-shim nodig omdat het tokenuitwisseling niet native ondersteunt. De moeite waard te bouwen wanneer je het nodig hebt, niet eerder.

---

*Wil je verkennen hoe AI-agents je operaties kunnen automatiseren? [Neem contact op met Virge.io](/nl/contact) - we helpen teams agentic AI-oplossingen te implementeren op infrastructuur die ze al bezitten.*
