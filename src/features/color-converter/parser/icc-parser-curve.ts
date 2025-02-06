import { CurveData } from "../types/curve";

export function parseCurve(buffer: Buffer): CurveData {
  const count = buffer.readUInt32BE(4); // Number of entries
  const values: number[] = [];

  for (let i = 0; i < count; i++) {
    values.push(buffer.readUInt16BE(8 + i * 2)); // Each value is 2 bytes
  }

  return {
    type: 'curv',
    count,
    values,
  };
}