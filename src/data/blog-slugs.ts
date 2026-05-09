/**
 * Blog slug mapping between EN and NL.
 * Only posts with DIFFERENT slugs need to be listed here.
 * Posts with identical slugs in both languages are handled automatically.
 *
 * Format: { en: 'english-slug', nl: 'dutch-slug' }
 */
export const blogSlugMap: { en: string; nl: string }[] = [
  {
    en: 'chatgpt-nl-gpt-nl-ai-netherlands-2026',
    nl: 'chatgpt-nl-gpt-nl-ai-nederland-2026',
  },
  // Add more translated slug pairs here as needed
];

/**
 * Given a blog slug and source language, returns the slug in the target language.
 * If no mapping exists, returns the same slug (most posts share identical slugs).
 */
export function getAlternateSlug(slug: string, fromLang: 'en' | 'nl'): string {
  const toLang = fromLang === 'en' ? 'nl' : 'en';

  for (const pair of blogSlugMap) {
    if (pair[fromLang] === slug) {
      return pair[toLang];
    }
  }

  return slug; // Same slug in both languages
}
