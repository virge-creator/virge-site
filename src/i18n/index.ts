import en from './en.json';
import nl from './nl.json';

const translations: Record<string, typeof en> = { en, nl };

export type Lang = 'en' | 'nl';
export const languages: Lang[] = ['en', 'nl'];
export const defaultLang: Lang = 'en';

export function t(lang: Lang) {
  return translations[lang] || translations[defaultLang];
}

export function getOtherLang(lang: Lang): Lang {
  return lang === 'en' ? 'nl' : 'en';
}

export function localePath(lang: Lang, path: string): string {
  return `/${lang}${path.startsWith('/') ? path : '/' + path}`;
}
