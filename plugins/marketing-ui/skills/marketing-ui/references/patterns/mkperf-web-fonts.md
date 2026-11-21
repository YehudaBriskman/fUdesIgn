# Web fonts on marketing pages

> Self-host subsetted WOFF2, keep the critical path to 2 families and about 4 files, preload only the 1–2 fonts the hero needs, and give every web font a metric-matched fallback so the swap moves nothing.

**Category:** Performance · **Applies to:** display and body typefaces, hero headlines, nav, pricing numerals, any `@font-face` · **Priority:** must

## When to use / when not
- Use whenever a page loads a web font. A display face is often the strongest brand signal on a marketing page (see `mkstyle-display-type-pairing.md`), so it is worth the bytes, but only if it costs no layout shift and little LCP.
- If the brief does not need a custom face for body text, use a system stack (`--mk-font-body`). It is zero bytes, zero requests and zero shift.
- Not a licence guide. Check that the licence allows self-hosting, subsetting and web embedding before you convert a font.

## Rules (do)
- **Format:** WOFF2 only. It uses Brotli and is about 30% smaller than WOFF, and every current browser supports it. Drop TTF, EOT and WOFF sources.
- **Self-host** on your own origin (or your CDN). It removes a third-party connection (DNS, TCP, TLS to a second host) and the privacy question below. Serve with `Cache-Control: public, max-age=31536000, immutable` and a hashed filename.
- **Subset.** A Latin subset (U+0000–00FF plus punctuation and currency) usually cuts a 100–300 KB family file to 20–50 KB. Split other scripts into separate files with `unicode-range` so they download only when the page uses those characters. Tools: `pyftsubset` (fonttools), glyphhanger, or the subsetting that Fontsource and next/font already ship.
- **Budget:** at most 2 families and about 4 files on the critical path (e.g. display bold, body regular, body bold, body italic), ≤ 100 KB total WOFF2 for the first view. Median font weight per home page is 111 KB mobile and 131 KB desktop, so treat that median as a ceiling, not a target.
- **Variable fonts** when you use 3 or more weights or styles of one family. One variable file (often 40–90 KB subsetted) replaces several static files. If you use only 1–2 weights, static files are smaller.
- **`font-display`:**
  - `swap` (block 0 ms, swap forever): use for the display face of the h1 when brand matters. The text paints at once in the fallback; with a metric-matched fallback, the swap shifts almost nothing.
  - `optional` (block ~100 ms, no swap): use for body text when you would rather keep the fallback than shift late. On a cold first visit the fallback may stay for that page view; the font is cached for the next one.
  - `fallback` (block ~100 ms, swap window ~3 s) is a middle option. Avoid `block` and `auto` (up to 3 s of invisible text in Chrome and Firefox).
- **Preload only the 1–2 fonts used above the fold**, usually the display weight of the h1 and the body regular. Preload needs `as="font" type="font/woff2" crossorigin`, even on the same origin, or the browser fetches the file twice. Preload ignores `unicode-range`, so preload only the subset the hero uses.
- **Metric-override fallbacks:** declare a local fallback `@font-face` with `size-adjust`, `ascent-override`, `descent-override` and `line-gap-override` tuned to the web font. next/font (`adjustFontFallback`), Fontaine and Capsize generate these values automatically. Fontaine's own demo reports CLS falling from 0.24 to 0.054 with no other change (vendor figure, single page).
- **Inline the `@font-face` rules** in the HTML head (or a small critical CSS block). A font referenced from an external stylesheet is only discovered after that stylesheet downloads.
- **System font stacks** are the zero-cost option: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` (the `--mk-font-body` token). They render the native UI face on each platform.

## Anti-patterns (don't)
- Loading 4–6 families from a third-party CSS URL with every weight from 100 to 900.
- Preloading every font file, which steals bandwidth from the LCP image.
- Preload without `crossorigin` (double download) or preload of a file that the CSS never uses (console warning, wasted bytes).
- `font-display: block` on body copy: up to 3 s of invisible text on slow networks.
- A fallback with very different metrics (a wide display face falling back to Arial), so the h1 reflows from 2 lines to 3 when the font arrives.
- Hot-linking Google Fonts on an EU-facing site without a legal basis (see Accessibility and privacy below).
- Faux bold or italic: requesting a weight the files do not contain, so the browser synthesises it.

## Good references
- [Next.js — Font optimization](https://nextjs.org/docs/app/getting-started/fonts) — self-hosts Google and local fonts at build time, so the browser sends no request to Google, and generates an adjusted fallback to avoid layout shift.
- [Fontaine (unjs)](https://github.com/unjs/fontaine) — generates `size-adjust` and the three override descriptors for `local()` fallbacks from your `@font-face` rules.
- [web.dev — CSS size-adjust](https://web.dev/articles/css-size-adjust) — worked examples of the descriptors and why they cut CLS.
- [Fontsource](https://fontsource.org) — npm packages of open fonts, pre-subsetted by script, ready to self-host.
- [Capsize (SEEK)](https://seek-oss.github.io/capsize/) — reads real font metrics and outputs fallback `size-adjust` and override values, plus text trimming so line boxes match the cap height.

## Bad references
- [Web Almanac 2024 — Fonts](https://almanac.httparchive.org/en/2024/fonts) — only 11% of pages preload fonts, `font-display: optional` is on about 1% of pages, and 23% still use `block`.
- [LG München I, 3 O 17493/20 (20 Jan 2022)](https://www.gesetze-bayern.de/Content/Document/Y-300-Z-BECKRS-B-2022-N-612) — a site that loaded Google Fonts from Google's servers without consent passed the visitor's IP address to Google. The court found no consent and no legitimate interest (Art. 6(1) GDPR), since the fonts can be used without contacting Google, ordered the site to stop and awarded €100 in damages.
- A common template pattern: a `fonts.googleapis.com` stylesheet requesting two families in 9 weights each, discovered after the main CSS, with `display=block`. It adds a cross-origin connection and up to 3 s of invisible hero text.

## Accessibility
- Text must stay readable during loading. `swap` or `optional` both avoid invisible text; `block` does not.
- Choose faces with clear distinction between I, l and 1, and an x-height that stays legible at 16px body size.
- Do not set body text below 16px to compensate for a font with a small x-height; use `size-adjust` on the face instead.
- Privacy is part of trust: self-hosting removes the third-party IP transfer the Munich court objected to.

## Motion / interaction (if relevant)
- Not applicable. Do not fade text in to hide a font swap; that delays LCP when the h1 is the LCP element.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `--mk-font-display` | brief's face, then `ui-sans-serif, system-ui, sans-serif` | h1, h2 |
| `--mk-font-body` | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` | body, zero-cost default |
| `--mk-font-serif` / `--mk-font-mono` | Charter stack / `ui-monospace` stack | editorial / code only |
| Families on critical path | ≤ 2 | display + body |
| Files on critical path | ≈ 4, ≤ 100 KB WOFF2 total | subsetted |
| Preloaded fonts | 1–2 | hero weights only |
| `font-display` | `swap` (display), `optional` (body) | |
| Block / swap periods | swap 0 ms; optional ~100 ms; fallback ~100 ms + 3 s | web.dev |

## Implementation sketch
```html
<link rel="preload" href="/fonts/brand-display-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/body-var-latin.woff2" as="font" type="font/woff2" crossorigin>
```
```css
@font-face {
  font-family: "Brand Display";
  src: url("/fonts/brand-display-latin.woff2") format("woff2");
  font-weight: 700;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+2013-2014, U+2018-201E, U+20AC, U+2122;
}
@font-face {
  font-family: "Brand Body";
  src: url("/fonts/body-var-latin.woff2") format("woff2");
  font-weight: 300 800;
  font-display: optional;
  unicode-range: U+0000-00FF, U+2013-2014, U+2018-201E, U+20AC;
}
/* Metric-matched local fallback (values from Fontaine / Capsize for your face). */
@font-face {
  font-family: "Brand Display Fallback";
  src: local("Arial"), local("Helvetica Neue"), local("Roboto");
  size-adjust: 104%;
  ascent-override: 92%;
  descent-override: 24%;
  line-gap-override: 0%;
}
:root {
  --mk-font-display: "Brand Display", "Brand Display Fallback", ui-sans-serif, system-ui, sans-serif;
  --mk-font-body: "Brand Body", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
body { font-family: var(--mk-font-body); }
.mk-display { font-family: var(--mk-font-display); font-synthesis: none; }
```

## Checklist
- [ ] Every font file is WOFF2, served from your own origin with a one-year immutable cache.
- [ ] No request goes to `fonts.googleapis.com` or `fonts.gstatic.com` on EU-facing pages.
- [ ] The first view loads ≤ 2 families, about 4 files and ≤ 100 KB of font data.
- [ ] At most 2 fonts are preloaded, each with `as="font"`, `type="font/woff2"` and `crossorigin`.
- [ ] Every `@font-face` sets `font-display: swap` or `optional`; none uses `block`.
- [ ] Each web font has a metric-adjusted fallback, and font-swap CLS on the hero is < 0.01 in a throttled trace.
- [ ] `font-synthesis: none` (or real files) so no weight or style is faked.

## Sources
- https://web.dev/articles/font-best-practices (WOFF2 ~30% better than WOFF; block/swap periods; preload needs `crossorigin`; preload ignores `unicode-range`)
- https://web.dev/articles/css-size-adjust
- https://almanac.httparchive.org/en/2024/fonts (web fonts on ~87% of sites; Google Fonts on 57% desktop / 48% mobile; WOFF2 on 81% / 78%; median file 39 KB; `swap` 44–45%, `block` 23%, `optional` 0–1%; preload 11%; variable fonts on 33–34%)
- https://almanac.httparchive.org/en/2024/page-weight (median font bytes per home page 111 KB mobile, 131 KB desktop)
- https://nextjs.org/docs/app/getting-started/fonts
- https://nextjs.org/docs/app/api-reference/components/font (`adjustFontFallback`)
- https://github.com/unjs/fontaine (CLS 0.24 → 0.054 on its playground; vendor demo)
- https://github.com/seek-oss/capsize
- https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
- https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range
- https://www.gesetze-bayern.de/Content/Document/Y-300-Z-BECKRS-B-2022-N-612 (LG München I, judgment of 20 Jan 2022, 3 O 17493/20, official Bavarian publication)
- https://www.ihk.de/bergische/recht-und-steuern/wettbewerbsrecht/google-fonts-5646176 (follow-on demand letters of 100–170 €)
- https://fontsource.org
