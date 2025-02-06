import { HEXColor, RGBColor } from "../types/colors";

function hexToRgb (hex: string): RGBColor | undefined {
  // Remove the "#" symbol if present
  hex = hex.replace("#", "");

  // Check if the hex value is valid
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    return undefined;
  }

  // Convert the hex values to decimal
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };

}
function rgbToHex (color: RGBColor) {

  const valueToHex = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const hexColor =
    "#" + valueToHex(color.r) + valueToHex(color.g) + valueToHex(color.b);
  return hexColor;

}

function rgbToLab () {}
function rgbToHsl () {}
function rgbToHsb () {}
function rbgToXyz () {}
function rgbToCmyk(r: number, g: number, b: number) {
  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;
  const k = Math.min(c, m, y);

  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

function hslToHex(h: number, s: number, l: number)  {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255)
    const g = Math.round(hue2rgb(p, q, h) * 255)
    const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255)

    return rgbToHex({r, g, b})
  }

export { hexToRgb, rgbToHex, rgbToLab, rgbToHsl, rgbToHsb, rbgToXyz, hslToHex, rgbToCmyk };