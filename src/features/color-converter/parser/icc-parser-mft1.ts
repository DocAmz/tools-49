import { B2A0Tag } from "../types/tags";

export function parseMFT1Tag(buffer: Buffer, offset: number, inputChannels: number, outputChannels: number): B2A0Tag {
  console.log("Parsing MFT1 Structure...");

  // --- Parse Grid Points ---
  const gridPoints: number[] = [];
  for (let i = 0; i < inputChannels; i++) {
    gridPoints.push(buffer.readUInt8(offset + i) || 1);
  }
  offset += inputChannels;

  // --- Parse CLUT ---
  const clutSize = buffer.readUInt32BE(offset);
  offset += 4;
  const clut = buffer.subarray(offset, offset + clutSize);
  offset += clutSize;

  console.log(`MFT1 Grid Points: ${gridPoints}`);
  console.log(`MFT1 CLUT Size: ${clutSize}`);

  return {
    format: 'mft1',
    inputChannels,
    outputChannels,
    gridPoints,
    clut,
    matrix: [], // MFT1 usually has no explicit matrix
    inputCurves: [],
    outputCurves: [],
  };
}
