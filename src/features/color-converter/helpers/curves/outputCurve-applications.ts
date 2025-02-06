export function applyOutputCurves(value: number, curve: Buffer): number {
  const length = curve.length / 2; // Assuming 16-bit entries
  const index = Math.min(Math.floor(value * (length - 1)), length - 2);
  const a = curve.readUInt16BE(index * 2);
  const b = curve.readUInt16BE((index + 1) * 2);
  const t = value * (length - 1) - index;
  return (a + (b - a) * t) / 65535; // Normalize to 0-1
}