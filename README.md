# virge-site

The Virge.io website, built with [Astro](https://astro.build). Pages live in English (`/en/`) and Dutch (`/nl/`).

## Development

```bash
npm install
npm run dev       # local dev server
npm run build     # static build into dist/
npm run preview   # serve the build locally
```

## Webinars

All webinars are defined in `src/data/webinars.ts`: title, summary, agenda, speakers and date (always the second Wednesday of the month, 15:00 to 16:00 Amsterdam time). Speakers are kept in the `SPEAKERS` map in the same file. Adding a webinar there automatically creates its detail pages (`/en/webinars/<slug>/` and `/nl/webinars/<slug>/`), the `.ics` calendar file and its social banners.

### Social banners

Every webinar detail page contains ready-made banners for social posts. They are hidden for regular visitors and only show when you add `?banner` to the URL:

```
https://virge.io/en/webinars/<slug>/?banner
https://virge.io/nl/webinars/<slug>/?banner   # Dutch version
```

Two formats are shown, one below the other:

| Format    | Size      | Use for                          |
|-----------|-----------|----------------------------------|
| Wide      | 1200×627  | LinkedIn, X, Mastodon            |
| Square    | 1080×1080 | Instagram, square feed posts     |

Each banner shows the Virge logo, product (blue accent for Workflow Orchestrator, pink for ShopVirge), title, summary, speakers, date and time, and a "Register at virge.io" call to action. All content comes from `src/data/webinars.ts`.

**Making a pixel-exact screenshot (Chrome / Edge):**

1. Open the detail page with `?banner` in a window wider than the banner (at least ~1250 px).
2. Open DevTools (`F12`), select the element with class `social-banner` (the wide or the square one).
3. Right-click it in the Elements panel and choose **Capture node screenshot**.

This saves a PNG at exactly the banner size, with nothing around it. In Firefox, right-click the page, choose **Take Screenshot** and click the banner.

The banner component is `src/components/WebinarSocialCard.astro`.

## Style guide

The colours, logos, type and Google Slides theme are published at [/styleguide/](https://virge.io/styleguide/). The page is `src/pages/styleguide/index.astro`, its downloads are in `public/styleguide/`.

The theme is a `.pptx`, because that is how Google Slides imports themes. To change it, edit `scripts/styleguide/build_slides_theme.py` and run it (it needs Pillow and numpy). It rewrites the theme and the logo files, not the two `preview-*.jpg` images. The colours in the script and on the page are kept in sync by hand.

Decks built on this theme live in `decks/`. `scripts/styleguide/build_wfo_core_deck.py` builds `decks/wfo-core-principles.pptx`.

## SEO advice & Stripe

The SEO advice page (`/en/seo/`, `/nl/seo/`) has two flows:

- **Free report:** `src/components/SeoAdviceForm.astro` posts name, email, website and report language to Formspree (subject `SEO advice request (free)`, field `form=seo-free`). Hermes picks it up from the inbox and emails the report. After sending, the visitor lands on `/{lang}/seo/thanks/?type=free`, which offers the subscriptions.
- **Subscriptions:** `src/components/SeoPlansModal.astro` is a modal with a monthly/yearly toggle. Each "Subscribe" button opens a **Stripe Payment Link**, with the visitor's email (`prefilled_email`) and the site language (`locale`) added. The site is static, so there is no secret key anywhere: prices, VAT and payment methods all live in Stripe. Any element with `data-open-plans` opens the modal (`data-plan="weekly"` highlights a plan), and so does `?plans` in the URL.

All config is in `src/data/seo.ts`. As long as a Payment Link is empty, the button shows a "coming soon, contact us" message instead.

### One-time Stripe setup

1. Create two products, each with a monthly and a yearly price in EUR, with **tax behavior: exclusive**:
   - SEO Advice Monthly: €5/month, €50/year
   - SEO Advice Weekly: €25/month, €250/year
2. Turn on **Stripe Tax**.
3. Under Settings → Payment methods, turn on iDEAL, SEPA Direct Debit, Bancontact, cards and Apple Pay/Google Pay. Dutch customers pay the first time with iDEAL; the subscription is then collected by SEPA direct debit.
4. Create a **Payment Link** for each of the 4 prices with:
   - Collect tax IDs: on, and require a billing address.
   - A custom field "Website URL" (text, required), so Hermes knows which site belongs to the subscription.
   - After payment: redirect to `https://virge.io/en/seo/thanks/?type=subscribed`. The Checkout language follows `locale`, so one set of links serves both languages.
5. Turn on the **customer portal** (Settings → Billing → Customer portal) and copy its login link.
6. Paste the 4 `https://buy.stripe.com/...` links into `PLANS` and the portal link into `CUSTOMER_PORTAL_URL` in `src/data/seo.ts`.

Test with Stripe test-mode links first, then swap in the live links. To check whether someone has an active subscription, Hermes looks up their email address in Stripe.
