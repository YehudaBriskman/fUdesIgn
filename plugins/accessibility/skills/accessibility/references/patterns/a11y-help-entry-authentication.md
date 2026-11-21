# Consistent help, redundant entry and accessible authentication

> Put help (contact details, a contact form, a chat, a self-help link) in the same relative place on every page that has it (WCAG 3.2.6); never make people re-enter what they already gave in the same process (3.3.7); and never make logging in depend on remembering, transcribing or solving something without help (3.3.8).

**Category:** Build · **Applies to:** headers and footers, help widgets, checkout and multi-step flows, account and support flows, sign-in, 2FA, CAPTCHA · **Priority:** must

## When to use / when not
- **3.2.6** applies to sets of pages (sites, apps with several screens) that offer any help mechanism. A single page with no help mechanism has nothing to keep consistent.
- **3.3.7** applies within one process (a checkout, an application, an onboarding flow). Re-entering across sessions or for security (confirming a new password) is out of scope.
- **3.3.8** applies to every authentication step: password, OTP, security questions, CAPTCHA, 2FA.
- The form-level rules (autofill tokens, paste allowed, passkeys, one-field OTPs) are owned by forms-ui `fflow-authentication-and-passkeys.md` and `fflow-multi-step-and-save-progress.md`; this file covers the criteria across every UI type.

## Rules (do)
- **Consistent Help, 3.2.6 A:** if pages offer any of these, keep each in the same order relative to other page content on every page where it appears:
  - human contact details (phone, email, address, opening hours);
  - a human contact mechanism (contact form, chat with a person, messaging);
  - self-help (FAQ, help centre link);
  - a fully automated contact mechanism (chatbot).
  The criterion is about relative order, not pixel position, and doesn't require help on every page. Practical rule: one help slot in the header or footer, rendered by the shared layout.
- **Redundant Entry, 3.3.7 A:** information the user already entered or was given in the same process is either auto-populated or available to select ("Billing address same as delivery", a pick-list of earlier entries). Exceptions: re-entry is essential (a memory game), required for security (confirm new password is allowed, though forms-ui recommends show-password instead), or the earlier value is no longer valid.
- **Accessible Authentication (Minimum), 3.3.8 AA:** no step of authentication relies on a cognitive function test (remembering a password, transcribing a code, solving a puzzle, doing arithmetic) unless at least one of these is available:
  - an alternative method that isn't a cognitive test (passkey, magic link, OAuth/SSO, device approval);
  - a mechanism that helps (password managers can fill the field, paste works, the code can be copied from an SMS or authenticator autofill);
  - object recognition (pick the photos with a bus); AA allows it, AAA 3.3.9 does not;
  - recognition of non-text content the user provided (their own uploaded photo).
- **So, concretely:** `autocomplete="username"` / `current-password` / `one-time-code`; paste never blocked; no split OTP boxes that defeat paste; no "type the 3rd and 7th character of your password"; any CAPTCHA has a non-puzzle alternative (invisible risk scoring, an email link, or a support route).
- **Timeouts during authentication or a process:** warn before expiry and allow extending (2.2.1), and keep entered data (supports 3.3.7).

## Anti-patterns (don't)
- A help link in the header on the home page, the footer on product pages and missing from checkout's own layout, in a different order each time.
- A chat launcher that appears only on some pages and moves position between templates.
- Asking for the delivery address again on the payment step.
- "Re-enter your email" fields.
- Blocking paste in password or OTP fields.
- Text or image CAPTCHA as the only way in.
- Memorable-word character pickers ("enter letters 2, 5 and 8").

## Good references
- [W3C — Understanding 3.2.6 Consistent Help](https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html) — the four help mechanism types and the relative-order rule.
- [W3C — Understanding 3.3.7 Redundant Entry](https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html) — auto-populate or select, with the three exceptions.
- [W3C — Understanding 3.3.8 Accessible Authentication (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html) — what counts as a cognitive function test and the allowed mechanisms.
- [GOV.UK Design System — Contact a department or service team](https://design-system.service.gov.uk/patterns/contact-a-department-or-service-team/) — one consistent contact pattern across a service.
- [passkeys.dev](https://passkeys.dev/) — passwordless sign-in as the non-cognitive alternative.

## Bad references
- Banking sign-ins that ask for selected characters of a memorable word and disable paste: a 3.3.8 failure for anyone using a password manager.
- Checkout flows that clear the address when the user goes Back to change the delivery option.

## Accessibility
- These three criteria were added in 2.2 mainly for people with cognitive, learning and memory disabilities; test them by walking the flow with a password manager and by checking the help slot on every template.

## Motion / interaction (if relevant)
- A help launcher that animates in must not cover focused content (`a11y-keyboard-focus-order.md`, 2.4.11) and follows reduced motion.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Help slot | one shared layout region, same relative order | 3.2.6 |
| Autofill tokens | `username`, `current-password`, `new-password`, `one-time-code` | 3.3.8 |
| Paste | always allowed | 3.3.8 |
| "Same as" option | for repeated addresses or people | 3.3.7 |

## Implementation sketch
One help region rendered by the shared layout, so its order can't drift between templates.
```tsx
interface HelpLinks { phone?: string; contactUrl?: string; helpCentreUrl?: string }

export function HelpSlot({ phone, contactUrl, helpCentreUrl }: HelpLinks) {
  return (
    <nav aria-label="Help">
      <ul>
        {helpCentreUrl && <li><a href={helpCentreUrl}>Help centre</a></li>}
        {contactUrl && <li><a href={contactUrl}>Contact us</a></li>}
        {phone && <li><a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a></li>}
      </ul>
    </nav>
  )
}
```

## Checklist
- [ ] Help mechanisms appear in the same relative order on every template that has them.
- [ ] No step re-asks for data given earlier in the same process; "same as" or prefill exists.
- [ ] Sign-in works with a password manager: autofill tokens present, paste allowed.
- [ ] An authentication route exists with no memory, transcription or puzzle test (passkey, link, SSO).
- [ ] Any CAPTCHA has a non-puzzle alternative.
- [ ] Timeouts warn and allow extension without losing data.

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/consistent-help.html
- https://www.w3.org/WAI/WCAG22/Understanding/redundant-entry.html
- https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html
- https://design-system.service.gov.uk/patterns/contact-a-department-or-service-team/
- https://passkeys.dev/
