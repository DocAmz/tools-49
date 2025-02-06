'use client'

import { useCallback, useState } from "react";
import { FontData, FontError, FontInfo, GlyphData } from "@/types/fonts";
import { FontSanitizer } from "../services/FontSanitizer";
import { FontLoader, sanitizeFamilyName } from "advanced-font-manager"

export const useFontUpload = () => {
  const [font, setFont] = useState<FontFace | null>(null);
  const [fontInfo, setFontInfo] = useState<FontInfo | null>(null);
  const [error, setError] = useState<FontError | null>(null);
  const [fontCMap, setFontCMap] = useState<Record<number, number> | null>(null);
  const [fontGlyphs, setFontGlyphs] = useState<GlyphData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [fontData, setFontData] = useState<FontData | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const loadFont = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setFile(file);

    console.log("Loading font:", file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      console.log("File loaded as ArrayBuffer:", arrayBuffer.byteLength);

      const loader = new FontLoader({
        useCache: false,
        useResolvers: false,
        debugLevel: 'debug',
      });

      console.log("FontLoader created");

      // First load the fonts
      await loader.loadFromBuffer(
        {
          fonts: [
            {
              buffer: arrayBuffer,
              family: sanitizeFamilyName(file.name) || "Failed"
            }
          ]
        }
      );
      console.log("Fonts loaded");

      const fontFace = loader.getFontFaces().find((face) => face.family === sanitizeFamilyName(file.name));

      if (!fontFace) {
        setError({
          type: "initial",
          message: "Font face not found",
        });
        return;
      }

      console.log("Font face found:", fontFace.family);

      const failed = loader.getFontFaceErrors(fontFace.family);
      console.log("Font face errors:", failed);

      setFont(fontFace);
      setFontInfo({
        family: fontFace.family,
        style: fontFace.style,
        weight: fontFace.weight,
        stretch: fontFace.stretch,
        unicodeRange: fontFace.unicodeRange,
        featureSettings: fontFace.featureSettings,
      });

      loader.parseFontFace(fontFace.family);

      // Now get the CMAP data
      // const cmap = loader.getCmapData(fontFace.family);
      //
      // if (cmap) {
      //   console.log("CMAP data loaded:", Object.keys(cmap).length, "entries");
      //   setFontCMap(cmap);
      // } else {
      //   console.warn("No CMAP data found for font:", fontFace.family);
      // }

      // Get the glyph data
      // const glyphs = loader.getGlyphData(fontFace.family);
      // if (glyphs) {
      //   console.log("Glyph data loaded:", glyphs.length, "glyphs");
      //   setFontGlyphs(glyphs);
      // } else {
      //   console.warn("No glyph data found for font:", fontFace.family);
      // }

      // Set the font data
      //const fontData = loader.getParsedFontFaces()

      //if (fontData) {
      //  console.log("Font data loaded:", fontData);
      //  setFontData(fontData as FontData);
      //} else {
      //  console.warn("No font data found for font:", fontFace.family);
      //}

      //if(failed) {
      //  console.error("Failed to load font:", failed);
      //  setError(failed);
      //} else {
      //  setError(null);
      //}

    } catch (err) {
      console.error("Font loading error:", err);
      setError({
        type: "initial",
        message: err instanceof Error ? err.message : String(err),
      });

      // Clear any partial data
      setFont(null);
      setFontInfo(null);
      setFontCMap(null);
      setFontGlyphs(null);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, []);

  /**
  const sanitizeFont = async () => {
    setLoading(true);

    const sanitizer = new FontSanitizer()

    if(!file) {
      return;
    }

    const arrayBuffer = await file.arrayBuffer();

    const result = await sanitizer.sanitizeFont(arrayBuffer);
    try {
      if(result.success && result.font) {
        const loader = new FontLoader([
          {
            name: file.name,
            target: result.font,
          },
        ])

        await loader.loadFonts()

        const fontFace = loader
          .getFontFaces()
          .find((face) => face.family === loader.sanitizeFontFamily(file.name));

        if (!fontFace) {
          setError({
            type: "initial",
            message: "Font face not found",
          });
          return;
        }

        console.log("Font face found:", fontFace.family);

        const failed = loader.getFontError(fontFace.family);

        setFont(fontFace);
        setFontInfo({
          family: fontFace.family,
          style: fontFace.style,
          weight: fontFace.weight,
          stretch: fontFace.stretch,
          unicodeRange: fontFace.unicodeRange,
          featureSettings: fontFace.featureSettings,
        });

          // Now get the CMAP data
        const cmap = loader.getCmapData(fontFace.family);
        if (cmap) {
          console.log("CMAP data loaded:", Object.keys(cmap).length, "entries");
          setFontCMap(cmap);
        } else {
          console.warn("No CMAP data found for font:", fontFace.family);
        }

        // Get the glyph data
        const glyphs = loader.getGlyphData(fontFace.family);
        if (glyphs) {
          console.log("Glyph data loaded:", glyphs.length, "glyphs");
          setFontGlyphs(glyphs);
        } else {
          console.warn("No glyph data found for font:", fontFace.family);
        }

        // Set the font data
        const fontData = loader.getFontData(fontFace.family);
        if (fontData) {
          console.log("Font data loaded:", fontData);
          setFontData(fontData as FontData);
        } else {
          console.warn("No font data found for font:", fontFace.family);
        }

        if(failed) {
          console.error("Failed to load font:", failed);
          setError(failed);
        } else {
          setError(null);
        }

      } else {
        setError({
          type: "sanitization",
          message: result.message,
          details: result.errors
        })
      }
    } catch(error: any) {
      setError({
        type: "sanitizer",
        message: "Font face not found",
        details: [error.message ?? String(error)]
      });

      console.error("Font sanitization failed:", error)
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }
*/
  const clearFont = () => {
    setFont(null);
    setFontInfo(null);
    setFontCMap(null);
    setFontGlyphs(null);
    setFontData(null);
  }

  const getFontFile = () => {
    if (!font) return null;

    return new File([file as Blob], font.family, {
      type: file?.type,
      lastModified: file?.lastModified,
    });
  }

  return {
    font,
    fontInfo,
    error,
    loadFont,
    fontCMap,
    fontGlyphs,
    loading,
    fontData,
    clearFont,
    getFontFile,
    //sanitizeFont,
    // Add helper method to check if all data is loaded
    isComplete: !!(font && fontInfo && fontCMap && fontGlyphs)
  };
};