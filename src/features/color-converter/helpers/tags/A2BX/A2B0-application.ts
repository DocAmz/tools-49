import { applyCLUT } from "../../clut/clut-application";
import { applyCurve } from "../../curves/curve-application";
import { applyMatrix } from "../../matrix/matrix-application";
import { applyOutputCurves } from "../../curves/outputCurve-applications";
import { A2B0Tag } from "../../../types/tags";

export function applyA2B0Tag(input: number[], tag: A2B0Tag): number[] {
  // Apply input curves
  const linearized = input.map((value, i) => applyCurve(value, tag.inputCurves[i]));

  // Apply matrix
  const transformed = applyMatrix(linearized, tag.matrix);

  // Apply CLUT
  const gridPoints = [17, 17, 17]; // Example grid points for a 3D CLUT
  const clutOutput = applyCLUT(transformed, tag.clut, gridPoints, tag.inputChannels, tag.outputChannels);

  // Apply output curves
  const output = clutOutput.map((value, i) => applyOutputCurves(value, tag.outputCurves[i]));

  return output;
}