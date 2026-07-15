// JSON-LD builders for schema.org structured data. Pages pass the result to
// Layout's `jsonLd` prop; the site-wide Organization block is emitted by
// Layout itself.

export const SITE_URL = 'https://virge.io';

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Virge.io',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
} as const;

interface ServiceInput {
  name: string;
  description: string;
  path: string;
}

export function serviceSchema({ name, description, path }: ServiceInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${SITE_URL}${path}`,
    serviceType: name,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: 'Worldwide',
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

interface BlogPostingInput {
  title: string;
  description?: string;
  date: string;
  author?: string;
  path: string;
  image?: string;
  lang: string;
}

export function blogPostingSchema({ title, description, date, author, path, image, lang }: BlogPostingInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    ...(description ? { description } : {}),
    datePublished: date,
    inLanguage: lang === 'nl' ? 'nl-NL' : 'en-US',
    url: `${SITE_URL}${path}`,
    ...(image ? { image: image.startsWith('http') ? image : `${SITE_URL}${image}` } : {}),
    author: author
      ? { '@type': 'Person', name: author }
      : { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: `${SITE_URL}${path}`,
  };
}

// Only emit FAQPage on pages whose FAQ content is visible to visitors —
// Google ignores (and may penalize) FAQ markup without matching on-page text.
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}
