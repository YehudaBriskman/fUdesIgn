# Pseudo-localisation and RTL testing (with a Playwright recipe)

> Before any translation exists, run every screen in an accented, +40%, bracketed pseudo-locale and in a forced-RTL pseudo-locale, and gate CI on an automated direction audit plus LTR/RTL screenshots of the key screens in real Hebrew and Arabic.

**Category:** Internationalisation · **Applies to:** CI, component libraries (Storybook), end-to-end tests, design review, release checks · **Priority:** should

## When to use / when not
- Use from the first sprint of an internationalised product; pseudo-locales find hard-coded strings, concatenation, truncation and mirroring bugs while they are cheap.
- Keep a real-language pass too: pseudo-locales can't find bidi bugs that only appear with real Hebrew or Arabic mixed with Latin and numbers, or typography problems (line-height, fonts).
- Not a substitute for native-speaker review of copy.

## Rules (do)
- **Two pseudo-locales**, as Android ships ([pseudolocales](https://developer.android.com/guide/topics/resources/pseudolocales)):
  - **Accented + expanded** (Android's `en-XA`): replace letters with accented look-alikes, expand by about 40% (see the budget in `i18n-text-expansion-and-layout.md`), and bracket each message `[…]`. Un-accented text on screen is a hard-coded string; a sentence in two bracket pairs is concatenation; a missing closing bracket is truncation.
  - **Forced RTL** (Android's `ar-XB`): render the page with `dir="rtl"` and the English messages reversed by an RTL override, so anything unmirrored stands out without reading Hebrew. Android: misplaced punctuation shows as "elur selacoloduesp!" instead of "!elur selacoloduesp".
- **Preserve placeholders and tags** when pseudo-localising (`{count}`, `<b>…</b>`, ICU plural syntax), or the pseudo-locale breaks the app instead of testing it.
- **Real-language fixtures**: a Hebrew and an Arabic catalogue for test data with the worst cases: mixed Hebrew + English + numbers (`הזמנה #A-10293 ל־Ben's Café`), negative money, phone numbers, long German-length strings, names with geresh and niqqud, Arabic with harakat.
- **Automated direction audit** (run in Playwright on each key page, both directions):
  - `<html>` has `lang` and `dir`, and they agree with the locale.
  - No element with RTL-script text computes to `direction: ltr` unless it is an intended LTR island.
  - Email, URL, tel and password inputs compute to `direction: ltr`.
  - No visible text computes to `text-align: left` or `right` inside RTL (only `start`/`end`), except numeric cells.
  - No horizontal page overflow (`scrollWidth > clientWidth`) with the expanded pseudo-locale at 320 px.
  - No raw message keys or `{placeholders}` in visible text.
- **Screenshots**: `toHaveScreenshot()` per key screen in `en`, `he` and `ar` (and the pseudo-locales), so a visual diff catches a component that stopped mirroring.
- **Emulate the locale and time zone in the browser context** (`locale: "he-IL"`, `timezoneId: "Asia/Jerusalem"`), so `navigator.language`, `Intl` defaults and native date inputs behave like a real Israeli user's browser.
- **Keyboard checks in RTL**: arrow keys in tabs, sliders, menus and calendar grids move in the visual direction.
- **Manual review checklist** for each release: the rubric in `iref-i18n-review-rubric.md`.

## Anti-patterns (don't)
- Testing RTL only by toggling `dir` in DevTools on the home page.
- Pseudo-localising at runtime in production builds (ship it only in development and CI).
- Screenshot tests in RTL with English fixture data: the bidi bugs never show.
- Ignoring the `en-XA`-style bracket check because "German fits": short labels expand up to 300%.
- Waiting for translations to arrive before testing layout.

## Good references
- [Android, Test your app with pseudolocales](https://developer.android.com/guide/topics/resources/pseudolocales) — `en-XA` (accents, expansion, brackets) and `ar-XB` (forced RTL), and what each one reveals.
- [Netflix Tech Blog, Pseudo Localization @ Netflix](https://netflixtechblog.com/pseudo-localization-netflix-12fff76fbcbe) — pseudo-localisation as the default language of debug builds, padding each string to simulate 40% expansion, so hard-coded strings and truncation show up before translation.
- [Playwright, Emulation](https://playwright.dev/docs/emulation) — `locale`, `timezoneId` and per-test context options.
- [Playwright, Visual comparisons](https://playwright.dev/docs/test-snapshots) — `toHaveScreenshot()` baselines per project.

## Bad references
- [androidx/media issue #227](https://github.com/androidx/media/issues/227) — a mirrored media-control bug in a widely used component, exactly what a forced-RTL screenshot test of the player screen catches.
- The Fox, Ivory and Super-Pharm inconsistencies recorded in `rtl-numbers-digits-currency.md` (mixed `₪` positions on one page) — the kind of drift a fixture-driven RTL screenshot suite flags immediately.

## Accessibility
- Run the axe or equivalent accessibility scan in each locale: `lang` and label associations are per-locale bugs.
- Include a screen-reader smoke test in Hebrew (NVDA or VoiceOver with a Hebrew voice) for one flow per release: pronunciation of mixed Hebrew/English/number strings depends on `lang` markup.

## Motion / interaction (if relevant)
- Test reduced-motion and RTL together: slide directions must be mirrored in RTL and removed under `prefers-reduced-motion`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Pseudo-locale (LTR) | accented, +40%, `[…]` | layout and hard-coded strings |
| Pseudo-locale (RTL) | `dir="rtl"` + RLO-reversed English | mirroring |
| Real fixtures | `he-IL`, `ar-EG` (Arabic-Indic digits), `de-DE` (length) | bidi, digits, expansion |
| Browser context | `locale`, `timezoneId: "Asia/Jerusalem"` | Playwright projects |
| Viewports | 320, 768, 1280 px | overflow checks |

## Implementation sketch
```ts
// pseudo.ts: dev/CI-only pseudo-localisation that keeps ICU placeholders and tags intact
const ACCENTS: Record<string, string> = {
  a: "á", b: "ƀ", c: "ç", d: "ð", e: "é", f: "ƒ", g: "ĝ", h: "ĥ", i: "î", j: "ĵ", k: "ķ", l: "ļ", m: "ɱ",
  n: "ñ", o: "ö", p: "þ", r: "ŕ", s: "š", t: "ţ", u: "û", w: "ŵ", y: "ý", z: "ž",
  A: "Å", C: "Ç", E: "É", I: "Î", N: "Ñ", O: "Ö", S: "Š", U: "Û",
};
const PROTECTED = /(\{[^{}]*\}|<\/?\w+>)/g; // ICU arguments (simple) and rich-text tags

export function pseudoAccented(message: string, expansion = 0.4): string {
  const parts = message.split(PROTECTED);
  const body = parts.map((p, i) => (i % 2 === 1 ? p : [...p].map((ch) => ACCENTS[ch] ?? ch).join(""))).join("");
  const visible = message.replace(PROTECTED, "").length;
  const pad = " ·".repeat(Math.ceil((visible * expansion) / 2));
  return `[${body}${pad}]`;
}

const RLO = "‮";
const PDF = "‬";
/** Forced-RTL pseudo-locale: test builds only; never let override characters reach production text. */
export const pseudoRtl = (message: string): string => `${RLO}${message}${PDF}`;
```
```ts
// rtl-audit.ts: runs inside the page (page.evaluate(auditDirection)), returns human-readable problems
export function auditDirection(): string[] {
  const problems: string[] = [];
  const html = document.documentElement;
  if (!html.lang) problems.push("<html> has no lang");
  if (!html.getAttribute("dir")) problems.push("<html> has no dir attribute (direction set only in CSS?)");
  const rtlScript = /[֐-׿؀-ۿ]/;
  const textEls = [...document.querySelectorAll<HTMLElement>("body *")].filter((el) =>
    [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? "").trim() !== ""));
  for (const el of textEls) {
    const cs = getComputedStyle(el);
    const own = [...el.childNodes].filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent ?? "").join("");
    if (rtlScript.test(own) && cs.direction === "ltr" && !el.closest("[dir=ltr]"))
      problems.push(`RTL text in an LTR box: "${own.trim().slice(0, 30)}"`);
    if (cs.direction === "rtl" && (cs.textAlign === "left" || cs.textAlign === "right") && !el.closest(".num, td.num"))
      problems.push(`physical text-align:${cs.textAlign} on <${el.tagName.toLowerCase()}> "${own.trim().slice(0, 20)}"`);
    const trimmed = own.trim();
    const looksLikeKey = /^[a-z][\w-]*(\.[\w-]+){2,}$/.test(trimmed) && !/\.(com|org|net|io|il|co|uk)$/.test(trimmed);
    if (/\{\w+\}/.test(own) || looksLikeKey) problems.push(`raw key or placeholder: "${trimmed.slice(0, 30)}"`);
  }
  for (const input of document.querySelectorAll<HTMLInputElement>('input[type=email], input[type=url], input[type=tel], input[type=password]'))
    if (getComputedStyle(input).direction !== "ltr") problems.push(`${input.type} input "${input.name}" is not LTR`);
  if (document.documentElement.scrollWidth > document.documentElement.clientWidth + 1)
    problems.push(`horizontal overflow: ${document.documentElement.scrollWidth}px > ${document.documentElement.clientWidth}px`);
  return problems;
}
```
```js
// rtl.spec.js (@playwright/test). Projects: he-IL and ar-EG, plus en for the LTR baseline.
import { test, expect } from "@playwright/test";
import { auditDirection } from "./rtl-audit.js";

const PAGES = ["/", "/checkout", "/settings/profile", "/reports/revenue"];

for (const locale of ["he-IL", "ar-EG"]) {
  test.describe(`RTL ${locale}`, () => {
    test.use({ locale, timezoneId: "Asia/Jerusalem", viewport: { width: 1280, height: 800 } });

    for (const path of PAGES) {
      test(`${path} audits clean and matches baseline`, async ({ page }) => {
        await page.goto(`/${locale.slice(0, 2)}${path}`);
        await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
        await expect(page.locator("html")).toHaveAttribute("lang", new RegExp(`^${locale.slice(0, 2)}`));
        const problems = await page.evaluate(auditDirection);
        expect(problems, problems.join("\n")).toEqual([]);
        await expect(page).toHaveScreenshot(`${locale}${path.replaceAll("/", "_")}.png`, { fullPage: true });
      });
    }

    test("tablist arrow keys follow the visual direction", async ({ page }) => {
      await page.goto(`/${locale.slice(0, 2)}/reports/revenue`);
      const first = page.getByRole("tab").first();
      await first.focus();
      await page.keyboard.press("ArrowLeft"); // in RTL, left is "next"
      await expect(page.getByRole("tab").nth(1)).toBeFocused();
    });
  });
}

test("pseudo-locale has no overflow at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/en-XA/checkout");
  const problems = await page.evaluate(auditDirection);
  expect(problems.filter((p) => p.startsWith("horizontal overflow"))).toEqual([]);
});
```

## Checklist
- [ ] Accented +40% bracketed pseudo-locale runs in development and CI.
- [ ] Forced-RTL pseudo-locale and real `he`/`ar` fixtures exist with mixed-direction worst cases.
- [ ] The direction audit runs on every key page in both directions and fails CI on problems.
- [ ] Screenshot baselines exist for `en`, `he`, `ar` (and pseudo) per key screen.
- [ ] Browser contexts emulate locale and time zone.
- [ ] RTL keyboard behaviour is tested for composite widgets.
- [ ] A native-speaker review and a Hebrew screen-reader smoke test happen per release.

## Sources
- https://developer.android.com/guide/topics/resources/pseudolocales
- https://netflixtechblog.com/pseudo-localization-netflix-12fff76fbcbe
- https://playwright.dev/docs/emulation
- https://playwright.dev/docs/test-snapshots
- https://www.w3.org/International/questions/qa-html-dir
- https://github.com/androidx/media/issues/227
- Local verification (November 2026): the audit function, transpiled and run with playwright-core in Chromium, flags ynet's missing root `dir` and Hebrew text in LTR boxes, and passes Bituach Leumi's root while flagging its physical `text-align: right` (harmless in a Hebrew-only page, a bug once the same CSS serves English).
