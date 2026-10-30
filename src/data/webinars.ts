import type { Lang } from '../i18n';

type Localized<T = string> = { en: T; nl: T };

export type WebinarProduct = 'wfo' | 'shopvirge';

export interface Speaker {
  name: string;
  role: string;
  linkedin: string;
}

export interface Webinar {
  slug: string;
  /** Local date in Europe/Amsterdam, always the second Wednesday of a month. */
  date: string;
  product: WebinarProduct;
  title: Localized;
  summary: Localized;
  intro: Localized;
  agenda: Localized<string[]>;
  takeaways: Localized<string[]>;
  audience: Localized<string[]>;
  speakers: Speaker[];
  tags: string[];
  resources: { label: Localized; href: string }[];
}

// All webinars run on the second Wednesday of the month, 15:00-16:00 Amsterdam time.
export const WEBINAR_START = '15:00';
export const WEBINAR_END = '16:00';
export const WEBINAR_TZ = 'Europe/Amsterdam';
export const FORMSPREE_WEBINAR = 'https://formspree.io/f/mpqjjpnb';

const SPEAKERS = {
  rene: { name: 'René Dohmen', role: 'CEO & Fullstack Python engineer', linkedin: 'https://www.linkedin.com/in/renedohmen/' },
  luc: { name: 'Luc Tielen', role: 'CTO', linkedin: 'https://www.linkedin.com/in/luctielen/' },
  eloi: { name: 'Eloi Bastien', role: 'Fullstack AI developer', linkedin: 'https://www.linkedin.com/in/eloinl/' },
  tim: { name: 'Tim Frohlich', role: 'ML/AI specialist', linkedin: 'https://www.linkedin.com/in/tim-frohlich-403332169/' },
  peter: { name: 'Peter Boers', role: 'Workflow Orchestrator core maintainer', linkedin: 'https://www.linkedin.com/in/boerspeter/' },
} satisfies Record<string, Speaker>;

const WFO_DECK =
  'https://workfloworchestrator.org/presentations/2026-09-23%20-%20Second%20WFO%20Developer%20Days%20-%20Dublin%20-%20Agent%20to%20Agent%20based%20troubleshooting.pdf';

export const webinars: Webinar[] = [
  {
    slug: 'agent-based-network-troubleshooting-wfo',
    date: '2026-11-11',
    product: 'wfo',
    title: {
      en: 'Agent based network troubleshooting with the WFO',
      nl: 'Agent-gebaseerde netwerk-troubleshooting met de WFO',
    },
    summary: {
      en: 'How a team of AI agents, connected to the Workflow Orchestrator and Netbox through MCP, diagnoses real network problems.',
      nl: 'Hoe een team van AI-agents, via MCP gekoppeld aan de Workflow Orchestrator en Netbox, echte netwerkproblemen diagnosticeert.',
    },
    intro: {
      en: 'At the WFO Developer Days in Dublin we showed how far we got with "automating stuff with agents". It started with vector search, an experimental agent inside orchestrator-core and a chat in the WFO GUI. It ended with an agent network troubleshooter that queries your orchestrator and inventory, runs actual network tools and collaborates with other agents. In this webinar we walk through that architecture, show it live and share what we learned along the way.',
      nl: 'Op de WFO Developer Days in Dublin lieten we zien hoe ver we zijn met "automate stuff with agents". Het begon met vector search, een experimentele agent in orchestrator-core en een chat in de WFO GUI. Het eindigde met een agent-netwerktroubleshooter die je orchestrator en inventory bevraagt, echte netwerktools draait en samenwerkt met andere agents. In dit webinar lopen we door die architectuur, laten we het live zien en delen we wat we onderweg geleerd hebben.',
    },
    agenda: {
      en: [
        'What an agent really is: a system prompt, a model of choice and a specified set of MCP tools',
        'MCP servers for the WFO: staying close to the REST/OpenAPI spec, FastMCP and shared authorisation',
        'Where to run agents: kagent on Kubernetes, Docker Agent, LibreChat and Slack',
        'Agent-to-agent (A2A): letting specialised agents collaborate on one incident',
        'Live demo: querying the WFO and Netbox MCP servers, then using actual network tools',
        'Risks, evals and what is next: authorisation and autodiscovery of agents',
      ],
      nl: [
        'Wat een agent echt is: een system prompt, een model naar keuze en een vaste set MCP-tools',
        'MCP-servers voor de WFO: dicht bij de REST/OpenAPI-spec blijven, FastMCP en gedeelde autorisatie',
        'Waar draai je agents: kagent op Kubernetes, Docker Agent, LibreChat en Slack',
        'Agent-to-agent (A2A): gespecialiseerde agents laten samenwerken aan één incident',
        'Live demo: de WFO- en Netbox-MCP-servers bevragen en daarna echte netwerktools gebruiken',
        'Risico\'s, evals en wat komt er: autorisatie en autodiscovery van agents',
      ],
    },
    takeaways: {
      en: [
        'A reference architecture for agent-driven troubleshooting on top of the WFO',
        'Practical guidance for exposing your orchestrator safely through MCP',
        'An honest view on the risks: changing one agent can affect the whole constellation',
      ],
      nl: [
        'Een referentie-architectuur voor agent-gedreven troubleshooting bovenop de WFO',
        'Praktische richtlijnen om je orchestrator veilig via MCP te ontsluiten',
        'Een eerlijk beeld van de risico\'s: één agent aanpassen kan de hele constellatie beïnvloeden',
      ],
    },
    audience: {
      en: ['Network engineers and NOC teams', 'WFO users and developers', 'Platform and automation engineers'],
      nl: ['Netwerkengineers en NOC-teams', 'WFO-gebruikers en -ontwikkelaars', 'Platform- en automatiseringsengineers'],
    },
    speakers: [SPEAKERS.tim, SPEAKERS.peter, SPEAKERS.rene],
    tags: ['WFO', 'MCP', 'A2A', 'Netbox', 'kagent'],
    resources: [
      { label: { en: 'Slide deck: WFO Developer Days Dublin (PDF)', nl: 'Slides: WFO Developer Days Dublin (PDF)' }, href: WFO_DECK },
      { label: { en: 'Workflow Orchestrator documentation', nl: 'Workflow Orchestrator documentatie' }, href: 'https://workfloworchestrator.org/' },
      { label: { en: 'Our SDN services', nl: 'Onze SDN-diensten' }, href: '/sdn/' },
    ],
  },
  {
    slug: 'webshop-content-generation-at-scale-shopvirge',
    date: '2026-12-09',
    product: 'shopvirge',
    title: {
      en: 'Automatic webshop content generation at scale with ShopVirge',
      nl: 'Automatische webshop-content op schaal met ShopVirge',
    },
    summary: {
      en: 'From a spreadsheet to hundreds of multilingual, SEO-ready product pages, generated and maintained by AI agents.',
      nl: 'Van een spreadsheet naar honderden meertalige, SEO-klare productpagina\'s, gegenereerd en onderhouden door AI-agents.',
    },
    intro: {
      en: 'Writing product descriptions, translating them and keeping them up to date is the most time-consuming part of running a webshop. ShopVirge automates it: bulk import from Excel or CSV, AI-generated product descriptions, SEO- and GEO-optimised translations per language and a native MCP server so agents can manage your catalogue. We show the full pipeline live, including our Lego agent BreinStein filling a shop with content.',
      nl: 'Productbeschrijvingen schrijven, vertalen en actueel houden is het meest tijdrovende onderdeel van een webshop. ShopVirge automatiseert dat: bulkimport vanuit Excel of CSV, AI-gegenereerde productbeschrijvingen, SEO- en GEO-geoptimaliseerde vertalingen per taal en een native MCP-server zodat agents je catalogus kunnen beheren. We laten de complete pipeline live zien, inclusief onze Lego-agent BreinStein die een shop vult met content.',
    },
    agenda: {
      en: [
        'Bulk import: from Excel/CSV to a structured catalogue',
        'AI product descriptions that stay on-brand and factual',
        'Automatic translations with per-language SEO and GEO tags',
        'The ShopVirge MCP server: products.create, translations.update, prices.optimize',
        'Live demo: BreinStein generating content for a full shop',
        'Quality control: review flows and keeping humans in the loop',
      ],
      nl: [
        'Bulkimport: van Excel/CSV naar een gestructureerde catalogus',
        'AI-productbeschrijvingen die on-brand en feitelijk blijven',
        'Automatische vertalingen met SEO- en GEO-tags per taal',
        'De ShopVirge MCP-server: products.create, translations.update, prices.optimize',
        'Live demo: BreinStein genereert content voor een complete shop',
        'Kwaliteitscontrole: reviewflows en de mens in de loop houden',
      ],
    },
    takeaways: {
      en: [
        'A repeatable workflow to generate and translate catalogue content at scale',
        'How to connect Claude Desktop, Cursor or your own agents to your shop through MCP',
        'Prompting and review tips that keep AI content accurate',
      ],
      nl: [
        'Een herhaalbare workflow om catalogus-content op schaal te genereren en te vertalen',
        'Hoe je Claude Desktop, Cursor of je eigen agents via MCP aan je shop koppelt',
        'Prompt- en reviewtips die AI-content accuraat houden',
      ],
    },
    audience: {
      en: ['Webshop owners and eCommerce managers', 'Marketing and content teams', 'Developers building on headless commerce'],
      nl: ['Webshop-eigenaren en eCommerce-managers', 'Marketing- en contentteams', 'Developers die bouwen op headless commerce'],
    },
    speakers: [SPEAKERS.rene, SPEAKERS.luc, SPEAKERS.eloi],
    tags: ['ShopVirge', 'AI content', 'MCP', 'SEO', 'Translations'],
    resources: [
      { label: { en: 'ShopVirge features', nl: 'ShopVirge features' }, href: 'https://shopvirge.com/en/features/' },
      { label: { en: 'AI product descriptions: the practical playbook', nl: 'AI-productbeschrijvingen: het praktische playbook' }, href: 'https://shopvirge.com/en/blog/ai-product-descriptions-webshop-2026/' },
      { label: { en: 'Our eCommerce content services', nl: 'Onze eCommerce content-diensten' }, href: '/ecommerce/content/' },
    ],
  },
  {
    slug: 'modern-sdn-wfo-open-source',
    date: '2027-01-13',
    product: 'wfo',
    title: {
      en: 'Modern SDN with the WFO and other open source tooling',
      nl: 'Modern SDN met de WFO en andere open source tooling',
    },
    summary: {
      en: 'Build a production-ready network automation stack from open source building blocks: WFO, Netbox, Ansible and more.',
      nl: 'Bouw een productieklare netwerkautomatiseringsstack met open source bouwstenen: WFO, Netbox, Ansible en meer.',
    },
    intro: {
      en: 'Software Defined Networking does not require a vendor lock-in. The open source Workflow Orchestrator, used by research and education networks worldwide, manages the full lifecycle of your network products with workflows written in plain Python. Combined with Netbox as source of truth and Ansible through LSO, you get an auditable, extensible automation platform. We walk through the ecosystem and build a working stack live.',
      nl: 'Software Defined Networking vraagt niet om vendor lock-in. De open source Workflow Orchestrator, wereldwijd gebruikt door research- en onderwijsnetwerken, beheert de volledige lifecycle van je netwerkproducten met workflows in gewoon Python. Gecombineerd met Netbox als source of truth en Ansible via LSO krijg je een auditeerbaar, uitbreidbaar automatiseringsplatform. We lopen door het ecosysteem en bouwen live een werkende stack.',
    },
    agenda: {
      en: [
        'Orchestration vs. automation: why intelligence and an audit log matter',
        'Products and subscriptions: create, modify, terminate and validate workflows',
        'The ecosystem: orchestrator-core, Orchestrator UI, Pydantic-Forms and LSO for Ansible',
        'Netbox as source of truth and the Example Orchestrator Docker stack',
        'NSI with SuPA and PolyNSI for multi-domain connectivity',
        'New in the WFO: AI hybrid search and the MCP server',
      ],
      nl: [
        'Orchestratie vs. automatisering: waarom intelligentie en een audit log ertoe doen',
        'Producten en subscriptions: create-, modify-, terminate- en validate-workflows',
        'Het ecosysteem: orchestrator-core, Orchestrator UI, Pydantic-Forms en LSO voor Ansible',
        'Netbox als source of truth en de Example Orchestrator Docker-stack',
        'NSI met SuPA en PolyNSI voor multi-domain connectiviteit',
        'Nieuw in de WFO: AI hybrid search en de MCP-server',
      ],
    },
    takeaways: {
      en: [
        'A clear map of the open source SDN tooling landscape',
        'A working starting point you can run locally with Docker Compose',
        'How to model your network services as products with lifecycle workflows',
      ],
      nl: [
        'Een helder overzicht van het open source SDN-tooling landschap',
        'Een werkend startpunt dat je lokaal draait met Docker Compose',
        'Hoe je netwerkdiensten modelleert als producten met lifecycle-workflows',
      ],
    },
    audience: {
      en: ['Network architects and engineers', 'NRENs, ISPs and campus networks', 'Python developers in network teams'],
      nl: ['Netwerkarchitecten en -engineers', 'NREN\'s, ISP\'s en campusnetwerken', 'Python-developers in netwerkteams'],
    },
    speakers: [SPEAKERS.rene],
    tags: ['WFO', 'SDN', 'Netbox', 'Ansible', 'Open source'],
    resources: [
      { label: { en: 'Workflow Orchestrator documentation', nl: 'Workflow Orchestrator documentatie' }, href: 'https://workfloworchestrator.org/' },
      { label: { en: 'WFO on GitHub', nl: 'WFO op GitHub' }, href: 'https://github.com/workfloworchestrator' },
      { label: { en: 'Case: hybrid search for SURF Orchestrator-Core', nl: 'Case: hybrid search voor SURF Orchestrator-Core' }, href: '/cases/surf-orchestrator-core/' },
      { label: { en: 'Our SDN services', nl: 'Onze SDN-diensten' }, href: '/sdn/' },
    ],
  },
  {
    slug: 'optimize-your-shopvirge-shop',
    date: '2027-02-10',
    product: 'shopvirge',
    title: {
      en: 'How to optimize your ShopVirge shop',
      nl: 'Zo optimaliseer je je ShopVirge-shop',
    },
    summary: {
      en: 'Practical tips to get more traffic and conversions: SEO, GEO, speed, analytics, design and payments.',
      nl: 'Praktische tips voor meer bezoekers en conversie: SEO, GEO, snelheid, analytics, design en betalingen.',
    },
    intro: {
      en: 'Your ShopVirge shop is live. Now what? In this hands-on session we go through everything that makes a shop perform: search visibility in Google and AI assistants, page speed, measuring what matters, a design that converts and checkout options your customers expect. We finish with live reviews of attendee shops, so bring your URL.',
      nl: 'Je ShopVirge-shop staat live. En nu? In deze hands-on sessie lopen we door alles wat een shop laat presteren: vindbaarheid in Google en AI-assistenten, laadsnelheid, meten wat ertoe doet, een design dat converteert en betaalopties die je klanten verwachten. We sluiten af met live reviews van shops van deelnemers, dus neem je URL mee.',
    },
    agenda: {
      en: [
        'SEO and GEO: sitemaps, meta tags and optimised translations per language',
        'Google Search Console: getting indexed and fixing what it reports',
        'Measuring conversions with Google Analytics 4 and Tag Manager',
        'Speed and mobile: keeping load times under a second',
        'Templates, branding and dark mode without hurting conversion',
        'Checkout: iDEAL, Bancontact, cards and PayPal through Stripe',
        'Live shop reviews and Q&A',
      ],
      nl: [
        'SEO en GEO: sitemaps, metatags en geoptimaliseerde vertalingen per taal',
        'Google Search Console: geïndexeerd worden en oplossen wat het meldt',
        'Conversies meten met Google Analytics 4 en Tag Manager',
        'Snelheid en mobiel: laadtijden onder de seconde houden',
        'Templates, branding en dark mode zonder conversieverlies',
        'Checkout: iDEAL, Bancontact, creditcards en PayPal via Stripe',
        'Live shopreviews en Q&A',
      ],
    },
    takeaways: {
      en: [
        'A concrete optimisation checklist you can apply the same day',
        'Know which numbers to watch and where to find them',
        'Personal feedback on your own shop',
      ],
      nl: [
        'Een concrete optimalisatie-checklist die je dezelfde dag toepast',
        'Weten welke cijfers je moet volgen en waar je ze vindt',
        'Persoonlijke feedback op je eigen shop',
      ],
    },
    audience: {
      en: ['ShopVirge shop owners', 'Entrepreneurs considering ShopVirge', 'Marketing teams selling across Europe'],
      nl: ['ShopVirge shop-eigenaren', 'Ondernemers die ShopVirge overwegen', 'Marketingteams die in heel Europa verkopen'],
    },
    speakers: [SPEAKERS.rene, SPEAKERS.luc, SPEAKERS.eloi],
    tags: ['ShopVirge', 'SEO', 'GEO', 'Analytics', 'Conversion'],
    resources: [
      { label: { en: 'ShopVirge', nl: 'ShopVirge' }, href: 'https://shopvirge.com/' },
      { label: { en: '5 mistakes with multilingual webshops', nl: '5 fouten bij meertalige webshops' }, href: 'https://shopvirge.com/en/blog/multilingual-webshop-5-mistakes/' },
      { label: { en: 'Our eCommerce services', nl: 'Onze eCommerce-diensten' }, href: '/ecommerce/' },
    ],
  },
];

export function getWebinarBySlug(slug: string) {
  return webinars.find(w => w.slug === slug);
}

/** Second Wednesday of a month (month is 0-based), as YYYY-MM-DD. */
export function secondWednesday(year: number, month: number): string {
  const firstDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const day = 8 + ((3 - firstDay + 7) % 7);
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Last Sunday of a month (0-based), as day-of-month. */
function lastSunday(year: number, month: number) {
  const last = new Date(Date.UTC(year, month + 1, 0));
  return last.getUTCDate() - last.getUTCDay();
}

/** UTC offset for Europe/Amsterdam on a given local date: +02:00 in summer time, +01:00 otherwise. */
export function amsterdamOffset(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  const start = Date.UTC(y, 2, lastSunday(y, 2));
  const end = Date.UTC(y, 9, lastSunday(y, 9));
  const t = Date.UTC(y, m - 1, d);
  return t >= start && t < end ? '+02:00' : '+01:00';
}

/** ISO 8601 timestamps with offset, e.g. 2026-11-11T15:00:00+01:00. */
export function startIso(date: string) {
  return `${date}T${WEBINAR_START}:00${amsterdamOffset(date)}`;
}
export function endIso(date: string) {
  return `${date}T${WEBINAR_END}:00${amsterdamOffset(date)}`;
}

export interface WebinarSlot {
  date: string;
  webinar?: Webinar;
}

/** Every second-Wednesday slot from `from` (inclusive) for `count` months, with its topic if one is planned. */
export function getWebinarSlots(from: Date, count: number): WebinarSlot[] {
  const slots: WebinarSlot[] = [];
  for (let n = 0; n < count; n++) {
    const month = new Date(Date.UTC(from.getFullYear(), from.getMonth() + n, 1));
    const date = secondWednesday(month.getUTCFullYear(), month.getUTCMonth());
    slots.push({ date, webinar: webinars.find(w => w.date === date) });
  }
  return slots;
}

/** Webinars that have not ended yet at `now`, soonest first. */
export function getUpcoming(now: Date = new Date(), n?: number) {
  const upcoming = webinars
    .filter(w => new Date(endIso(w.date)).getTime() > now.getTime())
    .sort((a, b) => a.date.localeCompare(b.date));
  return n ? upcoming.slice(0, n) : upcoming;
}

export function formatWebinarDate(date: string, lang: Lang, opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Intl.DateTimeFormat(lang === 'nl' ? 'nl-NL' : 'en-GB', { ...opts, timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`));
}

export function webinarPath(lang: Lang, slug: string) {
  return `/${lang}/webinars/${slug}/`;
}

export function icsPath(slug: string) {
  return `/webinars/${slug}.ics`;
}
