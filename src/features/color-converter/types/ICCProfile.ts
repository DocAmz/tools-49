import { parseICCProfileHeader } from "../parser/icc-parser-header";
import { CurveData, ParametricCurveData } from "./curve";
import { GamutTag } from "./tags";

export interface ICCProfile {
  header: ReturnType<typeof parseICCProfileHeader>;
  tags: Record<string, Buffer>; // Key: tag signature, Value: tag data buffer
  rXYZ?: [number, number, number];
  gXYZ?: [number, number, number];
  bXYZ?: [number, number, number];
  wtpt?: [number, number, number];
  A2B0?: Buffer; // A2B0 tag data
  B2A0?: Buffer; // B2A0 tag data
  A2B1?: Buffer; // A2B1 tag data
  B2A1?: Buffer; // B2A1 tag data
  A2B2?: Buffer; // A2B2 tag data
  B2A2?: Buffer; // B2A2 tag data
  gamt?: GamutTag | CurveData | ParametricCurveData; // Gamut tag data
}