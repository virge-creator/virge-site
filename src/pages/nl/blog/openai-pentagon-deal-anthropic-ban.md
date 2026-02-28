---
layout: ../../../layouts/BlogPost.astro
lang: nl
title: "OpenAI krijgt de Pentagon-deal. Anthropic wordt op de zwarte lijst gezet. Dit is wat er gebeurde."
description: "Trump verbood alle federale overheidsdiensten om Anthropic te gebruiken. Uren later tekende OpenAI een deal met het Pentagon voor geclassificeerde netwerken. De gevolgen voor AI-veiligheid, overheidscontracten en elk bedrijf dat AI gebruikt zijn groot."
date: 2026-02-28
author: "Virge.io"
---

![](/images/pentagon-ai-deal.png)


Op vrijdag 27 februari 2026 beleefde de AI-industrie haar meest dramatische dag tot nu toe.

President Trump gaf alle federale overheidsdiensten de opdracht om onmiddellijk te stoppen met het gebruik van Anthropic's technologie. Defensieminister Pete Hegseth bestempelde Anthropic als "supply chain risk to national security" — een label dat normaal is gereserveerd voor buitenlandse tegenstanders. Uren later kondigde OpenAI aan dat het een deal had getekend met het Pentagon om modellen in te zetten op geclassificeerde netwerken.

De snelheid was adembenemend. Maar het onderliggende verhaal is genuanceerder — en belangrijker — dan de koppen suggereren.

## Wat leidde tot het verbod

Anthropic onderhandelde al maanden over een contract met het Pentagon ter waarde van maximaal $200 miljoen. Anthropic was zelfs het *eerste* AI-lab dat modellen implementeerde op het geclassificeerde netwerk van Defensie. Maar de onderhandelingen liepen vast op twee specifieke restricties die Anthropic in het contract wilde:

1. **Geen volledig autonome wapens.** Anthropic stelde dat huidige AI-modellen niet betrouwbaar genoeg zijn om leven-of-dood beslissingen te nemen zonder menselijk toezicht.
2. **Geen massasurveillance van Amerikaanse burgers.** Anthropic beschouwde dit als een fundamentele rechtenkwestie.

Het Pentagon wilde onbeperkte toegang voor alle "wettige toepassingen." Anthropic gaf niet toe op deze twee punten. Het Pentagon stelde een deadline. Anthropic haalde die niet. Trump postte op Truth Social. Hegseth volgde met de zwarte-lijstclassificatie.

## De OpenAI-deal

Uren na Anthropic's blacklisting kondigde Sam Altman aan dat OpenAI een overeenkomst had bereikt met het Pentagon. En hier wordt het interessant: **OpenAI's deal bevat dezelfde restricties waar Anthropic om vroeg.**

Uit Altman's bericht op X: *"Twee van onze belangrijkste veiligheidsprincipes zijn verboden op binnenlandse massasurveillance en menselijke verantwoordelijkheid voor het gebruik van geweld, inclusief voor autonome wapensystemen. Het DoW stemt in met deze principes, weerspiegelt ze in wet en beleid, en we hebben ze opgenomen in onze overeenkomst."*

Lees dat nog eens. Het Pentagon stemde in met exact dezelfde waarborgen bij OpenAI die het weigerde te accepteren van Anthropic.

Altman vroeg het Pentagon zelfs om dezelfde voorwaarden aan te bieden aan alle AI-bedrijven — impliciet ook aan Anthropic.

## Wat dit ons vertelt

### 1. AI-veiligheidsstandpunten zijn nu politiek

Anthropic heeft zichzelf sinds de oprichting gepositioneerd als het "veiligheid-eerst" AI-bedrijf. Die positionering — gecombineerd met berichten over medewerkers die doneerden aan Democratische campagnes — maakte het een politiek doelwit. Overheidsfunctionarissen hadden Anthropic maandenlang bekritiseerd als "te bezorgd over AI-veiligheid."

De ironie: OpenAI kreeg dezelfde veiligheidsvoorwaarden zonder de politieke lading.

### 2. De "supply chain risk"-classificatie is ongekend

Dit label is ontworpen voor buitenlandse tegenstanders — bedrijven als Huawei of Kaspersky. Het gebruiken tegen een binnenlands AI-bedrijf schept een nieuw precedent. Anthropic heeft aangekondigd de classificatie juridisch aan te vechten, met het argument dat de Defensieminister niet de bevoegdheid heeft om de zwarte lijst uit te breiden voorbij DoD-contracten naar alle andere zakelijke activiteiten van militaire leveranciers.

### 3. Vendor lock-in is nu een nationale veiligheidsdiscussie

Elk bedrijf dat Anthropic's Claude gebruikt in producten die raken aan overheidsleveranciers heeft nu een probleem. De zwarte lijst betekent dat DoD-leveranciers moeten certificeren dat ze Anthropic's modellen niet gebruiken — wat potentieel hun hele productstack beïnvloedt, niet alleen overheidsgerelateerd werk.

Dit is een wake-up call voor elk bedrijf dat bouwt op één AI-provider.

## Wat dit betekent voor bedrijven

Of je nu OpenAI, Anthropic, Google of open-source modellen gebruikt — deze week veranderde de risicocalculatie:

### Diversifieer je AI-providers

Als je hele stack afhangt van één AI-bedrijf, ben je één presidentieel besluit verwijderd van een crisis. Bouw abstractielagen. Ondersteun meerdere modellen. Maak wisselen mogelijk.

Dit is iets waar we bij Virge.io al langer voor pleiten. Onze [OAuth 2.0-architectuur](/nl/blog/enterprise-sso-oauth2-aws-cognito-keycloak/) is gebouwd op standaarden, precies omdat vendor lock-in een bedrijfsrisico is. Hetzelfde principe geldt voor AI: bouw op interfaces, niet op implementaties.

### Begrijp je supply chain

Als je een overheidsleverancier bent — of als je klanten dat zijn — moet je nu je AI-afhankelijkheden auditen. Welke modellen draaien je zoekfunctie? Je contentgeneratie? Je analytics? Als er Anthropic bij zit, heb je zes maanden om over te stappen.

### Veiligheidsvoorwaarden zijn belangrijk in contracten

Het feit dat OpenAI veiligheidswaarborgen onderhandelde in een Pentagon-contract laat zien dat dit niet alleen ethische standpunten zijn — het zijn contractuele voorwaarden. Wanneer je AI integreert in je producten, zijn de gebruiksvoorwaarden niet zomaar juridische bijzaak. Ze definiëren wat je product wel en niet kan doen.

### Europese bedrijven: let op

De EU AI Act legt al beperkingen op aan AI-toepassingen met hoog risico, inclusief militair gebruik. De Amerikaanse overheid die een bedrijf straft omdat het *zelf restricties wilde* op militaire AI creëert een fascinerende spanning met Europese reguleringsbenaderingen. Als je in beide markten opereert, moet je AI-governance met beide rekening houden.

## Het grotere plaatje

Anthropic probeerde grenzen te stellen aan hoe zijn technologie kon worden gebruikt door het machtigste leger ter wereld. Het werd op de zwarte lijst gezet. OpenAI vroeg om dezelfde grenzen en kreeg een contract.

Het verschil was niet het beleid — het was de politiek.

Voor de AI-industrie is dit een keerpunt. De vraag is niet langer alleen "wat kan AI?" maar "wie bepaalt wat AI doet?" — en dat antwoord is steeds meer politiek.

Voor bedrijven die bouwen met AI: de les is helder. Hang niet af van één provider. Bouw flexibiliteit in je architectuur. En let op de voorwaarden — want in 2026 kunnen ze van de ene op de andere dag veranderen.

---

*Hulp nodig bij het bouwen van AI-architecturen die provider-onafhankelijk en toekomstbestendig zijn? [Dat is wat we doen.](/nl/contact)*
