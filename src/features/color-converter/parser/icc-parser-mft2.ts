import { B2A0Tag } from "../types/tags";

export function parseMFT2Tag(buffer: Buffer, offset: number, inputChannels: number, outputChannels: number): B2A0Tag {
  console.log("Parsing MFT2 Structure...");

  // --- Parse Matrix ---
  const matrix: number[] = [];
  for (let i = 0; i < 9; i++) {
    matrix.push(buffer.readFloatBE(offset));
    offset += 4;
  }

  console.log("MFT2 Matrix:", matrix);

  // --- Parse Curves (Input & Output) ---
  const inputCurves: Buffer[] = [];
  for (let i = 0; i < inputChannels; i++) {
    const curveSize = buffer.readUInt32BE(offset);
    offset += 4;
    inputCurves.push(buffer.subarray(offset, offset + curveSize));
    offset += curveSize;
  }

  const outputCurves: Buffer[] = [];
  for (let i = 0; i < outputChannels; i++) {
    const curveSize = buffer.readUInt32BE(offset);
    offset += 4;
    outputCurves.push(buffer.subarray(offset, offset + curveSize));
    offset += curveSize;
  }

  // --- Handle Missing Curves: Fallback to Linear if not valid ---
  inputCurves.forEach((curve, index) => {
    if (curve.length === 0) {
      console.log(`Input curve ${index} is invalid, applying default linear mapping.`);
      inputCurves[index] = Buffer.from([0, 0, 0, 0]);  // Simple linear curve fallback (default 0-255)
    }
  });

  outputCurves.forEach((curve, index) => {
    if (curve.length === 0) {
      console.log(`Output curve ${index} is invalid, applying default linear mapping.`);
      outputCurves[index] = Buffer.from([0, 0, 0, 0]);  // Simple linear curve fallback (default 0-255)
    }
  });

  // --- CLUT Handling ---
  const clut: Buffer = Buffer.alloc(0); // Assume CLUT is not present in mft2 tag
  const gridPoints: number[] = []; // Empty grid points

  // Check for CLUT presence and handle appropriately
  const clutSize = buffer.readUInt32BE(offset);  // Read potential CLUT size
  if (clutSize > 0) {
    console.log(`CLUT found, size: ${clutSize}`);
    // Handle CLUT parsing logic here
  } else {
    console.log("No CLUT found in MFT2 tag.");
  }

  return {
    format: 'mft2',
    inputChannels,
    outputChannels,
    matrix,
    inputCurves,
    outputCurves,
    clut, // Empty or parsed CLUT buffer
    gridPoints,
  };
}
