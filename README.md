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
