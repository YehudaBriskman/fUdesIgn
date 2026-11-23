# PWA: install, offline and the app-like shell

> Make the site installable with a complete manifest, offer install only at a moment of value through the browser's own mechanism, cache an app shell and an offline fallback with a service worker, and design an honest offline state instead of a browser error page.

**Category:** Platform · **Applies to:** web apps used repeatedly (tools, inboxes, trackers, shops with accounts), installed PWAs on Android, iOS and desktop · **Priority:** should

## When to use / when not
- **Use** for apps people return to weekly or more and that benefit from a home-screen icon, standalone display, offline reading or push; installed-app expectations (back, sheets, text scale) are in `moplat-native-feel-hig-material.md`.
- **Not** for one-visit sites (a campaign page, a single article): no install prompts there.
- **Not** a reason to block the web experience. Installation and standalone display are enhancements; everything works in a tab (modern-web-guidance `pwa/install-web-app.md`).

## Rules (do)
- **Manifest** (linked with `<link rel="manifest">`): `id` (stable), `name`, `short_name` (under 12 characters for the home-screen label, web.dev's recommendation to avoid truncation), `start_url`, `scope`, `display: "standalone"`, `background_color`, `theme_color`, and icons at 192×192 and 512×512 PNG plus a `"purpose": "maskable"` icon with its content inside the central 80% safe zone. Add `screenshots` and `description` for the richer install dialog on Android and desktop Chrome.
- **iOS specifics:** Safari reads the manifest (iOS 15.4+) but also uses `<link rel="apple-touch-icon" href="/icons/180.png">` (180×180). Install is user-initiated via Share → Add to Home Screen; there is no install event on iOS. Since iOS 16.4, home-screen web apps can receive Web Push after the user grants permission from a gesture.
- **Install offer:**
  - Chromium: capture `beforeinstallprompt`, prevent the mini-infobar, reveal your own "Install app" button only after the event fires, and call `prompt()` from a click. The event is single-use.
  - The newer Web Install API (`<install>` element, `navigator.install()`) is not natively supported by any major browser yet; feature-detect it and fall back to `beforeinstallprompt`.
  - iOS: show a short, dismissible hint ("Add to Home Screen from the Share menu") only after a meaningful action and only in Safari, never as a modal on first visit.
  - Ask at a moment of value (after the second visit, after saving something), never on landing; remember a dismissal for weeks.
- **Service worker:** precache the app shell (HTML skeleton, CSS, core JS, fonts, icons) and an offline page; network-first for HTML and API data with a cached fallback; cache-first (stale-while-revalidate) for versioned static assets. Version caches and delete old ones on `activate`.
- **Offline UX:** detect failures per request, not with `navigator.onLine` alone (it only reports a network interface, not reachability). Show cached content with "Offline · last updated 10:42", disable or queue actions that need the network, and say which ones were queued. Retry on reconnect (Background Sync in Chromium; a retry on `online` and on next launch elsewhere).
- **Storage:** request `navigator.storage.persist()` for apps with user data; Safari deletes script-writable storage for sites not used for 7 days of browser use, *except* for home-screen web apps.
- **Standalone shell:** `@media (display-mode: standalone)` adds what the browser chrome provided: a back button in the top bar where there is no system back (iOS), a share action, and safe-area padding (`mofound-safe-areas.md`). Keep URLs real so links and sharing work.
- **Updates:** when a new service worker is waiting, show a non-blocking "Update available · Reload" toast; never reload under the user.

## Anti-patterns (don't)
- An install modal on the first page view.
- A fake "Install" button shown in Safari or Firefox that does nothing.
- An offline dinosaur because only API calls were cached and the HTML was not.
- Caching HTML cache-first forever, so users never get updates.
- A standalone app with no back button on iOS, trapping users on deep pages.
- Push permission requested on load.

## Good references
- [web.dev: Learn PWA](https://web.dev/learn/pwa/): manifest, service worker caching strategies, offline, installation and updates.
- [MDN: Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable): manifest requirements per browser.
- [modern-web-guidance: Installing web applications](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/pwa/install-web-app.md): `<install>`, `navigator.install()`, the `beforeinstallprompt` fallback and support status.
- [WebKit: Web Push for Web Apps on iOS and iPadOS](https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/): iOS 16.4 home-screen web apps, push and badging.
- [WebKit: Full Third-Party Cookie Blocking and More](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/): the 7-day script-writable storage cap and the home-screen exemption.
- [web.dev: Maskable icons](https://web.dev/articles/maskable-icon): the 80% safe zone.

## Bad references
- [web.dev: Patterns for promoting PWA installation](https://web.dev/articles/promote-install): its "don't" examples (prompting on load, covering content) are the common failures.
- News sites that show both their own install banner and a cookie banner on first load, covering more than half the screen.

## Accessibility
- The install button is a real `<button>` hidden until available; result messages go to a `role="status"` region.
- Offline and update notices are announced politely and stay until dismissed or resolved.
- Standalone mode must keep visible focus, text scaling and zoom; do not add `user-scalable=no` because "it is an app".

## Motion / interaction (if relevant)
- Launch shows the manifest's splash (`background_color` + icon) and then the cached shell immediately; skeletons only for data (dashboard-ui `prog-perceived-performance-thresholds.md`).
- View Transitions between screens in standalone mode, guarded by `prefers-reduced-motion`.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| icons | 192, 512 PNG + 512 maskable; 180 apple-touch-icon | install surfaces |
| maskable safe zone | central 80% (radius 40% of size) | icon content |
| `short_name` | < 12 characters | home-screen label (web.dev) |
| install ask | after a value moment, second visit or later | timing |
| dismissal memory | 30+ days | do not re-ask |
| Safari storage cap | 7 days without use (not for home-screen apps) | persistence |

## Implementation sketch
```ts
// Install button: Web Install API where present, else Chromium's beforeinstallprompt; hidden otherwise.
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}
type InstallNavigator = Navigator & { install?: () => Promise<void> }

export function setupInstall(button: HTMLButtonElement, status: HTMLElement): void {
  const nav = navigator as InstallNavigator
  let deferred: BeforeInstallPromptEvent | null = null
  if (typeof nav.install === 'function') button.hidden = false
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferred = e as BeforeInstallPromptEvent
    button.hidden = false
  })
  button.addEventListener('click', async () => {
    try {
      if (typeof nav.install === 'function') {
        await nav.install()
        status.textContent = 'Installed.'
      } else if (deferred) {
        const event = deferred
        deferred = null // single use
        await event.prompt()
        const { outcome } = await event.userChoice
        status.textContent = outcome === 'accepted' ? 'Installed.' : 'Install dismissed.'
      }
    } catch {
      status.textContent = 'Install was cancelled or is not available.'
    }
    button.hidden = deferred === null && typeof nav.install !== 'function'
  })
}

// Offline-aware fetch: report reachability per request, not via navigator.onLine.
export async function fetchWithOfflineState(url: string, banner: HTMLElement): Promise<Response | undefined> {
  try {
    const res = await fetch(url)
    banner.hidden = true
    return res
  } catch {
    banner.hidden = false
    banner.textContent = 'Offline. Showing saved data.'
    const cache = await caches.open('data-v1')
    return cache.match(url)
  }
}
```
```css
@media (display-mode: standalone) {
  .top-bar .back { display: inline-grid; } /* no browser back button in a standalone iOS app */
  .browser-only { display: none; }
}
.offline-banner { padding: var(--space-2) var(--page-margin); background: var(--warning-fg); color: var(--canvas); font: var(--mo-type-callout); }
```
```html
<link rel="manifest" href="/manifest.webmanifest">
<link rel="apple-touch-icon" href="/icons/180.png">
<button id="install" type="button" hidden>Install app</button>
<p id="install-status" role="status"></p>
```

## Checklist
- [ ] The manifest has `id`, names, `start_url`, `display`, colours and 192/512 plus maskable icons; Lighthouse and DevTools report it installable.
- [ ] No install UI on first load; the custom button appears only when the browser can install.
- [ ] With the network off, the app opens to its shell and shows cached data with an "Offline" state.
- [ ] Actions that need the network are disabled or queued, and say so.
- [ ] Standalone mode on iOS has an in-app back control and safe-area padding.
- [ ] A new version is offered with a non-blocking update prompt.

## Sources
- https://web.dev/learn/pwa/
- https://web.dev/learn/pwa/web-app-manifest (short_name: "Keep it under 12 characters")
- https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
- https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist
- https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
- https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
- https://web.dev/articles/maskable-icon
- https://web.dev/articles/promote-install
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/pwa/install-web-app.md
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/pwa/migrate-web-app-origin.md
- plugins/dashboard-ui/skills/dashboard-ui-design/references/patterns/prog-perceived-performance-thresholds.md
