import { B2A0Tag } from "@/features/color-converter/types/tags";
import { applyCLUT } from "../../clut/clut-application";
import { applyCurve } from "../../curves/curve-application";
import { applyMatrix } from "../../matrix/matrix-application";


/**
 * Apply the B2A0 tag transformation to normalized XYZ values.
 * @param normalized - Normalized XYZ values in the range [0, 1].
 * @param b2a0Tag - Parsed B2A0 tag data.
 * @returns Transformed color values in the output color space (e.g., CMYK).
 */
export function applyB2A0Tag(normalized: [number, number, number], b2a0Tag: B2A0Tag): number[] {
  // Step 1: Apply input curves
  const inputCurvesOutput = applyCurves(normalized, b2a0Tag.inputCurves);

  // Step 2: Apply matrix
  const matrixOutput = applyMatrix(inputCurvesOutput, b2a0Tag.matrix);

  // Step 3: Apply CLUT
  const clutOutput = applyCLUT(matrixOutput, b2a0Tag.clut, b2a0Tag.gridPoints, b2a0Tag.inputChannels, b2a0Tag.outputChannels);

  // Step 4: Apply output curves
  const outputCurvesOutput = applyCurves(clutOutput, b2a0Tag.outputCurves);

  return outputCurvesOutput;
}

/**
 * Apply curves to the input values.
 * @param input - Input values.
 * @param curves - Array of curve data buffers.
 * @returns Transformed values after applying the curves.
 */
function applyCurves(input: number[], curves: Buffer[]): number[] {
  return input.map((value, index) => {
    const curve = curves[index];
    if (!curve) return value; // If no curve is defined, return the input value

    const curveOutput = applyCurve(value, curve);

    // Example: Apply a simple linear curve (replace with actual curve parsing logic)
    return curveOutput; // Replace this with actual curve application logic
  });
}


export function applyB2A0TagMFT1(normalized: [number, number, number], tag: B2A0Tag): number[] {
  console.log("Applying MFT1 B2A0 Transformation...");

  // --- Step 1: Apply Input Curves ---
  const curvedInput = normalized.map((val, i) => applyCurve(val, tag.inputCurves[i]));

  // --- Step 2: Apply CLUT Transformation ---
  const clutOutput = applyCLUT(curvedInput, tag.clut, tag.gridPoints, tag.inputChannels, tag.outputChannels);

  // --- Step 3: Apply Output Curves ---
  const finalOutput = clutOutput.map((val, i) => applyCurve(val, tag.outputCurves[i]));

  return finalOutput;
}


export function applyB2A0TagMFT2(normalized: [number, number, number], tag: B2A0Tag): number[] {
  console.log("Applying MFT2 B2A0 Transformation...");

  // --- Step 1: Apply Input Curves ---
  const curvedInput = normalized.map((val, i) => applyCurve(val, tag.inputCurves[i]));

  // --- Step 2: Apply 3x3 Matrix Transformation ---
  const transformedInput = applyMatrix(curvedInput, tag.matrix);

  // --- Step 3: Apply CLUT Transformation ---
  const clutOutput = applyCLUT(transformedInput, tag.clut, tag.gridPoints, tag.inputChannels, tag.outputChannels);

  // --- Step 4: Apply Output Curves ---
  const finalOutput = clutOutput.map((val, i) => applyCurve(val, tag.outputCurves[i]));

  return finalOutput;
}
