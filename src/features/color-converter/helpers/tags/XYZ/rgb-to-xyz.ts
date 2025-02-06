import { RGBColor, XYZColor } from "@/features/color-converter/types/colors";
import { ICCProfile } from "@/features/color-converter/types/ICCProfile";

export function rgbToXYZ(rgb: RGBColor, profile: ICCProfile): XYZColor {


  if (!profile.rXYZ || !profile.gXYZ || !profile.bXYZ) {
    throw new Error('Input profile XYZ tags not loaded');
  }

  // Create transformation matrix from profile XYZ values
  const matrix = [
    profile.rXYZ,
    profile.gXYZ,
    profile.bXYZ
  ];

  // Normalize RGB values to 0-1 range
  const normalizedRGB = [
    rgb.r / 255,
    rgb.g / 255,
    rgb.b / 255
  ];

  // Apply gamma correction if needed (assuming sRGB-like gamma)
  const linearRGB = normalizedRGB.map(v =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );

  // Matrix multiplication
  const xyz = {
    x: matrix[0][0] * linearRGB[0] + matrix[1][0] * linearRGB[1] + matrix[2][0] * linearRGB[2],
    y: matrix[0][1] * linearRGB[0] + matrix[1][1] * linearRGB[1] + matrix[2][1] * linearRGB[2],
    z: matrix[0][2] * linearRGB[0] + matrix[1][2] * linearRGB[1] + matrix[2][2] * linearRGB[2]
  };

  return xyz;
}