# Conservation of complexity (Tesler's law)

> Complexity cannot be removed, only moved: before each design choice, decide who carries it, and carry it in the product unless one of five named exceptions applies.

**Category:** Design-system foundations · **Applies to:** workflow step 2 ("decide who carries the complexity"); forms, onboarding, navigation, data entry, defaults, error recovery; any "simple to build vs simple to use" choice · **Priority:** must

## When to use / when not
- Use whenever two designs differ in where the work lands: a control that is cheap to build but makes the user count, remember, calculate or switch context, against one that costs engineering time and spares them.
- Do not use it as a reason to hide things. Moving complexity into the product only wins when the result is predictable, correctable and affordable (exceptions below).
- Dates are the worked example elsewhere; read them instead of re-deriving it here: dashboard-ui `comp-date-range-picker.md` and forms-ui `finput-dates-and-times.md`. This file is the general rule they instantiate.

## Rules (do)
- **State the rule in the design brief.** Per screen or flow, one line: "the user carries X; the system carries Y; it costs us Z." Record it in DESIGN.md under "Who carries the complexity?" and keep it from drifting (`dsref-governance-drift.md`). "The user carries everything" is a finding, not a plan.
- **Run the four-way audit on every flow.** Each hit is complexity pushed onto the user:
  1. *Counting*: steps, fields or clicks the system could have skipped. House default: flag a flow with more than 1 step beyond the minimum after defaults and prefill.
  2. *Remembering*: the user holds a value, rule or location from one screen to the next. NN/g's recognition-over-recall heuristic (#6) is the test.
  3. *Calculating*: the user converts, adds, or does date arithmetic.
  4. *Switching context*: the user leaves the flow to look something up (a coupon code, a postcode finder, a docs page) and may not come back.
- **Prefer cutting fields over cleverer fields.** Baymard's 2024 checkout benchmark averages 11.3 form fields where most sites need about 8. Remove, prefill or derive before you redesign.
- **Default to what most people want, show it, and let them change it.** A smart default is a visible value with a visible override, never a hidden assumption. NN/g lists presets such as "Tomorrow" among the ways to prevent slips.
- **Accept input the way people have it.** Take any case, spacing and pasted text; the system normalises. GOV.UK's address guidance says to accept and ignore unwanted characters in a postcode rather than reject it.
- **Echo every resolved guess.** If "tomorrow", "Smith, J." or a postcode becomes a concrete value, show it before commit.
- **Keep rare paths reachable.** Common path in the system, rare path one visible step away. Progressive disclosure is the mechanism; NN/g recommends two levels, with designs beyond two typically low in usability. Frequent options go on level 1.
- **Make a user-carried cost explicit.** If the user must carry something, say why in DESIGN.md and reduce it (a label, a worked example, a confirm step).

### When moving it to the system is NOT worth it
- **Cost**: a heuristic that takes months to build and serves a sliver of users loses to a clear manual control. Compare build cost with (users x frequency x seconds saved).
- **Ambiguity**: if the system cannot tell what the user means (`03/04` is March or April), ask once; do not guess silently. For memorable dates GOV.UK uses separate day, month and year fields.
- **Expert control**: power users need the raw control and a shortcut (NN/g heuristic #7). Keep an advanced path.
- **Irreversible guesses**: a wrong guess that sends money, deletes data or notifies people must be confirmed. One you can undo can be automatic.
- **Privacy and consent**: prefilling from contacts, location or history moves complexity using someone else's data. Ask in context, explain why, make "no thanks" free.

## Anti-patterns (don't)
- Choosing the control easiest to build: three dropdowns for a date, a bare phone box with a rejection message, a "contact us" for something the product could look up.
- Explaining instead of building: help text that tells users how to format a field the parser could accept in any format.
- Burying rare-but-needed controls so deep experts lose them (a third disclosure level; links reachable only from a sidebar).
- Simplifying the first screen by moving the work to the third (a short signup that ends in a 20-field profile).
- Moving complexity to docs, tours or tooltips, or to silent defaults (pre-ticked consent, a hidden currency): the user still carries it.

## Good references
- [Laws of UX: Tesler's law](https://lawsofux.com/teslers-law/): the rule, the takeaway to absorb as much inherent complexity as possible in design and development, and Tognazzini's counterpoint.
- [Larry Tesler: The law of conservation of complexity](https://www.nomodes.com/larry-tesler-consulting/complexity-law): his own wording, dated about 1984: "Every application has an inherent amount of irreducible complexity. The only question is: Who will have to deal with it - the user, the application developer, or the platform developer?"
- [Baymard: Checkout form fields](https://baymard.com/blog/checkout-flow-average-form-fields): a single full-name field (4% hesitated, against 42% of testers typing a full name into a split first-name field); hide Address line 2 and coupon fields; default billing to shipping; delay account creation to the confirmation step.
- [GOV.UK: Dates](https://design-system.service.gov.uk/patterns/dates/): three fields for memorable dates, fields matching the source for copied dates, approximate and relative dates allowed, a calendar only in named cases and never the only way in. Detail lives in the two date patterns.
- [GOV.UK: Addresses](https://design-system.service.gov.uk/patterns/addresses/): a postcode lookup that forgives case, spacing and punctuation, with a manual option (a textarea for international or not-found addresses) so the lookup never becomes a trap.
- [GOV.UK: Start using a service](https://design-system.service.gov.uk/patterns/start-using-a-service/): say what the service does, cost and time; do not list what users know from memory (their date of birth); ask eligibility questions inside the service, not on the start page.
- [NN/g: Progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/): a few key options first, the rest on request; the trigger must set clear expectations; frequent movement between levels is what hurts deep hierarchies.
- [NN/g: Slips](https://www.nngroup.com/articles/slips/): the designer is at fault for making errors easy; constraints (Southwest's calendar forces departure before return), defaults, forgiving formatting.
- [NN/g: 10 usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/): #5 error prevention, #6 recognition over recall, #7 flexibility and efficiency of use.

## Bad references
- A checkout with split first/last name fields (Baymard: 89% of benchmarked sites have more than one name field): the user decides how a name divides.
- A checkout that shows Address line 2 by default (75% of sites), a coupon box (35% of sites with promo fields) and a separate billing address (24%): users stop, leave to hunt for a coupon, or retype what the system has.
- A mobile app whose main routes sit behind a hamburger menu ([NN/g: Mobile navigation](https://www.nngroup.com/articles/mobile-navigation-patterns/)): hidden menus are the least discoverable pattern, so the user must remember pages exist. NN/g suggests more cross-section links; with 4 or 5 main sections, showing them all can make sense.

## Accessibility
- Complexity moved to the system must stay perceivable: an auto-resolved value is shown as text, announced (a polite live region for "Resolved to Fri 14 Nov"), and editable by keyboard.
- Do not make auto-advancing fields steal focus, and give any gesture or drag a single-pointer alternative (WCAG 2.2 2.5.1 Pointer Gestures, level A; 2.5.7 Dragging Movements, level AA).
- WCAG 2.2 3.3.7 Redundant Entry (level A): information already entered in the same process is auto-populated or selectable, except where re-entry is essential, needed for security, or the earlier value is no longer valid. Repeated entry is complexity pushed onto people with memory or motor limits.
- 3.3.8 Accessible Authentication (minimum, level AA) covers sign-in, not prefill: no step may depend on recalling or transcribing unless an alternative or a helper exists, so allow paste and password-manager autofill.
- Set `autocomplete` tokens on personal-data fields (1.3.5 Identify Input Purpose, level AA) so browsers can carry the entry.

## Motion / interaction (if relevant)
- Show a resolved guess at once; correction is one action. Any highlight is 100-150 ms (house default), none under reduced motion. Never auto-commit a guess after a timeout.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| `audit.extraSteps` | 1 (house default) | steps beyond the minimum, after defaults and prefill, before a flow is flagged |
| `disclosure.levels` | 2 (NN/g recommendation) | levels of progressive disclosure |
| `nav.visibleItems` | 4-5 (NN/g, mobile) | main destinations kept visible; more go to a menu plus cross-links |
| `form.fieldsBenchmark` | about 8 needed vs 11.3 average (Baymard 2024, US checkout) | target when pruning a checkout-style form |
| `input.resolvedEcho` | always | show the concrete value for any parsed or defaulted input |
| `override.clicks` | at most 1 (house default) | cost of changing a smart default |

## Implementation sketch
A complexity audit as a typed checklist, plus the shape of a smart default with a visible override. Strict TypeScript, no `any`.

```ts
type Burden = 'counting' | 'remembering' | 'calculating' | 'switching-context'
type Exception = 'cost' | 'ambiguity' | 'expert-control' | 'irreversible' | 'privacy'

type Finding = {
  step: string
  burden: Burden
  systemCouldCarry: boolean
  exception?: Exception // required when systemCouldCarry is true but we leave it with the user
  note: string
}

export function audit(findings: readonly Finding[]): { fix: Finding[]; accepted: Finding[]; invalid: Finding[] } {
  const fix: Finding[] = []
  const accepted: Finding[] = []
  const invalid: Finding[] = []
  for (const f of findings) {
    if (!f.systemCouldCarry) accepted.push(f)
    else if (f.exception === undefined) fix.push(f) // the user carries it for no reason: move it
    else if (f.note.trim() === '') invalid.push(f) // an exception with no recorded why
    else accepted.push(f)
  }
  return { fix, accepted, invalid }
}

// A smart default is a value, where it came from, and a way back.
type SmartDefault<T> = {
  value: T
  source: 'history' | 'locale' | 'derived' | 'preset'
  reversible: boolean
}

export function shouldAutoApply<T>(d: SmartDefault<T>, confidence: number): boolean {
  // Irreversible guesses are never applied silently; low confidence asks instead.
  return d.reversible && confidence >= 0.9 // 0.9 is a house default
}
```

```html
<!-- A default the user can see and change in one action. -->
<label for="ship">Delivery</label>
<select id="ship" name="ship">
  <option value="std" selected>Standard, Fri 14 Nov (free)</option>
  <option value="exp">Express, Wed 12 Nov</option>
</select>
<p id="ship-note" role="status">Chosen from your last order. Change it above.</p>
```

## Checklist
- [ ] The design brief names who carries the complexity, and the cost of moving it, for each key flow.
- [ ] Each flow was audited for counting, remembering, calculating and context switching, with every finding fixed or tied to a named exception.
- [ ] Fields were removed, prefilled or derived before any field was made cleverer.
- [ ] Every smart default or parsed input shows its resolved value and has a one-action override.
- [ ] No guess is applied silently when it is ambiguous, irreversible or uses personal data.
- [ ] An expert path (shortcut, raw control, manual fallback) still exists beside the automated one.
- [ ] Hidden complexity has a visible trigger and at most 2 levels; dates link to the two date patterns.

## Sources
- https://lawsofux.com/teslers-law/ , https://www.nomodes.com/larry-tesler-consulting/complexity-law , https://baymard.com/blog/checkout-flow-average-form-fields (all fetched 2026-11-22)
- The GOV.UK and NN/g pages linked under Good references (fetched).
- WCAG 2.2 Understanding pages for 2.5.1, 2.5.7, 3.3.7 and 3.3.8 (fetched from w3.org); 1.3.5 as cited by the GOV.UK addresses page.
- Repo: `plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/comp-date-range-picker.md`, `plugins/forms-ui/skills/forms-ui/references/patterns/finput-dates-and-times.md`, `plugins/design-system/skills/design-system/SKILL.md`.
- Where sources disagree: Laws of UX places Tesler's idea at Xerox PARC in the mid-1980s; Tesler's own page gives only "ca. 1984" and no place. The origin is unsettled here; quote the rule, not the story. Tognazzini's counterpoint, as Laws of UX relays it: people resist reduced complexity and attempt harder tasks once an application is simpler, so a simplified product may not look simpler in use. Baymard figures describe US checkouts, not all products.
