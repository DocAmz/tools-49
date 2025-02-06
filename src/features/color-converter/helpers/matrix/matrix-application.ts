
/**
 * The matrix is a 3x3 matrix that performs a linear transformation on the input values.
 * @param input
 * @param matrix
 * @returns
 */
export function applyMatrix(input: number[], matrix: number[]): number[] {
  return [
    input[0] * matrix[0] + input[1] * matrix[1] + input[2] * matrix[2],
    input[0] * matrix[3] + input[1] * matrix[4] + input[2] * matrix[5],
    input[0] * matrix[6] + input[1] * matrix[7] + input[2] * matrix[8],
  ];
}