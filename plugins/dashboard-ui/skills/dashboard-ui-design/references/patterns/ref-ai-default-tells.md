# Tells of a generated dashboard

> A generated dashboard is recognisable by defaults nobody chose, in three layers: the look (the same card, radius, purple accent and fade-up everywhere), the content (menus and cards copied from other products instead of chosen for this user's question) and the structure (one page per prompt, complexity left to the user). Every choice must trace to the data, the domain, the design brief or a token; anything that would appear unchanged on any other dashboard needs a reason or goes.

**Category:** Reference gallery / anti-patterns · **Applies to:** any dashboard, admin home, KPI row or card grid built with an AI coding tool, a component kit or a template · **Priority:** should

## When to use / when not
- **Use** as a pass after the first build (and again at review), alongside `ref-dashboard-anti-patterns.md`. That file catches *data* failures (no context, gauges, rainbow palettes). This one catches *sameness*: the fingerprints of unchosen defaults.
- **Use** when a user says the result "looks AI-generated", "looks like a template" or "looks like every other SaaS".
- **Use all three layers.** Equalise colour and type between two screens and the generated one is still recognisable: by what its menus contain, by where it puts the work, and by how its pages connect. A visual-only pass misses most of it.
- **Don't** treat a tell as a bug in itself. Each is legitimate when the brief, the domain or the design system asks for it. The rule is "chosen, not defaulted".
- **Don't** fix sameness with novelty. Dashboards win on convention and learnability (see `found-dashboard-types.md`). The goal is fit, not surprise. A marketing-page instinct to "take aesthetic risks" is wrong for a daily-use operational tool.

## Rules (do)
- **Know why it happens.** A model copies what a component looks like, not why it exists. Models sample the high-probability centre of their training data. Anthropic names this *distributional convergence*: safe, universal choices dominate scraped web code, so an unguided model reaches for Inter, purple gradients and minimal motion. NN/g's 2025 study of AI prototyping tools found the same: without explicit visual specs, output shares "a similar, generic look" with sans-serif type, minimal styling and bright accents, and tools add elements nobody asked for.
- **Run the plan-compare-revise pass before building:**
  1. Write a 10-line plan: the design brief (why someone opens this view, how they use it, what they want to know next, what you will leave out; see the design-system plugin's step 2), the view's first question and focal point (see `found-scanning-kpi-pyramid.md`), the domain profile (see `found-domain-profiles.md`), the role tokens you'll use, an ASCII wireframe and the one place you'll spend visual emphasis.
  2. Compare it against what you would produce for "a dashboard" with no brief. Mark every line that is identical.
  3. For each identical line, either give a reason from the brief, domain or design system, or change it. Write down what changed.
  4. Build, screenshot in both themes, and run the table below on the screenshot.
- **Check each tell, layer by layer.** For each row, the "legit when" column is the only defence.

**Layer 1: visual**

| Tell | Why it appears | Legit when | Fix |
|---|---|---|---|
| **Identical rounded cards with the same soft shadow** around every region | Kit defaults: shadcn's `Card` ships `rounded-xl border shadow-sm py-6 gap-6` (12 px radius, 24 px padding) | The cards are true peers (a KPI row, small multiples) | Vary container by role: KPI tiles, flat chart regions separated by space or a hairline, tables full-bleed. See `style-shadows-and-borders.md`, `style-surfaces-and-layering.md` |
| **Nested cards** (card in a card in a card) | Each component wraps itself in `Card` | Never for layout; a bordered inset for a code block or quote is fine | One surface level per region; use spacing and headings inside. See `style-surfaces-and-layering.md` |
| **One radius everywhere** (12 px on chips, inputs, cards and dialogs) | A single `--radius` token applied to all | A deliberate brand rule | Use a scale: nested radius = outer − padding; chips and inputs smaller than cards. See `style-radius-scale.md` |
| **Purple-to-blue accent and gradients** | Tailwind UI's demo buttons used `bg-indigo-500`; its author later apologised that this turned AI output purple | The brand is indigo or violet | Derive the accent from the brand or domain. Keep gradients out of data surfaces. See `color-minimal-usage.md` |
| **Gradient text** on the hero number or title | Landing-page habit | Never on data | Solid `--text-strong`. Contrast over a gradient can't be measured reliably (WCAG 1.4.3 needs a worst-case pair) |
| **One-side accent stripe** (`border-left: 4px solid` on rounded cards) | A cheap "status" look | A real status with a text label, on a square-cornered row | Status as icon + text badge. See `color-semantic-status.md` |
| **Glow halos and coloured shadows** | "Premium" dark-mode recipe | A focus ring | Neutral elevation only; dark mode uses lighter surfaces, not glows. See `color-dark-mode.md` |
| **Tracked all-caps eyebrow over every panel** | Marketing section kickers | One level of small labels, consistently (table headers, a single KPI label style) | Sentence-case titles that say what the panel answers. Caps only for short labels, less than a line, with added tracking. See `found-typography-for-data.md` |
| **Middot meta strings** ("Revenue · Monthly · USD · Live") | Filling a subtitle slot | A real, short metadata line (period · freshness) | Put units in the label, period in the filter bar, freshness in one place. See `data-units-footnotes-sources.md`, `data-timestamps-freshness.md` |
| **"→" on every link** and "View all →" in every card footer | Template card footer | One primary drill link per card | Link the title or the value; drop decorative arrows. See `comp-button-hierarchy.md` |
| **Emoji and sparkle icons** (✨ for AI, 💰 next to revenue) | Fastest way to fill an icon slot | Never in product chrome | One icon family, one stroke width, icons only where they aid recognition. See `data-kpi-stat-card.md` (no decorative icons) |
| **Monospace as costume** (mono labels, mono headings to look "technical") | Dev-tool aesthetic | IDs, hashes, code, fixed-width columns | Proportional UI font with `tabular-nums` for numbers. See `found-typography-for-data.md` |
| **A sparkline on every card** whether or not the trend matters | The kit's stat card has one | The trend answers the card's question | Sparkline only with the same window as the delta, or none. See `chart-sparklines-micro.md` |
| **Fade-up entrance on every widget**, often staggered | Scroll-reveal habit; one prompt-level instruction "add subtle animations" | One orchestrated first load on a rarely visited strategic view | No entrance motion on data. Animate change, not arrival. See `motion-principles-and-tokens.md` |
| **Fake precision** ("$1,284,392.17", "99.27% uptime" from mock data) | Random number generators produce many digits | The unit is cents and the reader reconciles | 2–3 significant figures for magnitudes. See `data-number-formatting.md` |
| **Placeholder metrics** ("Total Revenue $45,231.89 +20.1% from last month", "Lorem ipsum") | Copied from kit demos | Never shipped | Real metric names, real periods, worst-case data. See `found-worst-case-data.md`, `found-microcopy-for-data.md` |
| **Unrequested extras** (a progress ring, an "AI insights" card, a welcome banner) | Broad prompts invite filler | The user asked for it | Delete anything that answers no question on the plan. See `ref-dashboard-anti-patterns.md` AP1, AP2 |

**Layer 2: content and purpose.** The parts were copied; the reason for them wasn't.

| Tell | Why it appears | Legit when | Fix |
|---|---|---|---|
| **Copied menu contents**: an account popover that leads with the user's email, plus Help and Settings already one click away in the shell | Reproducing a well-known product's menu | Several signed-in accounts, where the email tells them apart (multi-account mail clients) | Fill it with what the user asks *here*: in a task tracker, presence or away status, notifications, workspace switch. Drop items duplicated elsewhere. See `comp-overlay-choice.md` |
| **An affordance whose reason no longer applies**: a down chevron on a menu that opens upward from the sidebar foot | The component was copied with its icon | Never; the arrow is a promise about where content appears | Point the chevron where the content opens. See `comp-overlay-choice.md` |
| **Pattern cargo-culting**: a card grid, a stat strip or a hero chart because "dashboards have them" | The parts survive; the reason they existed in the source doesn't | The reason holds here, and you can write it down | For each borrowed pattern, write its source's reason and check it applies (design brief) |
| **Previews that dump the whole record**, or no previews at all | Rendering the entity model, not the user's question | The record has 3–5 fields | Show the 3–5 fields that matter from the current context. See `comp-entity-links-and-hover-previews.md` |
| **Explaining instead of building**: a welcome deck of slides that describes features | "Onboarding" read as "tutorial" | Never on first load | Ask 1–3 questions, then create the first real object with the real UI. See `comp-onboarding-and-notices.md` |

**Layer 3: structure and flow.** Where the work lands and how pages connect.

| Tell | Why it appears | Legit when | Fix |
|---|---|---|---|
| **Every prompt became a page**: pages reachable only from the sidebar, never from each other; a two-entity question takes four clicks | Each feature was generated in its own prompt | A genuinely flat tool with no related records | Link every named entity to its detail route, both ways. See `comp-entity-links-and-hover-previews.md` |
| **Complexity pushed onto the user**: three dropdowns for a date, raw IDs to copy between screens, a form that asks for what the system already knows | Simplest to build | The value truly can't be inferred, parsed or defaulted | Tesler's law: some complexity can't be removed, only moved, so the system carries it. See `comp-date-range-picker.md` |
| **Hover-only information**: details reachable only by mouse hover | Desktop-first generation | Never as the only path | Same content on focus and through a tap or peek control. See `comp-entity-links-and-hover-previews.md` |
| **Modal on first load** (tour, "what's new", feature deck) before the user has seen any value | Template first-run flows | A hard requirement (terms acceptance) | In-flow notices and empty states that teach the next action. See `comp-onboarding-and-notices.md` |

- **Spend boldness once.** Pick one place to carry the identity (the focal KPI, the brand accent on the one primary action, a distinctive chart treatment). Everything else stays quiet.
- **Ground identity in the domain.** A trading view reads like a terminal because of density and alignment, not a mono font on every label. A clinical view reads calm because of whitespace and restraint, not pastel gradients.
- **Keep the quality floor silent.** Responsive reflow, focus rings, reduced motion, both themes and states are non-negotiable and invisible when done. They don't need a "polished" look.

## Anti-patterns (don't)
- Treating "looks AI-generated" as a purely visual problem: changing the font and accent while the copied menus, the one-page-per-prompt structure and the three-dropdown date stay.
- Building before the design brief exists. An opinion-less brief produces the average dashboard, however good the tokens.
- "Fixing" a generic look by swapping in a different trendy default (another fashionable display font, another accent). Anthropic's own write-up notes models converge on *new* defaults once old ones are banned.
- Treating a **KPI row with context** as the "hero metric template" tell. A labelled value with a delta against a named period and a unit is a real KPI (see `data-kpi-stat-card.md`). The tell is a big number *without* context, or one repeated as decoration.
- Removing all cards, radius and shadows to look "not AI". Flat everything loses grouping; convention exists for a reason.
- Shipping the kit's sample copy, sample deltas or sample chart data.
- Adding a style because the screenshot "looked empty". Empty space around a focal number is the point.

## Good references
- [Laws of UX, Tesler's Law](https://lawsofux.com/teslers-law/) — the law of conservation of complexity from Larry Tesler (Xerox PARC, later Apple): some complexity can't be reduced, only moved. The layer 3 test for where a design puts the work.
- [MediaWiki, Page Previews](https://www.mediawiki.org/wiki/Page_Previews) — the opposite of "every prompt became a page": linked entities with a quick preview, so readers move article to article without a menu.
- [Anthropic, Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills) — explains distributional convergence and why unguided output lands on Inter, purple gradients and minimal motion. Recommends naming the defaults to avoid and warns about converging on new ones.
- [Anthropic Cookbook, Prompting for frontend aesthetics](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics) — the idea source for the plan-then-revise pass: steer specific design dimensions and call out unwanted defaults.
- [NN/g, Good from Afar, But Far from Good: AI Prototyping in Real Design Contexts](https://www.nngroup.com/articles/ai-prototyping/) — generic look with sans-serif and minimal styling without visual specs; elements added that the prompt never asked for.
- [Butterick's Practical Typography, All caps](https://practicaltypography.com/all-caps.html) — caps for short labels under a line, always letterspaced. A good test for whether an eyebrow is earned.
- [Stripe Dashboard teardown (925studios)](https://www.925studios.co/blog/stripe-dashboard-design-breakdown) — restraint: few metrics, monochrome trends, colour reserved for status. Distinctive without decoration.

## Bad references
- [NN/g, Mobile Tutorials: Wasted Effort or Efficiency Boost?](https://www.nngroup.com/articles/mobile-tutorials/) — the deck-of-cards tutorial, a layer 2 tell: in a 70-person study it did not improve task success and made tasks feel harder.
- [prg.sh, Why your AI keeps building the same purple gradient website](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website) — documents the cause: Tailwind UI's `bg-indigo-500` demo buttons were copied widely and became the statistical default.
- [shadcn/ui dashboard-01 section cards](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/blocks/dashboard-01/components/section-cards.tsx) — a fine skeleton whose demo copy, uniform cards and footer prose ship unchanged in many generated dashboards.
- [shadcn/ui `Card`](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/card.tsx) — `rounded-xl border shadow-sm` on every instance. Good component, bad when it wraps every region on the page.

## Accessibility
- Gradient text and text over gradients often fail 4.5:1 at one end. Test the worst-case pixel pair, or use a solid colour.
- Emoji icons are read aloud by name ("money bag"). If an icon stays, give it `aria-hidden="true"` and keep the text label.
- All-caps via CSS (`text-transform`) keeps the source in sentence case for screen readers; never type caps into the source.
- Entrance animations delay the moment content is readable and can trigger vestibular symptoms; remove them rather than gating them (see `motion-reduced-motion.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Tell budget | 0 unexplained tells per view | review gate |
| Emphasis budget | 1 focal element per view | where boldness is spent |
| Card radius vs inner radius | inner = outer − padding | avoids one-radius look |
| Entrance motion on data | 0ms | animate change, not arrival |
| Eyebrow / caps labels | ≤ 1 level, < 1 line, +0.04em tracking | when caps are used at all |
| Precision (magnitudes) | 2–3 significant figures | no fake precision |
| Icon families | 1, one stroke width | no emoji |

## Implementation sketch
A small dev-time detector for the most mechanical tells, run on the rendered page (for example from Playwright `page.evaluate`):
```ts
type Tell = { id: string; el: Element; detail: string }

const EMOJI = /\p{Extended_Pictographic}/u

export function findTells(root: ParentNode = document): Tell[] {
  const tells: Tell[] = []
  const all = Array.from(root.querySelectorAll<HTMLElement>('body *'))
  const radii = new Map<string, number>()
  for (const el of all) {
    const cs = getComputedStyle(el)
    if (cs.backgroundClip === 'text' || cs.webkitBackgroundClip === 'text')
      tells.push({ id: 'gradient-text', el, detail: cs.backgroundImage })
    if (cs.borderLeftWidth !== '0px' && parseFloat(cs.borderLeftWidth) >= 3 && cs.borderTopWidth === '0px' && cs.borderTopLeftRadius !== '0px')
      tells.push({ id: 'accent-stripe', el, detail: cs.borderLeftColor })
    if (/rgba?\((?!0, 0, 0)/.test(cs.boxShadow) && cs.boxShadow !== 'none')
      tells.push({ id: 'coloured-shadow', el, detail: cs.boxShadow })
    if (cs.textTransform === 'uppercase' && (el.textContent ?? '').length > 40)
      tells.push({ id: 'long-caps', el, detail: el.textContent ?? '' })
    const own = Array.from(el.childNodes).filter((n) => n.nodeType === Node.TEXT_NODE).map((n) => n.textContent ?? '').join('')
    if (EMOJI.test(own)) tells.push({ id: 'emoji-icon', el, detail: own.trim() })
    if (cs.borderTopLeftRadius !== '0px') radii.set(cs.borderTopLeftRadius, (radii.get(cs.borderTopLeftRadius) ?? 0) + 1)
    if (el.matches('[data-slot="card"] [data-slot="card"]')) tells.push({ id: 'nested-card', el, detail: 'card inside card' })
  }
  if (radii.size === 1 && all.length > 50) tells.push({ id: 'one-radius', el: document.body, detail: [...radii.keys()].join() })
  return tells
}
```
```css
/* Role-based containers instead of one Card everywhere */
.region-chart { padding-block: 16px; border-block-start: 1px solid var(--border-subtle); background: none; box-shadow: none; }
.kpi { border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); box-shadow: none; }
.kpi .chip { border-radius: var(--radius-sm); }
.panel-title { font-size: .9375rem; font-weight: 600; text-transform: none; letter-spacing: 0; }
```

## Checklist
- [ ] The plan-compare-revise pass was written down, with what changed and why.
- [ ] No row of the tells table is present without a reason from the brief, domain or design system.
- [ ] Containers vary by role; no nested cards; radii follow a scale.
- [ ] Accent comes from the brand or domain, not a kit default; no gradients or glows on data surfaces.
- [ ] No emoji icons, no mono-as-costume, caps labels at most one short level.
- [ ] No entrance animation on data widgets; no sparkline without a matching window.
- [ ] No placeholder copy, fake precision or unrequested extras remain.
- [ ] A design brief (why, how, what next, what is left out) was written first, and each borrowed pattern names a reason that holds here.
- [ ] Layer 2: menus and popovers hold what the user asks in this context; chevrons point where content opens; previews show 3–5 context fields.
- [ ] Layer 3: named entities link to each other; no three-dropdown dates or other work the system could carry; no hover-only information; no first-load modal.

## Sources
- https://claude.com/blog/improving-frontend-design-through-skills
- https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics
- https://www.nngroup.com/articles/ai-prototyping/
- https://www.nngroup.com/articles/ai-design-tools-update-2/
- https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website
- https://practicaltypography.com/all-caps.html
- https://lawsofux.com/teslers-law/ (Tesler's law, the law of conservation of complexity)
- https://www.nngroup.com/articles/mobile-tutorials/ (Kendrick, 2020)
- https://www.mediawiki.org/wiki/Page_Previews
- https://www.925studios.co/blog/stripe-dashboard-design-breakdown
- https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/card.tsx
- https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/blocks/dashboard-01/components/section-cards.tsx
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- Idea source (not copied): Anthropic `frontend-design` plugin, Apache-2.0, generated-design tells and UX-writing guidance
