import { toast } from "sonner";
import * as opentype from "opentype.js";
import { IFontData, GlyphData, FontLoadError } from "@/types/fonts";
import { FontErrorHandler } from "./services/FontErrorHandler";


class FontLoader {
  private fontFaces: FontFace[];
  private loadedFonts: Set<string>;
  private fontParsers: Map<string, opentype.Font>;
  private originalBuffers: Map<string, ArrayBuffer>;
  private errorHandler: FontErrorHandler;

  constructor(family: IFontData[]) {
    console.log("FontLoader constructor called with:", family);

    try {
      this.loadedFonts = new Set<string>();
      this.fontParsers = new Map();
      this.originalBuffers = new Map();
      this.fontFaces = this.initializeFontFaces(family);
      this.errorHandler = new FontErrorHandler();

      // Store original ArrayBuffers
      family.forEach(font => {
        this.originalBuffers.set(
          this.sanitizeFontFamily(font.name),
          font.target
        );
      });

      console.log("FontLoader initialized with:", {
        fontFacesCount: this.fontFaces.length,
        fontData: family
      });
    } catch (error) {
      console.error("Error in FontLoader constructor:", error);
      throw error;
    }
  }

  private initializeFontFaces(family: IFontData[]): FontFace[] {
    if (!Array.isArray(family)) {
      console.error("Invalid font family data provided:", family);
      toast.error("Invalid font family data provided.");
      return [];
    }

    console.log("Initializing font faces with:", family);

    return family
      .map((font, index) => {
        try {
          return this.createFontFace(font, index);
        } catch (error) {
          console.error(`Failed to create font face for index ${index}:`, error);
          return null;
        }
      })
      .filter((font): font is FontFace => font !== null);
  }

  private createFontFace(font: IFontData, index: number): FontFace | null {
    console.log(`Creating font face for ${font.name} at index ${index}`);

    if (!this.isValidFontData(font)) {
      console.error("Invalid font data:", font);
      return null;
    }

    try {
      const fontFace = new FontFace(
        this.sanitizeFontFamily(font.name),
        font.target
      );

      console.log(`Successfully created FontFace for ${font.name}`);
      return fontFace;
    } catch (error) {
      this.errorHandler.addFailedFont(font.name, error);
      return null;
    }
  }

  private isValidFontData(font: IFontData): boolean {
    return !!(
      font.name &&
      font.target &&
      typeof font.name === "string" &&
      font.target instanceof ArrayBuffer
    );
  }

  sanitizeFontFamily(family: string): string {
    return family
      .split(".")[0]
      .replace(/[^\w\s-]/g, "")
      .trim();
  }

  private sanitizeUrl(url: string): string {
    try {
      return new URL(url).toString();
    } catch {
      throw new Error("Invalid font URL");
    }
  }

  private sanitizeStyle(style?: string): string {
    const validStyles = ["normal", "italic", "oblique"];
    return validStyles.includes(style?.toLowerCase() || "")
      ? style!.toLowerCase()
      : "normal";
  }

  private normalizeWeight(weight?: string | number): string {
    if (!weight) return "400";

    const numWeight = Number(weight);
    if (isNaN(numWeight)) return "400";

    // Ensure weight is between 100-900 and divisible by 100
    return String(
      Math.min(900, Math.max(100, Math.round(numWeight / 100) * 100))
    );
  }

  async loadFonts(): Promise<void> {
    console.log("Starting loadFonts()");

    if (this.fontFaces.length === 0) {
      console.warn("No fonts to load");
      return;
    }

    const loadPromises = this.fontFaces.map(async (font) => {
      console.log(`Attempting to load font: ${font.family}`);

      if (this.loadedFonts.has(font.family)) {
        console.log(`Font ${font.family} already loaded, skipping`);
        return;
      }

      try {
        const loadedFont = await Promise.race([
          font.load(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Font loading timeout")), 5000)
          )
        ]);



        console.log(`Successfully loaded font: ${font.family}`);
        (document as any).fonts.add(loadedFont);
        this.loadedFonts.add(font.family);
      } catch (error) {
        this.errorHandler.addFailedFont(font.family, error);
      }
    });

    try {
      await Promise.all(loadPromises);
      console.log("All font loading promises resolved");
    } catch (error) {
      console.error("Error in batch font loading:", error);
    }

    try {
      await this.parseFonts();
      console.log("Font parsing completed successfully");
    } catch (error) {
      console.error("Error during font parsing:", error);
    }
  }

  private async parseFonts(): Promise<void> {
    for (const fontFace of this.fontFaces) {
      if (this.loadedFonts.has(fontFace.family)) {
        await this.parseFontWithOpenType(fontFace);
      }
    }
  }

  private async parseFontWithOpenType(fontFace: FontFace): Promise<void> {
    try {
      // Get the original ArrayBuffer that we stored during initialization
      const arrayBuffer = this.originalBuffers.get(fontFace.family);

      if (!arrayBuffer) {
        throw new Error(`No ArrayBuffer found for font: ${fontFace.family}`);
      }

      const font = opentype.parse(arrayBuffer);

      this.fontParsers.set(fontFace.family, font);

      console.log(`Successfully parsed font: ${fontFace.family}`);
    } catch (error) {
      console.error(`Error parsing font: ${fontFace.family}`, error);
      toast.error(`Failed to parse font: ${fontFace.family}`);
    }
  }

  isFontLoaded(family: string): boolean {
    return this.loadedFonts.has(family);
  }

  isFontFailed(family: string): boolean {
    return this.errorHandler.hasError(family);
  }

  isFontAvailable(family: string): boolean {

    let isAvailable: boolean = false

    document.fonts.ready.then(() => {
      if(document.fonts.check(`12px "${family}"`)) {
        isAvailable = true
      } else {
        isAvailable = false
      }
    })

    return isAvailable
  }

  getLoadedFonts(): string[] {
    return Array.from(this.loadedFonts);
  }

  getFailedFonts(): FontLoadError[] {
    const errors: FontLoadError[] = []

    this.errorHandler.failedFonts.forEach((error, fontFamily) => {
      const e = this.errorHandler.getError(fontFamily);
      if (e) {
        errors.push(e);
      }
    });

    return errors;

  }

  getFontError(family: string): FontLoadError | null {
    return this.errorHandler.getError(family);
  }

  getFontFaces(): FontFace[] {
    return this.fontFaces;
  }

  getFontData(family: string): any | null {
    return this.fontParsers.get(family) || null;
  }

  getGlyphData(family: string): GlyphData[] | null {
    console.log("Font parsers:", this.fontParsers);
    const font = this.fontParsers.get(family);

    if (!font) {
      console.error(`Font not found: ${family}`);
      return null;
    }

    const glyphData: GlyphData[] | null = [];

    for (let i = 0; i < font.glyphs.length; i++) {
      const glyph = font.glyphs.get(i);
      if (glyph.unicode !== undefined) {
        glyphData.push({
          name: glyph.name || "",
          unicode: glyph.unicode,
          index: glyph.index,
        });
      }
    }

    return glyphData;
  }

  getCmapData(family: string): Record<number, number> | null {
    console.log("Font parsers:", this.fontParsers);
    const font = this.fontParsers.get(family);
    if (!font) {
      console.error(`Font ${family} not parsed or not found`);
      return null;
    }

    return font.tables.cmap.glyphIndexMap;
  }
}

export default FontLoader;
