export const wfoDemos = [
  {
    "ticket": "T-1001",
    "slug": "wfo-outage-triage",
    "prompt": "Amsterdam–London traffic is down, but both sites remain reachable. No maintenance is planned. Find the cause, affected service and customer, and what we can say about an ETA.",
    "en": {
      "title": "Correlate service intent with device state",
      "intro": "The agent maps an Amsterdam–London outage to a WFO subscription and customer, then correlates stored port configuration with live SR Linux state.",
      "source": "Customer ticket",
      "finding": "WFO expects the Paris port enabled. The device reports it administratively disabled; the Amsterdam–Paris link is down.",
      "outcome": "Amsterdam–London traffic is interrupted. No alternate path exists in this lab. Restoration and its ETA require investigation and authorization.",
      "thumbnail": {
        "title": "Service outage",
        "detail": "Paris port disabled",
        "description": "Amsterdam–London service outage. The Paris port is administratively disabled on the Amsterdam–Paris link."
      }
    },
    "nl": {
      "title": "Koppel serviceconfiguratie aan apparaatstatus",
      "intro": "De agent koppelt een storing tussen Amsterdam en Londen aan een WFO-subscription en klant, en vergelijkt de opgeslagen poortconfiguratie met live SR Linux-status.",
      "source": "Klantmelding",
      "finding": "In WFO staat de Parijse poort ingeschakeld. Op het apparaat is die administratief uitgezet; de verbinding Amsterdam–Parijs ligt eruit.",
      "outcome": "Het verkeer tussen Amsterdam en Londen is onderbroken. Dit lab heeft geen alternatief pad. Herstel en een ETA vragen om onderzoek en toestemming.",
      "thumbnail": {
        "title": "Verbindingsstoring",
        "detail": "Parijse poort uitgezet",
        "description": "Storing op de verbinding Amsterdam–Londen. De Parijse poort op de verbinding Amsterdam–Parijs is administratief uitgezet."
      }
    },
    "scenario": "outage"
  },
  {
    "ticket": "T-1002",
    "slug": "wfo-monitoring-alert",
    "prompt": "Monitoring reports oper-state down on clab-orch-demo-par-p ethernet-1/2. Which service and customer use it? Is this expected maintenance or a fault, and what is the impact?",
    "en": {
      "title": "Map an interface alert to its service and customer",
      "intro": "The agent resolves a device and interface to a WFO subscription and customer, then checks maintenance flags against administrative and operational state.",
      "source": "Monitoring alert",
      "finding": "Paris ethernet-1/2 is administratively disabled despite Enabled=true in WFO. The subscription is active and its maintenance flag is false.",
      "outcome": "The Amsterdam–Paris core link carries a service for SURF. Investigate the shutdown, authorize restoration and verify device health.",
      "thumbnail": {
        "title": "Interface alert",
        "detail": "Interface → service → customer",
        "description": "An alert on Paris ethernet-1/2 is mapped through its WFO service to customer SURF."
      }
    },
    "nl": {
      "title": "Koppel een poortalarm aan dienst en klant",
      "intro": "De agent koppelt een apparaat en poort aan een WFO-subscription en klant, en vergelijkt onderhoudsvlaggen met de administratieve en operationele status.",
      "source": "Monitoringalarm",
      "finding": "Paris ethernet-1/2 is administratief uitgezet, terwijl WFO Enabled=true bewaart. De subscription is actief en de onderhoudsvlag staat uit.",
      "outcome": "De core link Amsterdam–Parijs draagt een dienst voor SURF. Onderzoek waarom de poort is uitgezet, regel toestemming voor herstel en controleer het netwerk daarna.",
      "thumbnail": {
        "title": "Poortalarm",
        "detail": "Poort → dienst → klant",
        "description": "Een alarm op Paris ethernet-1/2 wordt via de WFO-dienst gekoppeld aan klant SURF."
      }
    },
    "scenario": "alert"
  },
  {
    "ticket": "T-1003",
    "slug": "wfo-packet-loss",
    "prompt": "Both sites are up, but Amsterdam–London traffic has 20–40% packet loss. Which hop, interface, subscription UUID and customer are affected? Confirm the service status. Is this configuration or transport?",
    "en": {
      "title": "Localize packet loss with path measurements",
      "intro": "The agent combines per-link packet-loss measurements with interface state and WFO service mapping to locate degradation on the Amsterdam–London path.",
      "source": "Degraded traffic",
      "finding": "The Amsterdam–Paris port is enabled and operational. The agent measures 20% packet loss; a later independent five-packet sample measures 60%.",
      "outcome": "Traffic is degraded, not completely cut. The samples differ; the physical cause remains unconfirmed and needs further investigation.",
      "thumbnail": {
        "title": "Packet loss",
        "detail": "Link up, traffic degraded",
        "description": "Schematic of an operational Amsterdam–Paris link losing packets, degrading Amsterdam–London traffic. Packet symbols are illustrative, not a measured sample."
      }
    },
    "nl": {
      "title": "Lokaliseer pakketverlies met padmetingen",
      "intro": "De agent combineert pakketverliesmetingen per verbinding met poortstatus en WFO-dienstgegevens om verstoring op het pad Amsterdam–Londen te lokaliseren.",
      "source": "Pakketverlies",
      "finding": "De poort op Amsterdam–Parijs is ingeschakeld en operationeel. De agent meet 20% verlies; een latere, onafhankelijke meting van vijf pakketten geeft 60%.",
      "outcome": "Het verkeer is verstoord, niet volledig onderbroken. De steekproeven verschillen; de fysieke oorzaak staat nog niet vast en vraagt verder onderzoek.",
      "thumbnail": {
        "title": "Pakketverlies",
        "detail": "Verbinding up, verkeer verstoord",
        "description": "Schematisch pakketverlies op de operationele verbinding Amsterdam–Parijs verstoort het verkeer Amsterdam–Londen. De pakketsymbolen zijn illustratief, geen meting."
      }
    },
    "scenario": "packet-loss"
  },
  {
    "ticket": "T-1005",
    "slug": "wfo-maintenance-impact",
    "prompt": "Assess Tuesday 02:00–04:00 maintenance on clab-orch-demo-par-p ethernet-1/2: affected service and customer, current health, alternate path and which subscription to flag after approval. Make no changes.",
    "en": {
      "title": "Assess maintenance impact from service topology",
      "intro": "The agent maps a Paris interface to its service and customer, checks live health and evaluates alternate paths for a proposed maintenance window.",
      "source": "Change request",
      "finding": "WFO intent and live device state agree: the port is enabled and up, with zero loss in the recorded sample. Taking it down interrupts the path.",
      "outcome": "There is no alternate path in this lab. After approval, flag the identified subscription, notify SURF and verify health after maintenance. No flag is changed here.",
      "thumbnail": {
        "title": "Maintenance impact",
        "detail": "No alternate path",
        "description": "Planned maintenance on the Paris interface from 02:00 to 04:00 would interrupt the Amsterdam–London path. There is no alternate path in this lab."
      }
    },
    "nl": {
      "title": "Bepaal onderhoudsimpact via de servicetopologie",
      "intro": "De agent koppelt een Parijse poort aan dienst en klant, controleert de live netwerkstatus en beoordeelt alternatieve paden voor een gepland onderhoudsvenster.",
      "source": "Wijzigingsverzoek",
      "finding": "De WFO-configuratie en het apparaat komen overeen: de poort staat aan en is up, zonder verlies in de getoonde meting. Uitschakelen onderbreekt het pad.",
      "outcome": "Dit lab heeft geen alternatief pad. Markeer na goedkeuring de gevonden subscription voor onderhoud, informeer SURF en controleer na afloop de verbinding. De vlag verandert hier niet.",
      "thumbnail": {
        "title": "Onderhoudsimpact",
        "detail": "Geen alternatief pad",
        "description": "Gepland onderhoud aan de Parijse poort van 02:00 tot 04:00 zou het pad Amsterdam–Londen onderbreken. Dit lab heeft geen alternatief pad."
      }
    },
    "scenario": "maintenance"
  }
] as const;
export type WfoTicket = typeof wfoDemos[number]["ticket"];
export type WfoScenario = typeof wfoDemos[number]['scenario'];
