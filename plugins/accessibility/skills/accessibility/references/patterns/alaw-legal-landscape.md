# The legal landscape: EAA, ADA Title II, Section 508, EN 301 549, Israel

> Build to WCAG 2.2 AA, which meets or exceeds the web technical standard of every regime below (EU EAA via EN 301 549, US ADA Title II at WCAG 2.1 AA, US Section 508 at WCAG 2.0 AA, Israel's regulation 35 at IS 5568 level AA), then handle what each law adds beyond WCAG: dates, scope, exemptions, statements and complaint routes, checked against the primary text, not vendor blogs.

**Category:** Law and statements · **Applies to:** product and compliance planning, EU/US/Israeli launches, procurement (VPAT/ACR), accessibility statements · **Priority:** should

## When to use / when not
- **Use** to know which regime applies and what it requires beyond conformance, and to word accessibility statements and procurement answers.
- **Not legal advice.** Dates and scope below were read from the primary sources listed in November 2026; laws change. Ask counsel for coverage questions.
- **Israel's teardown of real Hebrew sites and the overlay case** lives in i18n-rtl `iref-hebrew-sites-and-israeli-accessibility.md`; this file adds the regulation text.

## Rules (do)
- **One technical target:** WCAG 2.2 AA (`a11y-wcag22-aa-map.md`). Every regime here cites WCAG 2.0, 2.1 or 2.2 at AA; 2.2 AA satisfies all three except for 4.1.1 Parsing, which 2.2 dropped as obsolete and modern browsers make moot.

| Regime | Who | Technical standard | Key dates (primary source) |
|---|---|---|---|
| **EU European Accessibility Act**, Directive (EU) 2019/882 | Listed products and consumer services in the EU: e-commerce, banking, e-books, transport ticketing, electronic communications, computers, phones, self-service terminals | Presumption of conformity through harmonised standards in the Official Journal (Art. 15): EN 301 549 | Member states apply measures from **28 June 2025** (Art. 31(2)). Transitional period to **28 June 2030** for services using products already in use; existing service contracts run unchanged until they expire, at most 5 years (Art. 32(1)). Self-service terminals in use before then: until end of life, max 20 years (Art. 32(2)) |
| **US ADA Title II rule**, 28 CFR part 35 subpart H | State and local governments' web content and mobile apps | WCAG 2.1 AA | 2024 rule set **24 April 2026** (population ≥ 50,000) and **26 April 2027** (smaller entities, special districts). An interim final rule of **20 April 2026** (91 FR 20902) moved them to **26 April 2027** and **26 April 2028** |
| **US Section 508**, Revised 508 Standards (36 CFR 1194) | US federal agencies' ICT, and what they procure | WCAG 2.0 A and AA (E205.4, E207.2) | Final rule 18 January 2017 (82 FR 5832); ICT not altered after 18 January 2018 keeps the legacy safe harbour |
| **EN 301 549** | EU public sector (Web Accessibility Directive) and the EAA's route to conformity | V3.2.1 (2021) embeds WCAG 2.1 AA; **V4.1.1 published 2 September 2026** moves to WCAG 2.2 and maps clauses to the EAA | Check the Official Journal for which version is cited as harmonised before relying on V4.1.1 |
| **Israel**, Equal Rights for Persons with Disabilities Law 1998 and the Service Accessibility Adjustments Regulations 5773-2013, regs 35–35ו | Anyone providing a service to the public through a website, documents or app | IS 5568 ("Web content accessibility guidelines") at **level AA** (reg. 35א(a)) | In force; see the obligations below |

- **EAA, beyond WCAG:**
  - Service providers publish information on how the service meets the requirements (Art. 13(2), Annex V), in accessible written and oral form, for as long as the service runs. Treat it as an accessibility statement (`alaw-accessibility-statement.md`).
  - Microenterprises **providing services** are exempt (Art. 4(5)); a microenterprise employs fewer than 10 people and has turnover or balance sheet ≤ €2 million (Art. 3(23)).
  - Fundamental alteration or disproportionate burden (Art. 14) must be assessed, documented and kept for five years; it is not a blanket opt-out.
- **ADA, beyond WCAG:** the Title II rule covers web content and mobile apps of public entities, with listed exceptions (archived content, preexisting documents, some third-party content). Private businesses fall under Title III, which has no web regulation; US courts and DOJ guidance commonly point to WCAG.
- **Section 508, beyond WCAG:** applies WCAG to non-web documents and software too, and drives the Accessibility Conformance Report (ACR, written on the VPAT template) that agencies ask vendors for.
- **Israel, from the regulation text:**
  - reg. 35א(a): accessibility adjustments in internet services per IS 5568 at level AA;
  - reg. 35א(c): documents (such as PDFs) prepared from 26 October 2017 must be accessible per the standard's document provisions (IS 5568 Part 2 covers digital documents);
  - reg. 35א(d): a deviation is not a breach unless the provider was notified and didn't fix it within a reasonable time, at most **60 days**, providing an accessible alternative meanwhile;
  - reg. 35ג: apps follow an Israeli app standard if one exists, otherwise the web standard's success criteria as far as relevant, on at least **two common operating systems**;
  - reg. 35ה: a prominent **accessibility statement** on the site and app (contents in `alaw-accessibility-statement.md`);
  - reg. 35ו: exemptions include exempt dealers or average annual turnover ≤ ₪100,000; registered-users-only services with at most 500 participants (until someone asks); limits of social-network platforms; and platform exemptions granted by a service accessibility officer for up to 3 years, which must be disclosed in the statement;
  - IS 5568's WCAG basis: Part 1 (websites) is widely reported as WCAG 2.0 AA with Israeli additions; the Standards Institution page lists Part 1 and Part 2 with 28 September 2023 dates but doesn't name the WCAG version, so read the standard before quoting it. WCAG 2.2 AA meets either reading.
- **Overlays don't create compliance** in any of these regimes (`aref-anti-patterns.md`).

## Anti-patterns (don't)
- Quoting "ADA deadline April 2026" after the April 2026 interim final rule moved it.
- Claiming EAA compliance from a WCAG 2.1 checklist without the Annex V service information.
- Assuming the EAA exempts all small businesses (only microenterprises providing services).
- Israeli statements that say "the site is accessible per WCAG 2.0" with no level, date, coordinator or contact route.
- Buying an overlay to "meet IS 5568".

## Good references
- [EUR-Lex — Directive (EU) 2019/882 (EAA)](https://eur-lex.europa.eu/eli/dir/2019/882/oj/eng) — Articles 2, 3(23), 4(5), 13, 14, 15, 31, 32 and Annex V.
- [ADA.gov — Fact sheet: State and local government web and mobile app rule](https://www.ada.gov/resources/2024-03-08-web-rule/) — WCAG 2.1 AA, scope, exceptions, current dates.
- [Federal Register — Extension of compliance dates (91 FR 20902, 20 April 2026)](https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web) — the one-year extension.
- [US Access Board — Revised 508 Standards](https://www.access-board.gov/ict/) — E205.4 and E207.2 incorporate WCAG 2.0 AA.
- [ETSI — EN 301 549 versions](https://www.etsi.org/deliver/etsi_en/301500_301599/301549/) — V3.2.1 (2021) and V4.1.1 (2 September 2026).
- [Service Accessibility Adjustments Regulations 2013, consolidated text (National Insurance Institute, gov.il)](https://www.btl.gov.il/Laws1/02_0041_100100.pdf) — regulations 35–35ו on internet services.
- [Standards Institution of Israel — IS 5568 Part 1](https://www.sii.org.il/he/lobby/standardization/standard-page?id=6751) and [Part 2](https://www.sii.org.il/he/lobby/standardization/standard-page?id=6753).

## Bad references
- Overlay vendor pages that promise ADA, EAA or IS 5568 compliance from a script tag (see i18n-rtl `iref-hebrew-sites-and-israeli-accessibility.md` for the FTC order against one such vendor).
- Blog posts still listing the pre-2026 ADA Title II dates.

## Accessibility
- The law's purpose is the same as WCAG's; the extra obligations (statements, feedback routes, response times) are about letting disabled users report and get fixes.

## Motion / interaction (if relevant)
- Not applicable.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Technical target | WCAG 2.2 AA | All regimes |
| EAA application | 28 June 2025; transition to 28 June 2030 | EU |
| ADA Title II (current) | 26 April 2027 / 26 April 2028 | US public entities |
| Section 508 | WCAG 2.0 AA | US federal |
| EN 301 549 | V3.2.1 (WCAG 2.1); V4.1.1 (WCAG 2.2, 2 Sep 2026) | EU |
| Israel | IS 5568 level AA; fix within 60 days of notice | Reg. 35א |

## Implementation sketch
A typed register so a product can record which regimes apply and what each adds.
```ts
type Regime = 'EAA' | 'ADA-II' | 'Section508' | 'EN301549' | 'IL-Reg35'

interface Obligation { regime: Regime; standard: string; statement: boolean; dueDate?: string; extra: readonly string[] }

export const OBLIGATIONS: readonly Obligation[] = [
  { regime: 'EAA', standard: 'EN 301 549 (WCAG 2.1 AA in V3.2.1; 2.2 in V4.1.1)', statement: true, dueDate: '2025-06-28',
    extra: ['Annex V service information', 'Art. 14 burden assessment kept 5 years'] },
  { regime: 'ADA-II', standard: 'WCAG 2.1 AA', statement: false, dueDate: '2027-04-26', extra: ['Mobile apps in scope'] },
  { regime: 'Section508', standard: 'WCAG 2.0 AA', statement: false, extra: ['ACR on the VPAT template for procurement'] },
  { regime: 'IL-Reg35', standard: 'IS 5568 level AA', statement: true,
    extra: ['Accessibility statement (reg. 35ה)', 'Fix within 60 days of notice (reg. 35א(d))', 'Apps on 2 common OSes (reg. 35ג)'] },
]

export const needsStatement = (applies: readonly Regime[]): boolean =>
  OBLIGATIONS.some((o) => applies.includes(o.regime) && o.statement)
```

## Checklist
- [ ] The regimes that apply (by market, sector and customer type) are recorded.
- [ ] The build target is WCAG 2.2 AA.
- [ ] Dates quoted match the current primary source (ADA dates moved in April 2026).
- [ ] EAA services publish Annex V information; any burden claim is documented.
- [ ] Israeli services publish a statement and can fix reported issues within 60 days.
- [ ] Procurement answers use an ACR with the WCAG and EN 301 549 tables.

## Sources
- https://eur-lex.europa.eu/eli/dir/2019/882/oj/eng (Arts. 2, 3(23), 4(5), 13(2), 14, 15(1), 31(2), 32; read November 2026)
- https://www.ada.gov/resources/2024-03-08-web-rule/
- https://www.govinfo.gov/content/pkg/FR-2026-04-20/html/2026-07663.htm (91 FR 20902; original and new dates in 28 CFR 35.200(b))
- https://www.access-board.gov/ict/ (E205.4, E207.2; 82 FR 5832)
- https://www.etsi.org/deliver/etsi_en/301500_301599/301549/ (version listing: 03.02.01_60 on 19 March 2021, 04.01.01_60 on 2 September 2026)
- https://www.btl.gov.il/Laws1/02_0041_100100.pdf (consolidated regulations, regs. 35–35ו, read in Hebrew)
- https://www.sii.org.il/he/lobby/standardization/standard-page?id=6751
- https://www.sii.org.il/he/lobby/standardization/standard-page?id=6753
