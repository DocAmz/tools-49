import { hexToRgb, hslToHex } from "./convertions"

export function getColorHarmonies(hex: string) {
  const rgb = hexToRgb(hex)
  if (!rgb) return null

  // Convert to HSL for easier rotation
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h /= 6
  }

  // Calculate harmonies
  const rotate = (hue: number, degrees: number) => (hue + degrees / 360) % 1

  return {
    analogous: [hex, hslToHex(rotate(h, 30), s, l), hslToHex(rotate(h, -30), s, l)],
    complementary: [hex, hslToHex(rotate(h, 180), s, l)],
    triadic: [hex, hslToHex(rotate(h, 120), s, l), hslToHex(rotate(h, 240), s, l)],
    tetradic: [hex, hslToHex(rotate(h, 90), s, l), hslToHex(rotate(h, 180), s, l), hslToHex(rotate(h, 270), s, l)],
  }
}