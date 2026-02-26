---
layout: ../../../layouts/BlogPost.astro
lang: nl
title: "Enterprise SSO goed aanpakken: hoe we OAuth 2.0 met AWS Cognito integreerden voor ShopVirge"
description: "Single Sign-On is geen checkbox-feature — het is de ruggengraat van enterprise identity. Zo bouwden we SSO-integraties met AWS Cognito en waarom OAuth 2.0-expertise er meer toe doet dan ooit."
date: 2026-02-26
author: "Virge.io"
---

Wanneer enterprise-klanten je platform evalueren, is een van de eerste vragen niet over features of prijzen — het gaat over authenticatie. *"Kunnen we onze eigen identity provider gebruiken? Ondersteunen jullie SSO? Is het OAuth 2.0 of SAML?"*

Doe dit verkeerd en je verliest de deal. Doe het goed en je ontsluit een marktsegment dat de meeste SaaS-platforms nooit bereiken.

Hier is hoe we enterprise-grade SSO bouwden voor [ShopVirge](https://virge.io) met AWS Cognito — en wat we onderweg geleerd hebben.

## Waarom SSO ertoe doet in eCommerce

In een B2C-context is authenticatie simpel: e-mail en wachtwoord, misschien social login. Maar zodra je B2B-klanten bedient — groothandelskopers, marketplace-operators, multi-brand retailers — verandert alles.

Enterprise-kopers verwachten:

- **Single Sign-On** met hun corporate identity provider (Azure AD, Okta, Google Workspace)
- **Role-based access control** die past bij hun organisatiestructuur
- **Compliance** met hun beveiligingsbeleid — geen aparte wachtwoorden, afgedwongen MFA, audit trails
- **Geautomatiseerde provisioning** — wanneer iemand start of vertrekt, worden toegangsrechten automatisch bijgewerkt

Zonder SSO wordt elke enterprise-onboarding een handmatig, foutgevoelig proces. Met SSO heeft hun hele team vanaf dag één veilige toegang.

## De architectuur: AWS Cognito als identity broker

We kozen AWS Cognito als identity-laag voor ShopVirge omdat het fungeert als een **identity broker** — het zit tussen je applicatie en een willekeurig aantal externe identity providers.

De kernflow:

1. **Gebruiker opent de loginpagina** → wordt doorgestuurd naar Cognito's hosted UI (of een custom UI op Cognito)
2. **Cognito controleert de identity source** → kan de eigen user pool zijn, een gefedereerde SAML-provider, of een OIDC-compliant IdP
3. **OAuth 2.0 Authorization Code Flow** → Cognito handelt de token exchange af en geeft JWT access tokens en refresh tokens uit
4. **Applicatie ontvangt geverifieerde identiteit** → gebruikersprofiel, rollen en permissies in een gestandaardiseerd formaat

Dit betekent dat we de authenticatielogica één keer schrijven, en enterprise-klanten hun eigen identity provider kunnen aansluiten.

### Hoe dit er in de praktijk uitziet

Voor een typische enterprise-klant die Azure AD koppelt:

- We configureren een SAML- of OIDC-federatie in Cognito
- Het IT-team van de klant voegt onze applicatie toe in hun Azure AD-tenant
- Attribute mapping vertaalt hun directory-velden (afdeling, rol, groepslidmaatschap) naar ons permissiemodel
- Gebruikers loggen in met hun bedrijfsgegevens — geen nieuwe wachtwoorden, geen aparte accounts

De hele setup kost uren, geen weken. En eenmaal geconfigureerd is het onderhoudvrij.

## OAuth 2.0: de details die het verschil maken

OAuth 2.0 is een framework, geen recept. De specificatie is bewust flexibel, wat betekent dat er talloze manieren zijn om het te implementeren — en de meeste zijn verkeerd voor jouw use case. Hier maakt onze expertise het verschil:

### Authorization Code Flow met PKCE

Voor web- en mobiele applicaties gebruiken we uitsluitend de Authorization Code Flow met Proof Key for Code Exchange (PKCE). De implicit flow is om goede redenen deprecated — het legt tokens bloot in browser-URL's. PKCE voegt een cryptografische challenge toe die authorization code interception-aanvallen voorkomt, zelfs bij public clients.

### Token lifecycle management

Tokens verkrijgen is makkelijk. Ze goed beheren is waar het complex wordt:

- **Kortlevende access tokens** (15-60 minuten) met automatische refresh
- **Refresh token rotation** — elk gebruik geeft een nieuw refresh token uit en ongeldigverklaard het oude
- **Token revocation bij logout** — klinkt vanzelfsprekend, maar veel implementaties slaan dit over
- **Scope management** — gebruikers krijgen exact de permissies die ze nodig hebben, niets meer

### Machine-to-machine authenticatie

Niet alle authenticatie betreft mensen. Service-to-service communicatie — webhooks, API-integraties, geautomatiseerde workflows — gebruikt de OAuth 2.0 Client Credentials-flow. Cognito geeft scoped tokens uit voor machine-identiteiten, ter vervanging van het fragiele patroon van gedeelde API-keys.

### Multi-tenancy

ShopVirge bedient meerdere organisaties op hetzelfde platform. Elke tenant heeft geïsoleerd identiteitsbeheer nodig, terwijl ze dezelfde infrastructuur delen. Cognito's user pool-model past hier goed bij — we gebruiken custom attributes en groepen om tenant-grenzen af te dwingen zonder aparte instances op te starten.

## Verder dan Cognito: Keycloak voor self-hosted scenario's

Niet elke klant draait op AWS. Sommige enterprises vereisen on-premises identiteitsbeheer — vanwege compliance, datasoevereiniteit, of omdat hun infrastructuur rond andere cloudproviders is gebouwd.

Voor deze scenario's zetten we **Keycloak** in — het open-source identity en access management platform. Ons team heeft diepgaande Keycloak-expertise op het gebied van:

- **Self-hosted deployments** op Kubernetes, Docker of bare metal
- **Identity federation** met LDAP, Active Directory en externe SAML/OIDC-providers
- **Custom authenticatieflows** — step-up authenticatie, conditionele MFA, organisatiespecifieke loginpagina's
- **Fine-grained authorization** met Keycloak's ingebouwde policy engine

Het mooie van bouwen op OAuth 2.0- en OpenID Connect-standaarden is dat wisselen tussen Cognito en Keycloak — of beide draaien — geen herschrijven van applicatiecode vereist. Het tokenformaat is hetzelfde. De flows zijn hetzelfde. Alleen de infrastructuur verandert.

## Veelvoorkomende valkuilen die we hebben opgelost

Na het implementeren van SSO bij meerdere enterprise-klanten zijn dit de problemen die teams overvallen:

**Sessiesynchronisatie.** Wanneer een gebruiker uitlogt bij hun corporate IdP, moet je applicatie ze ook uitloggen. Back-channel logout correct implementeren vereist het afhandelen van logout tokens en sessieinvalidatie over services heen.

**Attribute mapping-conflicten.** Elke IdP structureert gebruikersdata anders. Afdeling kan een string zijn in het ene systeem en een genest object in het andere. Een flexibele attribute mapping-laag vanaf het begin bespaard eindeloos debuggen achteraf.

**Clock skew bij tokenvalidatie.** JWT's bevatten timestamps. Als je serverklok een paar minuten afwijkt van Cognito's klok, worden geldige tokens afgewezen. We bouwen configureerbare tolerantievensters in.

**Rate limiting bij federatie.** Wanneer duizenden gebruikers tegelijk via een gefedereerde IdP authenticeren (maandagochtend, anyone?), heb je goede queuing en retry-logica nodig om IdP-rate limits netjes af te handelen.

**Migratie van legacy auth.** Bestaande gebruikers verhuizen van wachtwoord-gebaseerde auth naar SSO zonder iedereen opnieuw te laten registreren. Cognito's migration Lambda trigger handelt dit transparant af — het valideert bestaande credentials bij de eerste login en migreert het account op de achtergrond.

## De zakelijke impact

Voor ShopVirge ontsloot een goede SSO-implementatie enterprise-klanten die voorheen onbereikbaar waren. De cijfers spreken duidelijk:

- **Onboardingtijd** daalde van dagen naar uren voor nieuwe enterprise-accounts
- **Supporttickets** rond authenticatie namen flink af — geen wachtwoord-reset-verzoeken meer van corporate gebruikers
- **Security posture** verbeterde — gecentraliseerde identity betekent gecentraliseerde audit trails, afgedwongen MFA en automatische deprovisioning
- **Salesgesprekken** werden korter — "Ja, we ondersteunen SSO met jullie IdP" haalt de grootste technische blokkade weg in enterprise-procurement

## Wanneer investeren in SSO

Als je een B2B-platform bouwt, is het antwoord: eerder dan je denkt. We zien drie kantelpunten:

1. **Je eerste enterprise-prospect vraagt naar SSO** — als er één vraagt, volgen er meer
2. **Je beheert wachtwoorden voor andermans werknemers** — dat is een aansprakelijkheid die je niet wilt
3. **Je hebt role-based access nodig die past bij organisatiestructuren** — custom auth schaalt niet

De initiële investering in een goede OAuth 2.0-architectuur verdient zichzelf terug op het moment dat je je eerste enterprise-deal sluit zonder een "custom authenticatie-integratie van zes maanden" als regelitem in het contract.

---

*SSO-integratie nodig voor je platform? Of het nu AWS Cognito, Keycloak of een custom OAuth 2.0-implementatie is — [we hebben het gedaan](/nl/contact). Laten we praten.*
