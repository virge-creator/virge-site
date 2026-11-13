// SEO advice service: free report via Formspree, subscriptions via Stripe Payment Links.
// The site is static, so no Stripe secret key lives here. Payment Links are public URLs;
// all prices, tax and payment methods are configured in the Stripe Dashboard.
// See README.md → "SEO advice & Stripe" for the one-time Stripe setup.

import type { Lang } from '../i18n';

/** Same Formspree inbox as contact and webinars; Hermes filters on `form=seo-free`. */
export const FORMSPREE_SEO = 'https://formspree.io/f/mpqjjpnb';

export type PlanId = 'monthly' | 'weekly';
export type Billing = 'month' | 'year';

export interface Plan {
  id: PlanId;
  /** Prices in EUR, excluding VAT. Keep in sync with the Stripe prices. */
  prices: Record<Billing, number>;
  /** Stripe Payment Links (https://buy.stripe.com/...). Empty = not live yet. */
  links: Record<Billing, string>;
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'monthly',
    prices: { month: 5, year: 50 },
    links: { month: '', year: '' },
  },
  {
    id: 'weekly',
    prices: { month: 25, year: 250 },
    links: { month: '', year: '' },
    popular: true,
  },
];

/** Stripe no-code customer portal login link (https://billing.stripe.com/p/login/...). */
export const CUSTOMER_PORTAL_URL = '';

/** Languages a report can be written in, each named in its own language. */
export const REPORT_LANGUAGES: { code: string; name: string }[] = [
  { code: 'nl', name: 'Nederlands' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'pl', name: 'Polski' },
];

/** Add the visitor's email and the Checkout language to a Payment Link. */
export function buildCheckoutUrl(link: string, { email, lang }: { email?: string; lang: Lang }): string {
  const url = new URL(link);
  url.searchParams.set('locale', lang);
  if (email) url.searchParams.set('prefilled_email', email);
  return url.toString();
}

export function formatEuro(amount: number, lang: Lang): string {
  return new Intl.NumberFormat(lang === 'nl' ? 'nl-NL' : 'en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);
}
