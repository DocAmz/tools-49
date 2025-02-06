/**
 * Convert XYZ to Lab Color space.
 * Using standard CIE XYZ to Lab conversion formula with D50 reference white point.
 */

import { LabColor, XYZColor } from "@/features/color-converter/types/colors";

export function xyzToLab(
  xyz: XYZColor,
  whitePoint: XYZColor,
): LabColor {

  // Normalize XYZ values by white point
  const xr = xyz.x / whitePoint.x;
  const yr = xyz.y / whitePoint.y;
  const zr = xyz.z / whitePoint.z;

  // Compute f(t) function
  const epsilon = 0.008856;
  const kappa = 903.3;

  const fx = xr > epsilon ? Math.pow(xr, 1/3) : (kappa * xr + 16) / 116;
  const fy = yr > epsilon ? Math.pow(yr, 1/3) : (kappa * yr + 16) / 116;
  const fz = zr > epsilon ? Math.pow(zr, 1/3) : (kappa * zr + 16) / 116;

  // Compute Lab values
  const l = yr > epsilon
    ? 116 * Math.pow(yr, 1/3) - 16
    : kappa * yr;

  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return { l, a, b };
}