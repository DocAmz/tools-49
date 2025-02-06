export function applyCLUT(input: number[], clut: Buffer, gridPoints: number[], inputChannels: number, outputChannels: number): number[] {
  console.log("Applying CLUT...");
  console.log("Input:", input);
  console.log("CLUT Size:", clut.length);
  console.log("Grid Points:", gridPoints);
  console.log("Input Channels:", inputChannels);
  console.log("Output Channels:", outputChannels);

  const output: number[] = new Array(outputChannels).fill(0);
  const stride = outputChannels * 2; // Assuming 16-bit entries

  // Calculate indices and weights for interpolation
  const indices: number[] = [];
  const weights: number[] = [];

  for (let i = 0; i < inputChannels; i++) {
    if (isNaN(input[i])) {
      console.warn(`Invalid input value at channel ${i}:`, input[i]);
      return output;
    }

    const gridSize = gridPoints[i] ?? 2; // Ensure gridPoints[i] is defined
    const index = Math.min(Math.floor(input[i] * (gridSize - 1)), gridSize - 2);

    indices.push(index);
    weights.push(input[i] * (gridSize - 1) - index);
  }

  // Perform interpolation
  for (let i = 0; i < outputChannels; i++) {
    let value = 0;
    for (let j = 0; j < (1 << inputChannels); j++) {
      let offset = 0;
      let weight = 1;

      for (let k = 0; k < inputChannels; k++) {
        const bit = (j >> k) & 1;

        if (isNaN(indices[k])) {
          console.error(`indices[${k}] is NaN! Input:`, input[k], "Grid Points:", gridPoints[k]);
          return output;
        }

        offset += (indices[k] + bit) * stride;

        if (isNaN(offset)) {
          console.error(`Offset became NaN! indices:`, indices, "Bit:", bit, "Stride:", stride);
          return output;
        }

        weight *= bit ? weights[k] : 1 - weights[k];
      }

      if (!clut || clut.length < offset + i * 2 + 2) {
        console.error(`CLUT buffer is too small! Offset: ${offset + i * 2}, CLUT Size: ${clut.length}`);
        return output;
      }

      value += clut.readUInt16BE(offset + i * 2) * weight;
    }

    output[i] = value / 65535; // Normalize to 0-1
  }

  return output;
}
