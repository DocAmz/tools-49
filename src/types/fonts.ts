export interface FontInfo {
  family: string;
  style: string;
  weight: string;
  stretch: string;
  unicodeRange: string;
  featureSettings: string;
}

export interface FontData {
    ascender: number;
    descender: number;
    encoding: any;
    glyphNames: { names: string[] };
    glyphs: { length: number };
    names: {
      copyright: { en: string };
      designer: { en: string };
      designerURL: { en: string };
      fontFamily: { en: string };
      fontSubfamily: { en: string };
      fullName: { en: string };
      license: { en: string };
      licenseURL: { en: string };
      manufacturer: { en: string };
      manufacturerURL: { en: string };
      postScriptName: { en: string };
      uniqueID: { en: string };
      version: { en: string };
    };
    numGlyphs: number;
    numberOfHMetrics: number;
    outlinesFormat: string;
    supported: boolean;
    tables: any;
    unitsPerEm: number;
}

export interface IFontData {
  name: string;
  target: ArrayBuffer;
}

export interface GlyphData {
  name: string;
  unicode: number;
  index: number;
}

export interface ErrorMessage {
  title: string;
  message: string;
  type: string;
  details?: string[];
}

export interface FontError {
  type: string;
  message: string;
  details?: string[];
}

export interface FontValidationError {
  table: string;
  error: string;
  fontFamily: string;
}

export interface FontLoadError {
  type:
    | 'timeout'
    | 'network'
    | 'format'
    | 'security'
    | 'validation'
    | 'DOMException'
    | 'unknown';
  message: string;
  details?: string[];
  originalError?: any;
}