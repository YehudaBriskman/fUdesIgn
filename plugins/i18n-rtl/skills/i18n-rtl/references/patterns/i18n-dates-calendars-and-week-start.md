# Dates, calendars and week start

> Format every date and time with `Intl.DateTimeFormat` for the user's full locale and time zone, take the week start and weekend from CLDR (`Intl.Locale` week info) instead of assuming Monday or Sunday, and treat the Hebrew and Hijri calendars as calendars (via `-u-ca-` and Temporal), not as string decorations.

**Category:** Internationalisation · **Applies to:** timestamps, date pickers, calendars, schedules, business-day maths, holidays, relative times, date ranges · **Priority:** must

## When to use / when not
- Use for every displayed date or time, every calendar grid, and every rule that counts days, weeks or business days.
- Storage is not formatting: store instants as UTC (or Temporal `Instant`), dates without time as `PlainDate`. The modern-web-guidance guide [capture-location-agnostic-data.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/js/capture-location-agnostic-data.md) covers that split.
- Date-range picker UX (presets, comparison periods) is in dashboard-ui's `comp-date-range-picker.md`, and date fields in forms-ui's `finput-dates-and-times.md`; this file covers locale and calendar.

## Rules (do)
- **Never hand-build date strings.** Israel writes `12.9.2026` (`he-IL` short) and `12 בספטמבר 2026` (long); the US writes `9/12/2026`. `Intl.DateTimeFormat("he-IL", { dateStyle: "medium", timeStyle: "short" })` gives `12 בספט׳ 2026, 12:30`, 24-hour (verified, Node 26.12, ICU 78.3, CLDR 48).
- **Ranges** use `formatRange`, which collapses shared parts: `12–20 בספטמבר 2026`.
- **Relative times** use `Intl.RelativeTimeFormat` with `numeric: "auto"`: Hebrew has single words for −2…+2 days (`שלשום`, `אתמול`, `מחר`, `מחרתיים`) that a "{n} days ago" template can't produce.
- **Week start and weekend come from the locale.** `new Intl.Locale(tag).getWeekInfo()` (verified values; days are 1 = Monday … 7 = Sunday):

  | Locale | First day | Weekend |
  |---|---|---|
  | `he-IL` | 7 (Sunday) | 5, 6 (Friday, Saturday) |
  | `ar-SA` | 7 (Sunday) | 5, 6 |
  | `ar-EG` | 6 (Saturday) | 5, 6 |
  | `ar-AE` | 1 (Monday) | 6, 7 (the UAE moved to a Saturday–Sunday weekend in 2022) |
  | `fa-IR` | 6 (Saturday) | 5 (Friday only) |
  | `en-US` | 7 (Sunday) | 6, 7 |
  | `en-GB`, `de-DE` | 1 (Monday) | 6, 7 |

  Browser support differs: Chromium has `getWeekInfo()`, Safari 17+ exposes a `weekInfo` accessor, Firefox has neither yet. Feature-detect and fall back to a small table. Let users override the week start in settings.
- **Business days are not Monday–Friday.** In Israel the working week is Sunday–Thursday and many businesses close early Friday. Compute "2 business days" with the locale's weekend, plus a holiday calendar.
- **Calendars are a locale extension.** `he-IL-u-ca-hebrew` formats 12 September 2026 as `יום שבת, א׳ בתשרי תשפ״ז` (Rosh Hashanah 5787), with Hebrew-letter numerals, geresh and gershayim. `ar-SA-u-ca-islamic-umalqura` gives `السبت، ١ ربيع الآخر ١٤٤٨ هـ`. `fa-IR` defaults to the Persian calendar (`۱۴۰۵/۶/۲۱`). `he-IL` and, in CLDR 48, `ar-SA` default to Gregorian.
- **Israel's civil default is Gregorian; show the Hebrew date alongside where it matters** (holidays, memorials, religious services, school calendars, government forms), never instead of it unless the context is religious.
- **Do arithmetic in the calendar, not in strings.** The modern-web-guidance guide on [global calendar systems](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/js/support-global-calendar-systems.md) gives the Temporal rules; the Hebrew-specific consequences:
  - A Hebrew leap year has 13 months (5787 does: `monthsInYear` 13). Use `monthCode`, not `month`: Adar I is `M05L`, Adar (or Adar II) is `M06`. Purim is 14 `M06`: 3 March 2026 in 5786, and 14 Adar II, 23 March 2027, in 5787 (14 Adar I, `M05L`, is 21 February 2027).
  - Jewish days and holidays begin at sunset, so "Erev" (the evening before) matters for opening hours; date-only logic can't express it.
  - Temporal is in Chrome/Edge 144 and Firefox 139, not yet in Safari; load a polyfill behind feature detection.
- **Islamic calendars vary.** `islamic-umalqura` (Saudi official), `islamic-civil` and `islamic-tbla` are calculated; religious observance often follows sighting. The calendar guide's advice: "verify with domain experts" for religious dates.
- **Time zones**: always pass `timeZone` (the user's or the record's), and show it when people in several zones read the same data. Hebrew short zone names are offsets (`12:30 GMT+3`), so add the city for clarity (`שעון ישראל`). Israel's DST rules differ from the EU and US; never hard-code offsets.
- **Native `<input type="date">` uses the browser's locale**, not the page's `lang`. A Hebrew page in an English browser shows `mm/dd/yyyy`. Either accept that and echo the chosen date formatted for the page locale beside the input, or use a custom picker that takes `locale`, `firstDay` and `calendar`.

## Anti-patterns (don't)
- `` `${d.getDate()}/${d.getMonth() + 1}` `` or `toLocaleDateString()` with no locale argument (it uses the runtime's default, which on a server is usually `en-US`).
- A calendar grid that starts on Monday for every locale, or on Sunday for every locale.
- "Business days" computed as Monday–Friday for an Israeli or Gulf audience.
- Looping `for (m = 1; m <= 12; m++)` over Hebrew months.
- Hebrew dates rendered with Western digits (`1 תשרי 5787`) in a religious context where `א׳ בתשרי תשפ״ז` is expected, or the reverse in a civil context.
- Showing `IDT`/`IST` abbreviations: `IST` also means India and Irish Standard Time.

## Good references
- [MDN, Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) — `dateStyle`, `calendar`, `numberingSystem`, `formatRange`, `timeZone`.
- [MDN, Intl.Locale.prototype.getWeekInfo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo) — first day, weekend, minimal days, and the accessor-vs-method support history.
- [modern-web-guidance, support-global-calendar-systems.md](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/js/support-global-calendar-systems.md) — Temporal `withCalendar`, `monthCode`, `monthsInYear`, feature detection and the polyfill.
- [Unicode CLDR, territory and week data](https://www.unicode.org/cldr/charts/latest/supplemental/territory_information.html) — where the week data comes from.
- [Hebcal](https://www.hebcal.com/) — an established Hebrew calendar and holiday reference to check computed dates against.

## Bad references
- [MDN, `<input type="date">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date) — documents that the displayed format follows the browser's locale; teams that rely on it for a Hebrew or Arabic product ship `mm/dd/yyyy` to every user with an English browser.
- Server-rendered dates via `toLocaleDateString()` with no arguments (Node defaults to the process locale), a recurring source of `9/12/2026` in otherwise Hebrew emails.

## Accessibility
- Wrap dates in `<time datetime="2026-09-12">` so the machine value travels with the localised text.
- Screen readers read `12.9.2026` digit by digit in some voices; in prose prefer the long form (`12 בספטמבר 2026`).
- A calendar grid is a `grid` with column headers from `Intl.DateTimeFormat(locale, { weekday: "long" })` as accessible names; visible headers can be `narrow` (Hebrew narrow weekday for Saturday is `ש׳`).
- Arrow keys in a calendar grid follow the visual direction: in RTL, ArrowLeft moves to the *next* day.

## Motion / interaction (if relevant)
- In RTL the calendar grid mirrors (Material: "Days in a calendar appear from right to left"); "next month" is the left-pointing chevron.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Short date | `dateStyle: "short"` → `he-IL` `12.9.2026` | tables |
| Long date | `dateStyle: "long"` → `12 בספטמבר 2026` | prose, accessible names |
| Hebrew calendar | `-u-ca-hebrew` | holidays, religious contexts, alongside Gregorian |
| Hijri | `-u-ca-islamic-umalqura` (Saudi), user-selectable variants | Arabic markets |
| Week start | `getWeekInfo().firstDay`, user-overridable | calendar grids |
| Weekend | `getWeekInfo().weekend` | business-day maths, shading |
| Time zone | explicit `timeZone`, city label for shared data | all timestamps |

## Implementation sketch
```ts
type WeekInfo = { firstDay: number; weekend: number[]; minimalDays?: number };
type WeekInfoLocale = Intl.Locale & { getWeekInfo?: () => WeekInfo; weekInfo?: WeekInfo };

// Fallback for engines without week info (CLDR 48 values; extend as needed).
const FALLBACK: Record<string, WeekInfo> = {
  IL: { firstDay: 7, weekend: [5, 6] },
  SA: { firstDay: 7, weekend: [5, 6] },
  EG: { firstDay: 6, weekend: [5, 6] },
  AE: { firstDay: 1, weekend: [6, 7] },
  IR: { firstDay: 6, weekend: [5] },
  US: { firstDay: 7, weekend: [6, 7] },
};

export function weekInfo(tag: string): WeekInfo {
  const loc = new Intl.Locale(tag) as WeekInfoLocale;
  const info = loc.getWeekInfo?.() ?? loc.weekInfo;
  if (info) return info;
  const region = loc.maximize().region ?? "";
  return FALLBACK[region] ?? { firstDay: 1, weekend: [6, 7] };
}

/** Weekday headers in display order, long names for accessibility, narrow for display. */
export function weekdayHeaders(tag: string): { long: string; narrow: string }[] {
  const { firstDay } = weekInfo(tag);
  const long = new Intl.DateTimeFormat(tag, { weekday: "long", timeZone: "UTC" });
  const narrow = new Intl.DateTimeFormat(tag, { weekday: "narrow", timeZone: "UTC" });
  // 2026-11-16 is a Monday (ISO day 1)
  return Array.from({ length: 7 }, (_, i) => {
    const isoDay = ((firstDay - 1 + i) % 7) + 1;
    const d = new Date(Date.UTC(2026, 10, 15 + isoDay));
    return { long: long.format(d), narrow: narrow.format(d) };
  });
}

/** Add business days using the locale's weekend (holidays passed in as ISO dates). */
export function addBusinessDays(start: Date, days: number, tag: string, holidays: ReadonlySet<string>): Date {
  const { weekend } = weekInfo(tag);
  const d = new Date(start);
  let left = days;
  while (left > 0) {
    d.setUTCDate(d.getUTCDate() + 1);
    const isoDay = d.getUTCDay() === 0 ? 7 : d.getUTCDay();
    if (!weekend.includes(isoDay) && !holidays.has(d.toISOString().slice(0, 10))) left -= 1;
  }
  return d;
}

/** Civil date with the Hebrew date beside it, e.g. "12 בספטמבר 2026 · א׳ בתשרי תשפ״ז". */
export function civilAndHebrew(date: Date, timeZone = "Asia/Jerusalem"): string {
  const civil = new Intl.DateTimeFormat("he-IL", { dateStyle: "long", timeZone }).format(date);
  const hebrew = new Intl.DateTimeFormat("he-IL-u-ca-hebrew", { dateStyle: "long", timeZone }).format(date);
  return `${civil} · ${hebrew}`;
}
```
```ts
import type { Temporal } from "temporal-spec"; // or the global Temporal where shipped, or a polyfill

/** Purim (14 Adar, or 14 Adar II in a leap year) for a Hebrew year. */
export function purim(T: typeof Temporal, hebrewYear: number): Temporal.PlainDate {
  // In both leap and common years the month that holds Purim has monthCode "M06".
  return T.PlainDate.from({ calendar: "hebrew", year: hebrewYear, monthCode: "M06", day: 14 });
}
```

## Checklist
- [ ] No hand-built date strings; every format call passes a locale and a `timeZone`.
- [ ] Calendar grids start on the locale's first day, with a user override.
- [ ] Weekend shading and business-day maths use the locale's weekend.
- [ ] Hebrew dates (where shown) use `-u-ca-hebrew`, and month logic uses `monthCode` and `monthsInYear`.
- [ ] Hijri variant is explicit and documented.
- [ ] Native date inputs are paired with a page-locale echo, or replaced by a locale-aware picker.
- [ ] `<time datetime>` wraps displayed dates.

## Sources
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/js/support-global-calendar-systems.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/js/capture-location-agnostic-data.md
- https://www.unicode.org/cldr/charts/latest/supplemental/territory_information.html
- https://m1.material.io/usability/bidirectionality.html
- https://www.hebcal.com/
- dashboard-ui: `comp-date-range-picker.md`
- Local verification: Node v26.12 (ICU 78.3, CLDR 48) `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat`, `Intl.Locale#getWeekInfo` and Temporal outputs quoted above.
