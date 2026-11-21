// WCAG 2.x relative luminance and contrast ratio, computed from sRGB channels.

/** @param {number} c 0-255 */
function channel(c) {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

/** @param {number[]} rgb [r, g, b] 0-255 */
export function luminance(rgb) {
  return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2])
}

/** @param {number[]} a @param {number[]} b */
export function contrast(a, b) {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** Composite an [r, g, b, alpha] colour over an opaque [r, g, b]. */
export function over(top, bottom) {
  const a = top.length > 3 ? top[3] : 1
  return [0, 1, 2].map((i) => top[i] * a + bottom[i] * (1 - a))
}

/** @param {number[]} c */
export function hex(c) {
  return `#${c
    .slice(0, 3)
    .map((v) => Math.round(v).toString(16).padStart(2, '0'))
    .join('')}`
}
