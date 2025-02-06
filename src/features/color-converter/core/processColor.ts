
import path from 'path';
import { ICCColorTransformer } from './ICCColorTransformer';
import { CMYKColor, RGBColor } from '../types/colors';

interface ProcessColorParams {
  inputProfile: string; // Name of the input ICC profile file (e.g., 'sRGB.icc')
  outputProfile: string; // Name of the output ICC profile file (e.g., 'MyCustomCMYK.icc')
  rgb: RGBColor; // RGB color object with 'r', 'g', and 'b' properties
}

export async function processColor({ inputProfile, outputProfile, rgb }: ProcessColorParams): Promise<CMYKColor> {
  const inputProfilePath = path.join(process.cwd(), 'src', 'profile', getProfileName(inputProfile));
  const outputProfilePath = path.join(process.cwd(), 'src', 'profile', getProfileName(outputProfile));

  const transformer = new ICCColorTransformer(inputProfilePath, outputProfilePath);

  try {
    await transformer.loadProfiles();
  } catch (error) {
    console.error('Error loading profiles:', error);
    throw new Error('Error loading profiles');
  }

  try {
    const cmyk = await transformer.transformColor(rgb);
    console.log('[FINAL RESULT] - CMYK:', cmyk);
    return cmyk;
  } catch (error) {
    console.error('Error converting RGB to CMYK:', error);
    throw new Error('Error converting RGB to CMYK');
  }
}


const getProfileName = (name: string) => {
  return name.replace(/\ /g, '-').toLowerCase() + '.icc';
};
