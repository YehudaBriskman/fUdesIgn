# Locale negotiation and language switchers

> Pick the language from an explicit choice first, the URL second and `Accept-Language` only as a first-visit guess (never IP); keep language separate from region formats; and offer a switcher of native language names, each tagged with its own `lang`, at the top of the page and with no flags.

**Category:** Internationalisation · **Applies to:** routing, first visit, settings, headers and footers, SEO alternates, emails, server rendering · **Priority:** must

## When to use / when not
- Use for any product with more than one UI language, and for single-language products serving users whose browser or region suggests otherwise (an English UI used in Israel still needs Israeli date and currency formats).
- Israel is a multilingual market: government services routinely offer Hebrew, Arabic, English, Russian, Amharic and French.

## Rules (do)
- **Negotiation order:**
  1. The user's explicit choice (account setting or cookie).
  2. The URL (`/he/…`, `/ar/…`, or a subdomain). One URL per language version, so links, bookmarks and search results carry the language.
  3. `Accept-Language` / `navigator.languages`, on first contact only. W3C: "It is not a good idea to use the HTTP Accept-Language header **alone** to determine the locale of the user", but "for a first contact … may be a good starting point".
  4. The product default.
  - Never IP geolocation for language: Arabic speakers in Haifa, Russian speakers in Ashdod, English speakers in Tel Aviv. IP may suggest region defaults (currency, time zone) with a visible way to change them.
- **Language and region are separate settings.** `en-IL` (English language, Israeli formats) gives `₪1,234.50` and day-first dates; `he-US` isn't common, but a Hebrew speaker abroad may still want shekels. Store `language`, `region`, `timeZone`, `currency`, `numberingSystem` and `firstDayOfWeek` independently and compose the formatting locale (`en-IL`, `ar-EG-u-nu-latn`).
- **Canonical BCP 47 tags.** `he`, not `iw` (legacy) or `heb` (ISO 639-3): `Intl.getCanonicalLocales(["iw", "heb"])` returns `["he", "he"]` (verified, Node 26.12). `:lang(he)` selectors, `hreflang` and voice selection match the canonical tag.
- **Matching:** do a BCP 47 lookup (RFC 4647) against supported locales: `he-IL → he`, `ar-MA → ar`, `pt-BR` stays distinct from `pt-PT`. Canonicalise first, then strip subtags from the right.
- **The switcher:**
  - Each option in its own language and script: `עברית`, `العربية`, `English`, `Русский`, `አማርኛ`, `Français`. W3C: "Translate the menu options into the target language."
  - Each option carries `lang` (and `hreflang` on links); RTL names need no extra markup inside a link, but give each link `dir="auto"` or rely on `lang` + the parent's isolation.
  - **No flags.** W3C: "Don't use flags to indicate languages!" because "Flags represent countries, not languages." Arabic is official in more than 20 countries; Israel's flag would mean Hebrew to some and Arabic to others.
  - With a handful of languages, show links rather than a `<select>` (W3C: "probably better to avoid using a pull-down menu altogether"), at or near the top of the page.
  - A label that works in every language: a globe/language icon plus the current language's native name, and an accessible name in the current UI language ("שפה" / "Language").
  - Switching keeps the user on the same page and state in the other language, not the home page.
- **SEO alternates:** `<link rel="alternate" hreflang="he" href="https://example.com/he/pricing">` for each version plus `hreflang="x-default"`.
- **Server responses** set `Content-Language`, and `Vary: Accept-Language` if the response is negotiated from the header (so caches don't serve Hebrew to English visitors).
- **Direction follows the chosen language:** switching to Arabic sets `lang="ar" dir="rtl"` on `<html>` (see `rtl-dir-attribute-and-auto.md`).
- **Emails and notifications** use the stored language, never the language of the last request.

## Anti-patterns (don't)
- Country flags as language buttons (🇮🇱 for Hebrew, 🇸🇦 for Arabic, 🇬🇧/🇺🇸 debates for English).
- Language names in the current UI language only (`אנגלית`, `ערבית`): a user who can't read Hebrew can't find their language.
- Auto-redirecting every request by IP or `Accept-Language`, with no way to stay on the other version.
- A switcher that sends users to the home page of the other language.
- `lang="heb"`, `lang="iw"` or `lang="he_IL"` (underscore) in markup.
- One URL serving different languages by cookie only (uncacheable, unshareable, invisible to search).

## Good references
- [W3C, Accept-Language used for locale setting](https://www.w3.org/International/questions/qa-accept-lang-locales) — first-contact guess only, let users change it, store the choice.
- [W3C, Indicating the language of a link destination](https://www.w3.org/International/questions/qa-link-lang) — "Don't use flags to indicate languages!"
- [W3C, Using `<select>` to link to localized content](https://www.w3.org/International/questions/qa-navigation-select) — native names, top-of-page placement, links over a dropdown for few languages.
- [W3C, Choosing a language tag](https://www.w3.org/International/questions/qa-choosing-language-tags) — shortest ISO 639 code, region only when needed.
- [Bituach Leumi (btl.gov.il)](https://www.btl.gov.il) — language links in native script and tagged with `lang`: `عربية`, `Русский`, `English`, `Français`, `አማርኛ` (headless check, November 2026).
- [Hebrew Wikipedia](https://he.wikipedia.org/) — the interlanguage list names every language natively, each link with its own `lang`.

## Bad references
- [Ivory (ivory.co.il)](https://www.ivory.co.il) — `<html lang="heb">`, a non-canonical tag that `:lang(he)` selectors and `hreflang` matching don't recognise (headless check, November 2026).
- Flag-based switchers in general; W3C's [qa-link-lang](https://www.w3.org/International/questions/qa-link-lang) explains why each flag excludes or misleads a population.

## Accessibility
- Each switcher option's `lang` lets screen readers pronounce `עברית` and `العربية` correctly while the UI is in English (WCAG 3.1.2 Language of Parts).
- The switcher is a navigation landmark item or a disclosure button with `aria-expanded`; it must be reachable early in tab order.
- Don't open the switcher on hover only.

## Motion / interaction (if relevant)
- A language switch is a navigation. Avoid animating the mirrored re-layout; if you use View Transitions, cross-fade only.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Negotiation order | choice → URL → `Accept-Language` (first visit) → default | all requests |
| Locale tag | canonical BCP 47 (`he`, `ar-EG`, `en-IL`) | `lang`, `hreflang`, `Intl` |
| Switcher option | native name, `lang`, `hreflang`, same-page URL | header |
| Switcher control | links for ≤ 6 languages, menu beyond | header |
| Headers | `Content-Language`, `Vary: Accept-Language` when negotiated | server |

## Implementation sketch
```ts
type Supported = "he" | "ar" | "en" | "ru";
const SUPPORTED: readonly Supported[] = ["he", "ar", "en", "ru"];
const isSupported = (tag: string): tag is Supported => (SUPPORTED as readonly string[]).includes(tag);

/** RFC 4647 lookup: canonicalise, then strip subtags from the right until one is supported. */
export function lookup(requested: readonly string[], fallback: Supported = "he"): Supported {
  for (const raw of requested) {
    let tag: string;
    try { [tag] = Intl.getCanonicalLocales(raw); } catch { continue; }
    while (tag) {
      if (isSupported(tag)) return tag;
      const cut = tag.lastIndexOf("-");
      tag = cut > 0 ? tag.slice(0, cut) : "";
    }
  }
  return fallback;
}

/** Parse an Accept-Language header into tags ordered by q. */
export function parseAcceptLanguage(header: string): string[] {
  return header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.trim(), q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter((x) => x.tag && x.tag !== "*" && x.q > 0)
    .sort((a, b) => b.q - a.q)
    .map((x) => x.tag);
}

export function negotiate(opts: { stored?: string; urlPrefix?: string; acceptLanguage?: string }): Supported {
  if (opts.stored && isSupported(opts.stored)) return opts.stored;
  if (opts.urlPrefix && isSupported(opts.urlPrefix)) return opts.urlPrefix;
  return lookup(parseAcceptLanguage(opts.acceptLanguage ?? ""));
}

/** Native names for the switcher, each in its own language. */
export const nativeName = (tag: Supported): string => new Intl.DisplayNames([tag], { type: "language" }).of(tag) ?? tag;
```
```html
<nav aria-label="שפה" class="lang-switch">
  <ul>
    <li><a href="/he/pricing" lang="he" hreflang="he" aria-current="true">עברית</a></li>
    <li><a href="/ar/pricing" lang="ar" hreflang="ar" dir="rtl">العربية</a></li>
    <li><a href="/en/pricing" lang="en" hreflang="en" dir="ltr">English</a></li>
    <li><a href="/ru/pricing" lang="ru" hreflang="ru" dir="ltr">Русский</a></li>
  </ul>
</nav>
<link rel="alternate" hreflang="he" href="https://example.com/he/pricing">
<link rel="alternate" hreflang="ar" href="https://example.com/ar/pricing">
<link rel="alternate" hreflang="x-default" href="https://example.com/he/pricing">
```

## Checklist
- [ ] Language is chosen by stored choice, then URL, then `Accept-Language` on first visit; never by IP.
- [ ] Language, region formats, time zone and currency are separate settings.
- [ ] Every language version has its own URL and `hreflang` alternates.
- [ ] The switcher shows native names with `lang`, no flags, near the top, and keeps the current page.
- [ ] All `lang` values are canonical BCP 47.
- [ ] `Content-Language` and (when negotiated) `Vary: Accept-Language` are sent.

## Sources
- https://www.w3.org/International/questions/qa-accept-lang-locales
- https://www.w3.org/International/questions/qa-link-lang
- https://www.w3.org/International/questions/qa-navigation-select
- https://www.w3.org/International/questions/qa-choosing-language-tags
- https://www.rfc-editor.org/rfc/rfc4647
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames
- https://developers.google.com/search/docs/specialty/international/localized-versions
- https://www.btl.gov.il , https://he.wikipedia.org/ , https://www.ivory.co.il (headless-browser inspection, November 2026)
- Local verification: Node v26.12 `Intl.getCanonicalLocales`, `Intl.DisplayNames`, `Intl.NumberFormat("en-IL")`.
