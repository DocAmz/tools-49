import fs from 'fs';
import { CMYKColor, LabColor, RGBColor, XYZColor } from '../types/colors';
import { loadICCProfile } from './loadProfile';
import { ICCProfile } from '../types/ICCProfile';
import { applyA2B0Tag } from '../helpers/tags/A2BX/A2B0-application';
import { parseA2B0Tag } from '../parser/icc-parser-A2B0Tag';
import { rgbToXYZ } from '../helpers/tags/XYZ/rgb-to-xyz';
import { debugB2A0Tag, parseB2A0Tag } from '../parser/icc-parser-B2A0Tag';
import { applyB2A0Tag, applyB2A0TagMFT1, applyB2A0TagMFT2 } from '../helpers/tags/B2AX/B2A0-application';
import { xyzToLab } from '../helpers/tags/XYZ/xyz-to-lab';

class ICCColorTransformer {
  private inputProfile: ReturnType<typeof loadICCProfile> | null = null;
  private outputProfile: ReturnType<typeof loadICCProfile> | null = null;

    // Reference white point (D50)
  private static readonly D50_WHITE_POINT: XYZColor = {
    x: 0.9642,
    y: 1.0000,
    z: 0.8249
  };

  /**
   * Initialize the color transformer with input and output ICC profile paths
   */
  constructor(
    private inputProfilePath: string,
    private outputProfilePath: string
  ) {}

  /**
   * Load the input ICC profile
   */

  async loadProfiles(): Promise<void> {
    try {
      this.inputProfile = loadICCProfile(this.inputProfilePath);
      this.outputProfile = loadICCProfile(this.outputProfilePath);
    }
    catch (error) {
      throw new Error(`Failed to load ICC profiles: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

    /**
   * Transform RGB color using loaded profiles
   */
  async transformColor(color: RGBColor): Promise<CMYKColor> {
    if (!this.inputProfile || !this.outputProfile) {
      throw new Error('ICC profiles not loaded. Call loadProfiles() first.');
    }

    // Validate input color values
    this.validateRGBColor(color);

    const xyz = rgbToXYZ(color, this.inputProfile);

    const lab = xyzToLab(xyz, ICCColorTransformer.D50_WHITE_POINT);



    return this.labToCMYK(lab);
  }

  /**
   * Validate RGB color values are within valid range
   */
  private validateRGBColor(color: RGBColor): void {
    const { r, g, b } = color;
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
      throw new Error('RGB values must be between 0 and 255');
    }
  }

    private labToCMYK(lab: LabColor): CMYKColor {

      if(!this.outputProfile?.B2A0) {
        return this.simpleLABtoCMYK(lab);
      }

      const normalized: [number,number, number] = [lab.l / 100, lab.a / 128 + 0.5, lab.b / 128 + 0.5];

      const result = debugB2A0Tag(this.outputProfile.B2A0);
      const tag = parseB2A0Tag(this.outputProfile.B2A0);


      // **Choose method based on format**

      let cmykValues: number[];
      if (tag.format === 'mft1') {
        cmykValues = applyB2A0TagMFT1(normalized, tag);
      } else {
        cmykValues = applyB2A0TagMFT2(normalized, tag);
      }

      return {
        c: cmykValues[0] * 100,
        m: cmykValues[1] * 100,
        y: cmykValues[2] * 100,
        k: cmykValues[3] * 100
      }
    }

    /**
   * Simple fallback LAB to CMYK conversion
   */
  private simpleLABtoCMYK(lab: LabColor): CMYKColor {
    // Very basic approximation - this is not accurate
    const k = 1 - (lab.l / 100);
    const c = (100 - lab.a - lab.l) / 100;
    const m = (100 - lab.b - lab.l) / 100;
    const y = (lab.l - lab.a - lab.b) / 100;

    return {
      c: Math.max(0, Math.min(100, c * 100)),
      m: Math.max(0, Math.min(100, m * 100)),
      y: Math.max(0, Math.min(100, y * 100)),
      k: Math.max(0, Math.min(100, k * 100))
    };
  }

}

export { ICCColorTransformer };