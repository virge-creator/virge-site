export interface Job {
  slug: string;
  title: {
    en: string;
    nl: string;
  };
  location: string;
  type: {
    en: string;
    nl: string;
  };
  summary: {
    en: string;
    nl: string;
  };
  about: {
    en: string;
    nl: string;
  };
  requirements: {
    en: string[];
    nl: string[];
  };
  niceToHave: {
    en: string[];
    nl: string[];
  };
  offer: {
    en: string[];
    nl: string[];
  };
  tags: string[];
  active: boolean;
}

export const jobs: Job[] = [
  {
    slug: 'senior-ai-consultant',
    title: {
      en: 'Senior AI Consultant',
      nl: 'Senior AI Consultant',
    },
    location: 'Groningen / Remote',
    type: {
      en: 'Full-time / Freelance',
      nl: 'Fulltime / Freelance',
    },
    summary: {
      en: 'Help our clients design and build production-ready AI systems: multi-agent architectures to RAG pipelines.',
      nl: 'Help onze klanten bij het ontwerpen en bouwen van productie-ready AI-systemen: multi-agent architecturen tot RAG-pipelines.',
    },
    about: {
      en: 'As a Senior AI Consultant at Virge.io, you will work directly with clients to design, build, and deploy AI solutions that deliver real business value. You will be at the forefront of agentic AI. You will build multi-agent systems, structured output pipelines, and intelligent automation using the latest frameworks and models.',
      nl: 'Als Senior AI Consultant bij Virge.io werk je direct met klanten aan het ontwerpen, bouwen en deployen van AI-oplossingen die echte bedrijfswaarde leveren. Je staat aan de frontlinie van agentic AI. Je bouwt multi-agent systemen, gestructureerde output pipelines en intelligente automatisering met de nieuwste frameworks en modellen.',
    },
    requirements: {
      en: [
        '3+ years experience in AI/ML or software engineering',
        'Strong Python skills',
        'Hands-on experience with Pydantic AI, LangChain, or similar agent frameworks',
        'Understanding of RAG architectures and vector databases (pgvector, Pinecone, Weaviate)',
        'Experience with LLM APIs (OpenAI, Anthropic, open-source models)',
        'Ability to translate business problems into technical AI solutions',
        'Excellent communication skills (English required, Dutch is a plus)',
      ],
      nl: [
        '3+ jaar ervaring in AI/ML of software engineering',
        'Sterke Python-vaardigheden',
        'Hands-on ervaring met Pydantic AI, LangChain, of vergelijkbare agent-frameworks',
        'Kennis van RAG-architecturen en vector databases (pgvector, Pinecone, Weaviate)',
        'Ervaring met LLM APIs (OpenAI, Anthropic, open-source modellen)',
        'In staat om bedrijfsproblemen te vertalen naar technische AI-oplossingen',
        'Uitstekende communicatieve vaardigheden (Nederlands of Engels)',
      ],
    },
    niceToHave: {
      en: [
        'Experience with multi-agent orchestration (CrewAI, AutoGen, custom)',
        'Knowledge of structured output and function calling patterns',
        'Background in MLOps or model deployment (Docker, Kubernetes)',
        'Experience with evaluation frameworks for LLM systems',
        'Familiarity with OpenClaw or similar AI assistant platforms',
      ],
      nl: [
        'Ervaring met multi-agent orchestratie (CrewAI, AutoGen, custom)',
        'Kennis van structured output en function calling patterns',
        'Achtergrond in MLOps of model deployment (Docker, Kubernetes)',
        'Ervaring met evaluatie-frameworks voor LLM-systemen',
        'Bekendheid met OpenClaw of vergelijkbare AI-assistentplatformen',
      ],
    },
    offer: {
      en: [
        'Work on cutting-edge AI projects for enterprise clients',
        'Flexible work arrangements. Remote-first, async-friendly',
        'Direct impact on product and architecture decisions',
        'Competitive compensation (freelance or employment)',
        'Small, senior team. No bureaucracy',
        'Access to the latest AI tools and models',
      ],
      nl: [
        'Werk aan cutting-edge AI-projecten voor enterprise klanten',
        'Flexibele werkafspraken. Remote-first, async-friendly',
        'Directe impact op product- en architectuurbeslissingen',
        'Competitieve vergoeding (freelance of dienstverband)',
        'Klein, senior team. Geen bureaucratie',
        'Toegang tot de nieuwste AI-tools en modellen',
      ],
    },
    tags: ['Pydantic AI', 'Multi-Agent', 'RAG', 'Python', 'LLM'],
    active: true,
  },
  {
    slug: 'fullstack-python-engineer',
    title: {
      en: 'Fullstack Python Engineer',
      nl: 'Fullstack Python Engineer',
    },
    location: 'Groningen / Remote',
    type: {
      en: 'Full-time / Freelance',
      nl: 'Fulltime / Freelance',
    },
    summary: {
      en: 'Build modern web applications with FastAPI backends and React/Next.js frontends. Powering our AI and eCommerce products.',
      nl: 'Bouw moderne webapplicaties met FastAPI backends en React/Next.js frontends. Voor onze AI- en eCommerce-producten.',
    },
    about: {
      en: 'As a Fullstack Python Engineer, you will design and build the platforms that power our AI consulting tools, eCommerce solutions, and client projects. You will own features end-to-end: from database schema to API design to polished frontend. We work with modern tooling, ship fast, and care about code quality.',
      nl: 'Als Fullstack Python Engineer ontwerp en bouw je de platformen die onze AI-consultingtools, eCommerce-oplossingen en klantprojecten aandrijven. Je bent verantwoordelijk voor features end-to-end: van database-schema tot API-design tot gepolijste frontend. We werken met modern tooling, shippen snel en geven om codekwaliteit.',
    },
    requirements: {
      en: [
        '3+ years experience in full-stack web development',
        'Strong Python skills: FastAPI, SQLAlchemy/SQLModel, Pydantic',
        'Solid frontend skills: React with TypeScript',
        'Experience with Next.js or similar React meta-frameworks',
        'PostgreSQL (queries, migrations, performance)',
        'REST API design and implementation',
        'Git workflow and CI/CD basics',
        'Comfortable working in a small, autonomous team',
      ],
      nl: [
        '3+ jaar ervaring in full-stack webontwikkeling',
        'Sterke Python-vaardigheden: FastAPI, SQLAlchemy/SQLModel, Pydantic',
        'Solide frontend-vaardigheden: React met TypeScript',
        'Ervaring met Next.js of vergelijkbare React meta-frameworks',
        'PostgreSQL (queries, migraties, performance)',
        'REST API-design en -implementatie',
        'Git workflow en CI/CD basics',
        'Comfortabel werken in een klein, autonoom team',
      ],
    },
    niceToHave: {
      en: [
        'Experience with Tailwind CSS',
        'Knowledge of Docker and container orchestration',
        'Familiarity with AI/ML integration (LLM APIs, embeddings)',
        'Experience with eCommerce platforms or payment integrations',
        'Open-source contributions',
        'Experience with Astro or other static site generators',
      ],
      nl: [
        'Ervaring met Tailwind CSS',
        'Kennis van Docker en container orchestratie',
        'Bekendheid met AI/ML-integratie (LLM APIs, embeddings)',
        'Ervaring met eCommerce-platformen of betaalintegraties',
        'Open-source bijdragen',
        'Ervaring met Astro of andere static site generators',
      ],
    },
    offer: {
      en: [
        'Build products used by real businesses',
        'Modern stack. No legacy code maintenance',
        'Flexible work. Remote-first, results over hours',
        'Competitive compensation (freelance or employment)',
        'Small team, big ownership',
        'Opportunity to work with AI tooling daily',
      ],
      nl: [
        'Bouw producten die door echte bedrijven worden gebruikt',
        'Moderne stack. Geen legacy code onderhoud',
        'Flexibel werken. Remote-first, resultaat boven uren',
        'Competitieve vergoeding (freelance of dienstverband)',
        'Klein team, veel eigenaarschap',
        'Mogelijkheid om dagelijks met AI-tooling te werken',
      ],
    },
    tags: ['FastAPI', 'React', 'TypeScript', 'Next.js', 'PostgreSQL'],
    active: true,
  },
];

export function getActiveJobs() {
  return jobs.filter(j => j.active);
}

export function getJobBySlug(slug: string) {
  return jobs.find(j => j.slug === slug);
}
