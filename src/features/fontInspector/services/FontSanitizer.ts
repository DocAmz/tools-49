import * as opentype from "opentype.js";
import { FontMetrics, GlyphValidationService, ValidationRule } from "./GlyphValidationService";

interface SanitizerResult {
  success: boolean;
  font?: ArrayBuffer
  message: string;
  stats?: {
    totalGlyphs: number
    validGlyphs: number
    fixedGlyphs: number
    removedGlyphs: number
  };
  errors?: string[]
}

export class FontSanitizer {
  private validationService: GlyphValidationService | null = null;
  private validationRules: Map<string, ValidationRule> | null = null;
  private metrics: FontMetrics | null = null;
  private errors: string[] = [];
  private stats = {
    totalGlyphs: 0,
    validGlyphs: 0,
    fixedGlyphs: 0,
    removedGlyphs: 0,
  };


  constructor() {
    console.log('Sanitizer created')
  }

  public async sanitizeFont(fontBuffer: ArrayBuffer): Promise<SanitizerResult> {
    console.log('Sanitizer called')
    try {
      const font = opentype.parse(fontBuffer)

      console.log('Sanitizing :', font.names.fontFamily.en)

      this.metrics = {
        xMin: font.tables.head.xMin,
        xMax: font.tables.head.xMax,
        yMin: font.tables.head.yMin,
        yMax: font.tables.head.yMax,
        ascender: font.ascender,
        descender: font.descender,
        unitsPerEm: font.unitsPerEm
      }

      this.sanitizeMetrics()
      this.validationService = new GlyphValidationService(this.metrics)
      this.validationRules = this.validationService.getValidationRules();

      console.log('Metrics:', this.metrics)

      const sanitizedGlyphs = this.processGlyphs(font)
      const sanitizedFont: opentype.Font = this.createSubsetFont(font, sanitizedGlyphs)

      if(sanitizedFont) {
        const fontArray = sanitizedFont.toArrayBuffer()

        return {
          success: true,
          font: fontArray,
          message: 'Font sanitized successfully',
          stats: this.stats,
          errors: this.errors
        }
      }

      throw new Error('Failed to create sanitized font')
    } catch(error: any) {
      return {
        success: false,
        message: `Font sanitization failed: ${error}`,
        errors: this.errors
      }
    }
  }


  private processGlyphs(font: opentype.Font): Map<number, opentype.Glyph> {
    const validGlyphs = new Map<number, opentype.Glyph>();
    this.stats.totalGlyphs = font.glyphs.length

    for (let i = 0; i < font.glyphs.length; i++) {
      const glyph = font.glyphs.get(i); // Access glyphs using the public `get` method
      if (!glyph) continue;

      const validationResult = this.validateAndFixGlyph(glyph);

      if (validationResult.isValid) {
        validGlyphs.set(i, validationResult.glyph || glyph);
        this.stats.validGlyphs++;
        if (validationResult.wasFixed) {
          this.stats.fixedGlyphs++;
        }
      } else {
        this.stats.removedGlyphs++;
      }
    }

    return validGlyphs
  }

  private validateAndFixGlyph(glyph: opentype.Glyph): {
    isValid: boolean;
    glyph?: opentype.Glyph;
    wasFixed: boolean;
  } {
    let currentGlyph = glyph;
    let wasFixed = false;

    if(!this.validationRules) {
      throw new Error('Validation rules not initialized')
    }

    this.validationRules.forEach((rule, ruleName) => {
      if (!rule.check(currentGlyph)) {
      if (rule.severity === 'error' && !rule.fix) {
        this.errors.push(`Glyph failed validation: ${ruleName}`);
        return { isValid: false, wasFixed: false };
      }

      if (rule.fix) {
        const fixedGlyph = rule.fix(currentGlyph);
        if (fixedGlyph) {
        currentGlyph = fixedGlyph;
        wasFixed = true;
        } else if (rule.severity === 'error') {
        this.errors.push(`Failed to fix glyph: ${ruleName}`);
        return { isValid: false, wasFixed: false };
        }
      }
      }
    });

    return { isValid: true, glyph: currentGlyph, wasFixed };
  }

  private createSubsetFont(
    originalFont: opentype.Font,
    validGlyphs: Map<number, opentype.Glyph>
  ): opentype.Font {

    if (!this.metrics) {
      throw new Error('Font metrics not initialized')
    }

    const subset = new opentype.Font({
      familyName: originalFont.names.fontFamily.en,
      styleName: originalFont.names.fontSubfamily.en,
      unitsPerEm: this.metrics.unitsPerEm,
      ascender: this.metrics.ascender,
      descender: this.metrics.descender,
      glyphs: Array.from(validGlyphs.values())
    })

    subset.tables = {
      ...subset.tables,
      os2: originalFont.tables.os2,
      head: originalFont.tables.head,
      hhea: originalFont.tables.hhea,
      name: originalFont.tables.name
    }

    return subset
  }

  private sanitizeMetrics(): void {
    if (!this.metrics) {
      throw new Error('Font metrics not initialized')
    }

    if (this.metrics.descender > 0) {
      this.metrics.descender = -this.metrics.descender;
      this.errors.push('Descender value is positive, corrected to negative')
    }
  }
}
