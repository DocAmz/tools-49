import { A2B0Tag } from "../types/tags";

export function parseA2B0Tag(buffer: Buffer): A2B0Tag {
  let offset = 0;

  // Log the buffer size for debugging
  console.log('Buffer size:', buffer.length);

  // Read the number of input and output channels
  const inputChannels = buffer.readUInt8(offset);
  const outputChannels = buffer.readUInt8(offset + 1);
  offset += 2;

  // Skip reserved bytes
  offset += 2;

  // Parse input curves
  const inputCurves: Buffer[] = [];
  for (let i = 0; i < inputChannels; i++) {
    const curveOffset = buffer.readUInt32BE(offset);
    const curveSize = buffer.readUInt32BE(curveOffset);

    // Validate the curve offset and size
    if (curveOffset + 4 + curveSize > buffer.length) {
      throw new Error(`Invalid curve offset or size: offset=${curveOffset}, size=${curveSize}`);
    }

    inputCurves.push(buffer.subarray(curveOffset + 4, curveOffset + 4 + curveSize));
    offset += 4;
  }

  // Parse matrix
  const matrix: number[] = [];
  for (let i = 0; i < 9; i++) {
    // Validate the offset before reading
    if (offset + 4 > buffer.length) {
      throw new Error(`Invalid matrix offset: offset=${offset}`);
    }

    matrix.push(buffer.readFloatBE(offset));
    offset += 4;
  }

  // Parse CLUT
  const clutOffset = buffer.readUInt32BE(offset);
  const clutSize = buffer.readUInt32BE(clutOffset);

  // Validate the CLUT offset and size
  if (clutOffset + 4 + clutSize > buffer.length) {
    throw new Error(`Invalid CLUT offset or size: offset=${clutOffset}, size=${clutSize}`);
  }

  const clut = buffer.subarray(clutOffset + 4, clutOffset + 4 + clutSize);
  offset += 4;

  // Parse output curves
  const outputCurves: Buffer[] = [];
  for (let i = 0; i < outputChannels; i++) {
    const curveOffset = buffer.readUInt32BE(offset);
    const curveSize = buffer.readUInt32BE(curveOffset);

    // Validate the curve offset and size
    if (curveOffset + 4 + curveSize > buffer.length) {
      throw new Error(`Invalid curve offset or size: offset=${curveOffset}, size=${curveSize}`);
    }

    outputCurves.push(buffer.subarray(curveOffset + 4, curveOffset + 4 + curveSize));
    offset += 4;
  }

  return {
    inputChannels,
    outputChannels,
    inputCurves,
    matrix,
    clut,
    outputCurves,
  };
}