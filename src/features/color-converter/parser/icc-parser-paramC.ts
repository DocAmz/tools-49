import { ParametricCurveData } from "../types/curve";

export function parseParametricCurve(buffer: Buffer): ParametricCurveData {
  const functionType = buffer.readUInt16BE(4); // Function type
  const parameters: number[] = [];

  // Read parameters based on the function type
  switch (functionType) {
    case 0: // Y = X^g
      parameters.push(buffer.readFloatBE(8)); // g
      break;
    case 1: // Y = (aX + b)^g + c
      parameters.push(buffer.readFloatBE(8)); // a
      parameters.push(buffer.readFloatBE(12)); // b
      parameters.push(buffer.readFloatBE(16)); // g
      parameters.push(buffer.readFloatBE(20)); // c
      break;
    case 2: // Y = (aX + b)^g + c for X >= d, Y = eX + f for X < d
      parameters.push(buffer.readFloatBE(8)); // a
      parameters.push(buffer.readFloatBE(12)); // b
      parameters.push(buffer.readFloatBE(16)); // g
      parameters.push(buffer.readFloatBE(20)); // c
      parameters.push(buffer.readFloatBE(24)); // d
      parameters.push(buffer.readFloatBE(28)); // e
      parameters.push(buffer.readFloatBE(32)); // f
      break;
    // Add cases for other function types as needed
    default:
      throw new Error(`Unsupported parametric curve function type: ${functionType}`);
  }

  return {
    type: 'para',
    functionType,
    parameters,
  };
}