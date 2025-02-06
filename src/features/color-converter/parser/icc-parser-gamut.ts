import { CurveData, ParametricCurveData } from "../types/curve";
import { GamutTag } from "../types/tags";
import { parseCurve } from "./icc-parser-curve";
import { parseParametricCurve } from "./icc-parser-paramC";



export function parseGamtTag(buffer: Buffer): GamutTag | CurveData | ParametricCurveData {
  const type = buffer.toString('ascii', 0, 4); // First 4 bytes indicate the type
  const data = buffer.subarray(8); // Skip the first 8 bytes (type and reserved bytes)

  switch (type) {
    case 'curv':
      return parseCurve(buffer);
    case 'para':
      return parseParametricCurve(buffer);
    case 'mft2':
      // Handle multi-function table type 2
      return { type: 'mft2', data: buffer.subarray(8) };
    case 'mft1':
      // Handle multi-function table type 1
      return { type: 'mft1', data: buffer.subarray(8) };
    default:
      throw new Error(`Unsupported gamt tag type: ${type}`);
  }

  return {
    type,
    data,
  };
}