# Sign-in, sign-up and passkeys

> Make authentication work with password managers and passkeys: real `<form>`s, `autocomplete="username webauthn"` / `current-password` / `new-password`, paste allowed, a show-password toggle, one-field OTPs, and passkeys offered through conditional UI (autofill) before any password.

**Category:** Flows · **Applies to:** sign-in, sign-up, password reset, two-step verification, passkey enrolment, re-authentication · **Priority:** must

## When to use / when not
- **Passkeys first** for new products and as an upgrade for existing ones: offer them in autofill on the sign-in field (conditional mediation) and prompt to create one after a successful password sign-in.
- **Password + second factor** remains the fallback; **email magic links or OTP** are fine for low-frequency products, but don't make SMS OTP the only factor for sensitive accounts.
- **Guest checkout**: don't force account creation before purchase. Baymard's abandonment survey lists "the site wanted me to create an account" for 17% of US shoppers who abandoned an order. Offer account creation after the order, using data already given.

## Rules (do)
- **Own `<form>`, own page or dialog**, with a `<h1>` "Sign in". Password managers detect forms by structure.
- **Identifier field**: `type="email"` (or text for usernames), `autocomplete="username webauthn"`, `autocapitalize="none"`, `spellcheck="false"`. Accept leading/trailing spaces and any case in email.
- **Passwords**:
  - `autocomplete="current-password"` on sign-in, `new-password` on sign-up and reset (lets the browser suggest a strong one).
  - Allow paste (WCAG 3.3.8, NCSC, NIST SP 800-63B).
  - A show/hide toggle: `<button type="button" aria-pressed>` named "Show password" (modern-web-guidance sign-in guide).
  - No composition rules (one capital, one symbol…). NIST SP 800-63B rev. 4 sets a minimum length (15 characters when the password is the only factor, 8 with MFA), a maximum of at least 64, no composition rules and a blocklist of breached/common passwords. Show the length requirement as a hint before typing.
  - No "confirm password" field; the toggle replaces it.
- **Two-step pages** (identifier first, then password or passkey) are fine if the password field still exists in the DOM for managers or the identifier is passed along (hidden `autocomplete="username"` field on step 2).
- **Passkeys (WebAuthn)**:
  - Conditional UI: on page load, if `PublicKeyCredential.isConditionalMediationAvailable()` is true, call `navigator.credentials.get({ mediation: 'conditional', publicKey })`; passkeys then appear in the username field's autofill list.
  - Also offer an explicit "Sign in with a passkey" button for devices without autofill support.
  - After a password sign-in, offer "Create a passkey" once, with a plain explanation ("Sign in with your fingerprint, face or screen lock"). Don't nag.
  - Manage passkeys in settings: list with names, created/last used, remove.
  - Microsoft reports passkey sign-ins succeeding about 98% of the time against about 32% for passwords, and being about 3× faster (2024); Google reports similar gains.
- **OTP**: one field, `inputmode="numeric"`, `autocomplete="one-time-code"`, hint above saying where the code went; WebOTP for SMS where supported; "Send a new code" after ~30–60 s, with the wait stated (modern-web-guidance SMS OTP guide).
- **Errors**: generic for credentials ("Email or password is incorrect"); clear the password, keep the email. Lockout and rate limits state when they can try again.
- **Password reset**: always say "If an account exists for that email, we've sent a link" (no account enumeration); links expire and are single-use.
- **No CAPTCHA puzzles** before sign-in (WCAG 3.3.8); use invisible risk checks, rate limits, honeypots.
- **"Keep me signed in"** is a checkbox, unchecked on shared-device contexts, and states the duration.

## Anti-patterns (don't)
- Blocking paste into password or OTP fields.
- `autocomplete="off"` on sign-in forms.
- Composition rules and forced periodic password changes (NIST advises against both).
- Six separate OTP boxes.
- Sign-in fields rendered without a `<form>` or with mismatched `name`s each release, so managers can't fill them.
- "Username not found" vs "Wrong password" (account enumeration).
- Mandatory account creation before checkout.

## Good references
- [web.dev — Sign-in form best practices](https://web.dev/articles/sign-in-form-best-practices) — structure, autocomplete, show-password, no doubled inputs.
- [web.dev — Passkey form autofill](https://web.dev/articles/passkey-form-autofill) — conditional mediation and `username webauthn`.
- [passkeys.dev](https://passkeys.dev/) — FIDO-backed implementation guidance, UX copy and device support.
- [NIST SP 800-63B](https://pages.nist.gov/800-63-4/sp800-63b.html) — length, no composition rules, paste allowed, breached-password checks.
- [modern-web-guidance — Autofill sign-in form](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/autofill-sign-in-form.md), [Autofill sign-up form](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/autofill-sign-up-form.md) and [SMS OTP form](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/sms-otp-form.md) — the same rules with fallbacks.
- [Microsoft Security blog — Passkeys and the passwordless future (2024)](https://www.microsoft.com/en-us/security/blog/2024/12/12/convincing-a-billion-users-to-love-passkeys-ux-design-insights-from-microsoft-to-boost-adoption-and-security/) — sign-in success and speed numbers and the UX lessons behind them.

## Bad references
- [NCSC — Let them paste passwords](https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords) — the paste-blocking practice it argues against.
- [Baymard — Cart abandonment rate statistics](https://baymard.com/lists/cart-abandonment-rate) — forced account creation as a leading checkout-abandonment reason.

## Accessibility
- WCAG 3.3.8 Accessible Authentication (Minimum, AA): no cognitive test without an alternative; paste and password managers count as the mechanism.
- Show-password toggle is a real button with `aria-pressed` and a clear name.
- OTP resend timers are announced once, not every second.
- Error and lockout messages in text, linked to the fields.

## Motion / interaction (if relevant)
- None beyond the busy submit button (`fflow-submit-buttons-and-double-submit.md`).

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Password min length | 15 single-factor / 8 with MFA (NIST rev. 4) | Hint + server check |
| Password max length | ≥ 64 | Server |
| OTP resend wait | 30–60s, stated | Verification |
| Identifier autocomplete | `username webauthn` | Sign-in |

## Implementation sketch
```html
<form action="/sign-in" method="post">
  <h1>Sign in</h1>
  <div class="field"><label for="email">Email address</label>
    <input id="email" name="email" type="email" autocomplete="username webauthn" autocapitalize="none" spellcheck="false" required></div>
  <div class="field"><label for="password">Password</label>
    <div class="affix-field"><input id="password" name="password" type="password" autocomplete="current-password" required>
      <button type="button" class="pw-toggle" aria-pressed="false" aria-controls="password">Show</button></div></div>
  <button type="submit" class="btn-primary">Sign in</button>
  <button type="button" class="btn-secondary" id="passkey-btn">Sign in with a passkey</button>
</form>
```
```ts
// Offer passkeys in the username field's autofill when the browser supports conditional UI.
export async function startConditionalPasskey(
  getOptions: () => Promise<PublicKeyCredentialRequestOptions>,
  verify: (cred: PublicKeyCredential) => Promise<void>,
  signal: AbortSignal,
): Promise<void> {
  if (typeof PublicKeyCredential === 'undefined' || !(await PublicKeyCredential.isConditionalMediationAvailable?.())) return
  const publicKey = await getOptions()
  const cred = await navigator.credentials.get({ mediation: 'conditional', publicKey, signal })
  if (cred instanceof PublicKeyCredential) await verify(cred)
}

export function wirePasswordToggle(btn: HTMLButtonElement, input: HTMLInputElement): void {
  btn.addEventListener('click', () => {
    const show = input.type === 'password'
    input.type = show ? 'text' : 'password'
    btn.setAttribute('aria-pressed', String(show))
    btn.textContent = show ? 'Hide' : 'Show'
  })
}
```

## Checklist
- [ ] Sign-in and sign-up are real forms with `username`/`current-password`/`new-password` tokens.
- [ ] Paste works; a show-password toggle exists; no confirm-password field.
- [ ] Password rules: length only, stated up front, checked against breached lists server-side.
- [ ] Passkeys are offered via conditional UI and an explicit button, and created after password sign-in.
- [ ] OTPs use one field with `one-time-code`.
- [ ] Credential and reset errors don't reveal whether an account exists.
- [ ] No CAPTCHA puzzles or forced account creation before checkout.

## Sources
- https://web.dev/articles/sign-in-form-best-practices
- https://web.dev/articles/sign-up-form-best-practices
- https://web.dev/articles/passkey-form-autofill
- https://passkeys.dev/
- https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredential/isConditionalMediationAvailable_static
- https://pages.nist.gov/800-63-4/sp800-63b.html
- https://www.ncsc.gov.uk/blog-post/let-them-paste-passwords
- https://www.microsoft.com/en-us/security/blog/2024/12/12/convincing-a-billion-users-to-love-passkeys-ux-design-insights-from-microsoft-to-boost-adoption-and-security/
- https://baymard.com/lists/cart-abandonment-rate
- https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/autofill-sign-in-form.md (Apache-2.0, paraphrased)
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/autofill-sign-up-form.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/sms-otp-form.md
