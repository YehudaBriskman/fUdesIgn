# Sharing and permissions

> Show everyone who has access with their role beside their name, choose the role before inviting, change it in place, and make removal a labelled, recoverable action that can never strand a record without an owner.

**Category:** Components and interaction · **Applies to:** share dialogs and panels for reports, dashboards, scenarios and workspaces; member lists; link sharing; "no access" screens · **Priority:** should

## When to use / when not
- Use for any record more than one person can open: a saved valuation, shared dashboard, scenario, workspace.
- Workspace administration (billing, SSO, SCIM) belongs on its own settings page. Linear keeps member roles under Settings > Administration > Members.
- Where one role fits everyone, skip the role picker and show a single "Can view" link toggle.
- Dialog versus panel: `comp-overlay-choice.md`. Focus and dismissal: `cpover-dialog-focus-and-dismissal.md`.

## Rules (do)
- **One list, three kinds of principal.** People, groups and link access share one "Who has access" list: avatar or icon, name, secondary line (email, "12 members", "Anyone with the link") and the current role as a visible dropdown trigger. Never hide the role behind hover or a detail page.
- **Pick the role before sending.** The invite row is `[name or email] [role ▾] [Invite]`, Invite as primary (`comp-button-hierarchy.md`). Default to the lowest useful role, "Viewer" (house default). Notion and Figma set permission in a dropdown next to the name before the invite goes out. Google Drive's "Notify people" checkbox lets the sender share without an email.
- **Four roles, one vocabulary** (house decision): *Viewer*, *Commenter*, *Editor*, *Owner* (everything, including sharing and deletion). Products differ (Drive: Viewer/Commenter/Editor; Notion: Can view/Can edit/Full access; GitHub: Read/Write), so pick one set and use it in the menu, list, audit log and errors.
- **Describe each role in the menu**, one line each: "Editor: change content and move items. Cannot share." GitHub's role table states what each role is for and where it stops. Editors reshare by default in Drive but not in Notion ("Can edit" cannot share, "Full access" can); the house default is **no**, and sharing is an Owner capability.
- **Change role in place.** The trigger opens a menu with the current role checked (`menuitemradio`, `aria-checked`, as Primer ActionMenu's single-select does) and the value kept visible on the trigger. Apply at once with inline "Saved" or an error and Retry (`prog-optimistic-ui-and-undo.md`).
- **Remove access as a labelled item.** Put text "Remove access" last in the role menu after a divider, not only a trash icon, and never as a red primary button. Removal is common, so prefer **undo over confirmation**: apply it and show "Removed Dana. Undo" for at least 8 s (house default).
- **Confirm only what is large or irreversible**: removing a group, removing yourself, switching link access to "Anyone". Title with the consequence ("Remove the Finance group? 14 people lose access"), buttons "Remove group" and "Keep access" (NN/g: name the item, label buttons by outcome, never "Are you sure? Yes / No"), and no default focus on the destructive one. This also serves WCAG 3.3.4 (Error Prevention: reversible, checked or confirmed) where deletion touches user data.
- **Last-owner safeguard.** A record keeps at least one Owner. If the only Owner is the target of Remove or a demotion, mark the item `aria-disabled="true"` (still focusable) and explain: "Dana is the only owner. Make someone else an owner first." Enforce on the server too. Figma allows one owner per team and transfers it explicitly.
- **Link access in plain words:** who ("Anyone with the link", "Anyone at Acme", "Only people added"), what ("view" or "edit") and until when ("Expires 30 Nov"). Drive offers Restricted, Your organization (work and school accounts) and Anyone with the link, with expiry up to a year on work and school accounts. Default to Restricted and show a warning row when public.
- **Permission failures say why and who can grant.** A 403 states what the user tried, the role needed, who can grant it ("Ask Dana Levi or Sam Cho") and a "Request access" button with an optional note. Notion puts "Request edit access" in the dropdown beside the viewer's current permission. Show their current role ("You are a Viewer. Editing needs Editor"). Error text says how to fix it (WCAG 3.3.3 Error Suggestion).
- **Show what exists; disable what is barred.** If the user can see the list but not change it, render roles as plain text with "Only owners can change access" rather than dropping controls.
- **Audit.** Every change (invite, role, removal, link scope, expiry) logs who, whom, from, to, when (absolute time, relative in a tooltip). Show "Last changed by Dana, 12 Nov" under the list with a link to the log. Entry shape: `aiagent-approval-and-audit.md`.
- **Reachability.** Every role trigger and remove item is Tab and arrow reachable. Targets at least 24 by 24 CSS px (WCAG 2.2 SC 2.5.8), 44 px for the role trigger on touch layouts (house default, matching Apple HIG's 44 pt). On narrow screens the dialog becomes a bottom sheet.

## Anti-patterns (don't)
- Choosing the role after the invite is sent, or inviting everyone as Editor.
- A role shown only as an icon or colour (Carbon: colour alone is insufficient for status).
- "Are you sure?" dialogs for every removal; users click through.
- Letting the last owner leave, orphaning the record.
- A bare "Access denied" with no reason and no person to contact.
- Public link access on silently, or a link that never expires with no sign of it.

## Good references
- [Google Drive: share files](https://support.google.com/drive/answer/2494822): Viewer, Commenter and Editor defined, general access (Restricted, organization, Anyone with the link), expiry, and a "Notify people" toggle.
- [Notion: sharing and permissions](https://www.notion.com/help/sharing-and-permissions): Full access versus Can edit (only Full access reshares), link expiry, and "Request edit access" in the permission dropdown.
- [Figma: control access and permissions](https://help.figma.com/hc/en-us/articles/360039970673-Control-file-access-and-permissions): role dropdown beside names with Remove, groups invited like people, one owner per team, inherited access that can be raised but not lowered.
- [GitHub: repository roles](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization): six roles (Read, Triage, Moderate, Write, Maintain, Admin), each with a stated purpose and a permission table.
- [Primer: ActionMenu](https://primer.style/product/components/action-menu/): single-select `menuitemradio` semantics, focus returned to the trigger on close, `inactiveText` for unavailable items.

## Bad references
- [Google Drive: Editor role](https://support.google.com/drive/answer/2494822): Editors can change permissions and share by default, so access spreads without the owner deciding. Acceptable only if the owner can switch it off ("Allow editors to change permissions and share") and the dialog says so.
- [NN/g: confirmation dialogs](https://www.nngroup.com/articles/confirmation-dialog/): generic "Are you sure?" gives no protection because users click Yes automatically. Applies directly to "Remove access?".
- [Linear: members and roles](https://linear.app/docs/members-roles): on Free plans all users are Admins and the workspace Owner role is Enterprise-only, so collaborating and administering are not separated. A cautionary scope choice, not a model.

## Accessibility
- The access list is a `<ul>` (or a table when it shows several columns). Each row's controls have names that include the person: "Role for Dana Levi, Editor" and "Remove access for Dana Levi" (WCAG 4.1.2).
- Invite field: an ARIA APG combobox with a listbox popup. Focus stays on the input, options are tracked with `aria-activedescendant`, Down Arrow enters the list, Enter accepts, Escape closes the popup first and the dialog second.
- Role menu: `menuitemradio` with `aria-checked`; the last-owner item is `aria-disabled` with `aria-describedby` at the reason; focus returns to the trigger on close.
- Announce results in a polite live region ("Dana is now a Viewer", "Dana removed") with `role="status"`. Use `role="alert"` only for failures (WCAG 4.1.3).
- Status and role never rely on colour alone; the public-link warning uses icon and text.

## Motion / interaction (if relevant)
- Removing a row collapses it over about 150 ms (house default; see `motion-reduced-motion.md` for tokens), and the Undo toast stays at least 8 s (house default). Under `prefers-reduced-motion`, the row disappears instantly. A restored row returns to its previous position.
- Toasts: `cpover-toast-and-feedback.md`. What to show once an invite is sent, and what comes next: `fflow-completion-and-end-states.md`. Undo is not the only way back; the audit log can re-add the person.

## Tokens and values
| Token | Default | Use |
|---|---|---|
| Default invite role | Viewer | house default, least privilege |
| Role trigger target | at least 24×24 (44 touch) | WCAG 2.5.8, house touch default |
| Undo window | 8s | removal and role-change toast |
| Link expiry options | 1 day, 7 days, 30 days, custom | house defaults, max 1 year as in Google Drive (work and school) |
| Confirm required for | group removal, self-removal, public link | house default, only high-stakes |
| Public-link warning | `--warning-fg` + icon + text | not colour alone (Carbon) |

## Implementation sketch
```html
<section aria-labelledby="access-h">
  <h2 id="access-h">Who has access</h2>
  <form class="invite">
    <label for="who">Add people or groups</label>
    <input id="who" type="text" role="combobox" aria-expanded="false" aria-controls="who-list" autocomplete="off">
    <select id="role" aria-label="Role for new people">
      <option value="viewer" selected>Viewer</option>
      <option value="commenter">Commenter</option>
      <option value="editor">Editor</option>
    </select>
    <button type="submit" class="primary">Invite</button>
  </form>
  <ul class="access">
    <li>
      <span class="name">Dana Levi <small>dana@example.com</small></span>
      <button type="button" aria-haspopup="menu" aria-label="Role for Dana Levi, Owner">Owner</button>
    </li>
    <li>
      <span class="name">Anyone with the link <small>can view · expires 30 Nov</small></span>
      <button type="button" aria-haspopup="menu" aria-label="Link access, Viewer">Viewer</button>
    </li>
  </ul>
  <p role="status" class="visually-hidden"></p>
</section>
```
```css
.access { list-style: none; margin: 0; padding: 0; }
.access li { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-block-size: 48px; }
.access button[aria-haspopup] { min-block-size: 24px; min-inline-size: 24px; }
@media (pointer: coarse) { .access li { min-block-size: 56px; } .access button[aria-haspopup] { min-block-size: 44px; } }
.access [aria-disabled="true"] { opacity: .6; cursor: not-allowed; }
```
```ts
export type Role = 'viewer' | 'commenter' | 'editor' | 'owner'

export interface Member {
  readonly id: string
  readonly name: string
  readonly role: Role
}

export type ChangeCheck =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: string }

/** Block removing or demoting the last owner. Enforce the same rule on the server. */
export function canChangeRole(members: readonly Member[], targetId: string, next: Role | 'removed'): ChangeCheck {
  const target = members.find((m) => m.id === targetId)
  if (!target) return { ok: false, reason: 'That person no longer has access.' }
  if (target.role !== 'owner' || next === 'owner') return { ok: true }
  const owners = members.filter((m) => m.role === 'owner')
  if (owners.length > 1) return { ok: true }
  return { ok: false, reason: `${target.name} is the only owner. Make someone else an owner first.` }
}
```

## Checklist
- [ ] One list shows people, groups and link access, each with the current role visible as text.
- [ ] Role is chosen before Invite is pressed, and the default is the least powerful role.
- [ ] Role names are identical in the menu, list, errors and audit log, and each has a one-line description.
- [ ] Role changes happen in place with inline feedback, and Remove access is a labelled menu item with Undo or a consequence-naming confirmation.
- [ ] The last owner cannot be removed or demoted, in the UI (with a reason) and on the server.
- [ ] Link access states who, what and until when, defaults to Restricted and warns when public.
- [ ] A permission failure names the missing role, who can grant it, and offers Request access.
- [ ] Every change is audited, and all controls are keyboard-reachable with targets of at least 24×24 px.

## Sources
- https://support.google.com/drive/answer/2494822
- https://www.notion.com/help/sharing-and-permissions
- https://help.figma.com/hc/en-us/articles/360039970673-Control-file-access-and-permissions
- https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization
- https://primer.style/product/components/action-menu/
- https://linear.app/docs/members-roles
- https://carbondesignsystem.com/patterns/status-indicator-pattern/
- https://www.nngroup.com/articles/confirmation-dialog/
- https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion.html
- https://www.w3.org/WAI/WCAG22/Understanding/error-prevention-legal-financial-data.html
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- Repo: `comp-overlay-choice.md`, `prog-optimistic-ui-and-undo.md`, `cpover-dialog-focus-and-dismissal.md`, `aiagent-approval-and-audit.md`
