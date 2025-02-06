/**
 * input curves are one-dimensional lookup tables that map input values (e.g., R, G, B) to linearized values. You can apply them using interpolation.
 * @param value
 * @param curve
 * @returns
 */
export function applyCurve(value: number, curve: Buffer): number {


  if(!curve || curve.length < 2) {
    console.warn("Invalid curve buffer: Using default linear mapping.");
    return value;
  }

  const length = curve.length / 2; // Assuming 16-bit entries
  const index = Math.min(Math.floor(value * (length - 1)), length - 2);
  const a = curve.readUInt16BE(index * 2);
  const b = curve.readUInt16BE((index + 1) * 2);
  const t = value * (length - 1) - index;
  return (a + (b - a) * t) / 65535; // Normalize to 0-1
}