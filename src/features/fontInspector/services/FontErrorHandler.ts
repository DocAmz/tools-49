// services/FontErrorHandler.ts
import { toast } from "sonner";
import { FontLoadError } from "@/types/fonts";

export class FontErrorHandler {
  failedFonts: Map<string, FontLoadError>;

  constructor() {
    this.failedFonts = new Map();
  }

  addFailedFont(fontName: string, error: any): void {
    const fontError = this.categorizeFontError(error);
    this.failedFonts.set(fontName, fontError);
    this.logDetailedError(fontName, fontError);
    this.showErrorToast(fontName, fontError);
  }

  private categorizeFontError(error: any): FontLoadError {
    const errorMessage = error?.message || String(error);

    if (errorMessage.includes('timeout')) {
      return {
        type: 'timeout',
        message: 'Font loading timed out',
        details: ['Loading took longer than 5 seconds'],
        originalError: error
      };
    }

    if (errorMessage.includes('network') || error instanceof TypeError) {
      return {
        type: 'network',
        message: 'Network error while loading font',
        details: ['Check your internet connection', 'Verify the font URL is accessible'],
        originalError: error
      };
    }

    if (errorMessage.includes('format') || errorMessage.includes('invalid font')) {
      return {
        type: 'format',
        message: 'Invalid font format',
        details: ['The font file is corrupt or in an unsupported format'],
        originalError: error
      };
    }

    if (errorMessage.includes('security')) {
      return {
        type: 'security',
        message: 'Font was blocked for security reasons',
        details: ['Check your browser security settings'],
        originalError: error
      };
    }

    if (errorMessage.includes('validation')) {
      return {
        type: 'validation',
        message: 'Font failed validation checks',
        details: ['The font file is invalid'],
        originalError: error
      };
    }

    if (errorMessage.includes('illegal string')) {
      return {
        type: 'DOMException',
        message: 'DOM Exception while loading font',
        details: [errorMessage],
        originalError: error
      };
    }

    if (errorMessage.includes('sanitizer')) {
      return {
        type: 'security',
        message: 'Font was blocked for security reasons',
        details: ['The font file appears to be corrupted or invalid.'],
        originalError: error
      };
    }

    return {
      type: 'unknown',
      message: 'Unknown error loading font',
      details: [errorMessage],
      originalError: error
    };
  }

  private logDetailedError(fontFamily: string, error: FontLoadError): void {
    console.group(`🔴 Font Loading Error: ${fontFamily}`);
    console.log('Error Type:', error.type);
    console.log('Message:', error.message);
    if (error.details) {
      console.log('Details:', error.details);
    }
    if (error.originalError) {
      console.log('Original Error:', error.originalError);
    }
    console.groupEnd();
  }

  private showErrorToast(fontFamily: string, error: FontLoadError): void {
    const messages = {
      timeout: `Font ${fontFamily} took too long to load`,
      network: `Network error loading ${fontFamily}`,
      format: `Invalid format for ${fontFamily}`,
      security: `${fontFamily} was blocked for security reasons`,
      validation: `${fontFamily} failed validation checks`,
      unknown: `Error loading ${fontFamily}: ${error.message}`,
      DOMException: `DOM Exception loading ${fontFamily}`
    };

    toast.error(messages[error.type], {
      duration: 5000,
      description: error.details?.[0]
    });
  }

  getError(fontFamily: string): FontLoadError | null {
    return this.failedFonts.get(fontFamily) || null;
  }

  hasError(fontFamily: string): boolean {
    const error = this.failedFonts.get(fontFamily);
    return error ? true : false;
  }

  clearErrors(): void {
    this.failedFonts.clear();
  }
}