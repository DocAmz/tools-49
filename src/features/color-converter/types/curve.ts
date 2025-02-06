export interface CurveData {
  type: 'curv';
  count: number; // Number of entries in the curve
  values: number[]; // Curve values
}

export interface ParametricCurveData {
  type: 'para';
  functionType: number; // Function type (0-4)
  parameters: number[]; // Parameters for the curve
}