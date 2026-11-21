# File upload

> Build file upload on a real `<input type="file">` with a visible button, state the allowed types and size limit before people choose, add drag-and-drop only as an extra, then show each file's name, progress and a remove action, and check type and size on the client *and* the server.

**Category:** Inputs · **Applies to:** document and evidence uploads, avatars, attachments, CSV imports · **Priority:** must

## When to use / when not
- **Single file** (a photo of a document, an avatar): one file input with a button.
- **Several files** (evidence, attachments): `multiple`, with a list of chosen files that people can add to and remove from. GOV.UK's multi-file upload pattern adds files one at a time to a list with "Add another file".
- **Bulk data import** (CSV, XLSX): upload, then a preview and mapping step before anything is written ("12 rows ready, 2 with errors").
- **Don't ask for a file** when a few fields would do. Uploads are slow and error-prone on mobile.

## Rules (do)
- **Native input underneath.** `<input type="file">` gives keyboard access, the OS file picker and the camera on mobile (`capture` for direct camera). Visually restyle the button, but keep the input focusable and labelled; never `display: none` it.
- **Label + hint before the control**: "Upload your passport photo" + "JPG, PNG or PDF, up to 10 MB". Concrete types and limits in words.
- **`accept` is a filter, not validation.** Set `accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"` to help the picker; still check `file.type`, extension and `file.size` in JS on change, and again on the server (type sniffing, malware scan).
- **Drag and drop is additive.** A drop zone ("Drag files here or choose files") around the same input; the button alone must still work. Highlight the zone on `dragover` with a border change, not only colour.
- **Per-file feedback** in a list: name, size, status (Uploading 45%, Uploaded, Failed) and a Remove button named with the file ("Remove passport.pdf").
  - Upload in the background as soon as a file is chosen when files are large; show a determinate progress bar (`<progress>`) for anything over ~1 s.
  - Failures stay inline with the reason and a Retry: "passport.heic is not a JPG, PNG or PDF".
- **Errors name the file and the rule**: "The selected file must be smaller than 10 MB" (GOV.UK file-upload error wording); for type: "The selected file must be a JPG, PNG or PDF".
- **Don't clear valid files** when one fails or when the rest of the form has errors. Keep uploaded files across validation round-trips (store a token server-side; a native file input can't be refilled).
- **Images**: show a thumbnail preview; downscale large photos client-side before upload when quality allows (phone photos are 3–12 MB).
- **Privacy and limits**: say who sees the file and how long you keep it if sensitive.
- **Announce** progress milestones and completion in a polite live region ("passport.pdf uploaded"), not every percent.

## Anti-patterns (don't)
- A drop zone with no button, or a `<div>` that only responds to clicks.
- Limits revealed only by the error after a 20 MB upload.
- `accept` as the only type check.
- A form error that wipes every uploaded file.
- Indeterminate spinners on multi-megabyte uploads.
- "Upload failed" with no reason and no retry.

## Good references
- [GOV.UK Design System — File upload](https://design-system.service.gov.uk/components/file-upload/) — label, hint with types and size, native input, specific error messages, and the drop-zone enhancement.
- [MDN — `<input type="file">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file) — `accept`, `multiple`, `capture`, reading `files`.
- [Carbon — File uploader usage](https://carbondesignsystem.com/components/file-uploader/usage/) — states per file (uploading, complete, error) and a remove action.
- [modern-web-guidance — Rich media picker](https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/rich-media-picker.md) — native file input as the base for media choice.

## Bad references
- Upload widgets built on a third-party drop zone with no keyboard path: the "click to browse" area is a `<div>`, so keyboard and switch users can't choose a file.
- Uploaders whose only affordance is "Drag files here": on phones there is nothing to drag from, so people email the document to a computer and start again.

## Accessibility
- The visible button is the labelled native input (or its `<label>`); focus ring visible.
- Drop zone is not focusable on its own; it is the input's label area.
- Progress uses `<progress>` with a label; completion and failure in a polite live region.
- Remove buttons have unique names including the file name.

## Motion / interaction (if relevant)
- Progress bars move smoothly; under reduced motion, update in steps. No bouncing icons in the drop zone.

## Tokens and values
| Token | Value | Use |
|---|---|---|
| Drop zone | 2px dashed `--border-strong`, `--radius-md`, 24px padding | Idle |
| Drop zone active | 2px solid `--accent`, `--info-bg` | `dragover` |
| Progress shown | after ~1s or files > 1 MB | Per file |
| Default limit | stated in hint, e.g. 10 MB | Size |

## Implementation sketch
```html
<div class="field">
  <label for="docs">Upload evidence</label>
  <p id="docs-hint" class="hint">PDF, JPG or PNG, up to 10 MB each</p>
  <div class="dropzone">
    <input id="docs" name="docs" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" aria-describedby="docs-hint">
    <span class="hint" aria-hidden="true">or drag files here</span>
  </div>
  <ul class="file-list" aria-label="Chosen files"></ul>
  <p class="visually-hidden" aria-live="polite" id="docs-status"></p>
</div>
```
```css
.dropzone { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3, 12px); padding: var(--space-5, 24px); border: 2px dashed var(--border-strong); border-radius: var(--radius-md, 8px); }
.dropzone.is-over { border-style: solid; border-color: var(--accent); background: var(--info-bg); }
.file-list { list-style: none; padding: 0; display: grid; gap: var(--space-2, 8px); }
.file-list progress { inline-size: 12rem; accent-color: var(--accent); }
```
```ts
export type FileCheck = { file: File; error: string | null }
const TYPES: Record<string, readonly string[]> = { 'application/pdf': ['pdf'], 'image/jpeg': ['jpg', 'jpeg'], 'image/png': ['png'] }
const MAX_BYTES = 10 * 1024 * 1024

// Client-side checks for fast feedback; the server repeats them and sniffs the real type.
export function checkFiles(list: FileList): FileCheck[] {
  return [...list].map((file) => {
    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    const typeOk = (TYPES[file.type] ?? []).includes(ext)
    if (!typeOk) return { file, error: `${file.name} must be a PDF, JPG or PNG` }
    if (file.size > MAX_BYTES) return { file, error: `${file.name} must be smaller than 10 MB` }
    return { file, error: null }
  })
}

export function wireDropzone(zone: HTMLElement, input: HTMLInputElement): void {
  zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('is-over') })
  zone.addEventListener('dragleave', () => zone.classList.remove('is-over'))
  zone.addEventListener('drop', (e) => {
    e.preventDefault(); zone.classList.remove('is-over')
    if (e.dataTransfer?.files.length) { input.files = e.dataTransfer.files; input.dispatchEvent(new Event('change', { bubbles: true })) }
  })
}
```

## Checklist
- [ ] A native, labelled file input with a visible button is the base; drag and drop only adds to it.
- [ ] Allowed types and size limit are in the hint before choosing.
- [ ] Type and size are checked on change and on the server.
- [ ] Each file shows name, status, determinate progress and a named Remove.
- [ ] Errors name the file and the rule; failures offer Retry.
- [ ] Uploaded files survive other validation errors.

## Sources
- https://design-system.service.gov.uk/components/file-upload/
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/file
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress
- https://carbondesignsystem.com/components/file-uploader/usage/
- https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/forms/rich-media-picker.md (Apache-2.0, paraphrased)
