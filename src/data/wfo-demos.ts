export const wfoDemos = [
  {
    "ticket": "T-1001",
    "slug": "wfo-outage-triage",
    "prompt": "Amsterdam–London traffic is down, but both sites remain reachable. No maintenance is planned. Find the cause, affected service and customer, and what we can say about an ETA.",
    "en": {
      "title": "Trace an outage across systems",
      "intro": "A customer reports Amsterdam–London traffic has stopped. Compare WFO intent with device state and identify the affected service.",
      "source": "Customer ticket",
      "finding": "WFO expects the Paris port enabled. The device reports it administratively disabled; the Amsterdam–Paris link is down.",
      "outcome": "Amsterdam–London traffic is interrupted. No alternate path exists in this lab. Restoration and its ETA require investigation and authorization."
    },
    "nl": {
      "title": "Vind de oorzaak van een storing",
      "intro": "Een klant meldt dat er geen verkeer meer loopt tussen Amsterdam en Londen. Vergelijk de WFO-configuratie met de netwerkstatus en vind de getroffen dienst.",
      "source": "Klantmelding",
      "finding": "In WFO staat de Parijse poort ingeschakeld. Op het apparaat is die administratief uitgezet; de verbinding Amsterdam–Parijs ligt eruit.",
      "outcome": "Het verkeer tussen Amsterdam en Londen is onderbroken. Dit lab heeft geen alternatief pad. Herstel en een ETA vragen om onderzoek en toestemming."
    }
  },
  {
    "ticket": "T-1002",
    "slug": "wfo-monitoring-alert",
    "prompt": "Monitoring reports oper-state down on clab-orch-demo-par-p ethernet-1/2. Which service and customer use it? Is this expected maintenance or a fault, and what is the impact?",
    "en": {
      "title": "From a port alert to customer impact",
      "intro": "A monitoring alert names a device and interface. Find the subscription, customer and whether the outage is expected.",
      "source": "Monitoring alert",
      "finding": "Paris ethernet-1/2 is administratively disabled despite Enabled=true in WFO. The subscription is active and its maintenance flag is false.",
      "outcome": "The Amsterdam–Paris core link carries a service for SURF. Investigate the shutdown, authorize restoration and verify device health."
    },
    "nl": {
      "title": "Van poortalarm naar klantimpact",
      "intro": "Een monitoringalarm noemt een apparaat en een poort. Zoek uit welke dienst en klant erbij horen en of de uitval gepland is.",
      "source": "Monitoringalarm",
      "finding": "Paris ethernet-1/2 is administratief uitgezet, terwijl WFO Enabled=true bewaart. De subscription is actief en de onderhoudsvlag staat uit.",
      "outcome": "De core link Amsterdam–Parijs draagt een dienst voor SURF. Onderzoek waarom de poort is uitgezet, regel toestemming voor herstel en controleer het netwerk daarna."
    }
  },
  {
    "ticket": "T-1003",
    "slug": "wfo-packet-loss",
    "prompt": "Both sites are up, but Amsterdam–London traffic has 20–40% packet loss. Which hop, interface, subscription UUID and customer are affected? Confirm the service status. Is this configuration or transport?",
    "en": {
      "title": "Find packet loss while interfaces are up",
      "intro": "Both sites are reachable, yet traffic is degraded. Check each core link rather than treating an up interface as proof of healthy traffic.",
      "source": "Degraded traffic",
      "finding": "The Amsterdam–Paris port is enabled and operational. The agent measures 20% packet loss; a later independent five-packet sample measures 60%.",
      "outcome": "Traffic is degraded, not completely cut. The samples differ; the physical cause remains unconfirmed and needs further investigation."
    },
    "nl": {
      "title": "Vind pakketverlies terwijl de poorten up zijn",
      "intro": "Beide locaties zijn bereikbaar, maar verkeer komt niet goed door. Controleer elke core link: een poort die up is, bewijst nog geen gezonde verbinding.",
      "source": "Pakketverlies",
      "finding": "De poort op Amsterdam–Parijs is ingeschakeld en operationeel. De agent meet 20% verlies; een latere, onafhankelijke meting van vijf pakketten geeft 60%.",
      "outcome": "Het verkeer is verstoord, niet volledig onderbroken. De steekproeven verschillen; de fysieke oorzaak staat nog niet vast en vraagt verder onderzoek."
    }
  },
  {
    "ticket": "T-1005",
    "slug": "wfo-maintenance-impact",
    "prompt": "Assess Tuesday 02:00–04:00 maintenance on clab-orch-demo-par-p ethernet-1/2: affected service and customer, current health, alternate path and which subscription to flag after approval. Make no changes.",
    "en": {
      "title": "Know the impact before maintenance",
      "intro": "Before taking a Paris interface out of service, identify the customer, current health and whether traffic has another path.",
      "source": "Change request",
      "finding": "WFO intent and live device state agree: the port is enabled and up, with zero loss in the recorded sample. Taking it down interrupts the path.",
      "outcome": "There is no alternate path in this lab. After approval, flag the identified subscription, notify SURF and verify health after maintenance. No flag is changed here."
    },
    "nl": {
      "title": "Ken de impact vóór het onderhoud",
      "intro": "Voordat je een Parijse poort uit dienst neemt: welke klant raakt dit, is de verbinding gezond en kan het verkeer ergens anders langs?",
      "source": "Wijzigingsverzoek",
      "finding": "De WFO-configuratie en het apparaat komen overeen: de poort staat aan en is up, zonder verlies in de getoonde meting. Uitschakelen onderbreekt het pad.",
      "outcome": "Dit lab heeft geen alternatief pad. Markeer na goedkeuring de gevonden subscription voor onderhoud, informeer SURF en controleer na afloop de verbinding. De vlag verandert hier niet."
    }
  }
] as const;
export type WfoTicket = typeof wfoDemos[number]["ticket"];
