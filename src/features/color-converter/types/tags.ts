export interface ICCTag {
  signature: string;
  offset: number;
  size: number;
}

export interface A2B0Tag {
  inputChannels: number;
  outputChannels: number;
  inputCurves: Buffer[];
  matrix: number[];
  clut: Buffer;
  outputCurves: Buffer[];
}

export interface B2A0Tag {
  format: 'mft1' | 'mft2';
  inputChannels: number;
  outputChannels: number;
  inputCurves: Buffer[];
  matrix: number[];
  clut: Buffer;
  outputCurves: Buffer[];
  gridPoints: number[];
}

export interface GamutTag {
  type: string; // e.g., 'curv', 'para', 'mft2'
  data: Buffer; // Raw data for the curve or LUT
}