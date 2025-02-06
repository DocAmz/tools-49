import { fontLoader } from "advanced-font-manager";

export async function loadFont(file, arrayBuffer, url) {
  return new Promise(async (resolve, reject) => {
    const result = [];
    const fontName = "Font-name";

    const loader = new fontLoader(
      {
        useResolver: true,
        disableWarning: false,
        debugLevel: 'warn',
      },
      [
        {
          type: "metrics",
          rule: {
            check: (font) => {
              if (font.descender < 0) {
                return true;
              } else {
                return false;
              }
            },
            fix: (font) => {
              font.descender = -font.descender;
              return font;
            },
            severity: "error",
          },
          message: "Descender should be negative",
        },
      ]
    );

    const loadListener = loader.on("fontFamillyLoaded", (key, value) => {
      result.push(key);
    });

    await loader.loadFromFile([{ name: fontName, font: file, options: {} }], {
      timeOut: 2000,
    });
    await loader.loadFromBuffer(
      [{ name: fontName, font: arrayBuffer, options: {} }],
      { timeOut: 2000 }
    );
    await loader.loadFromUrl([{ name: fontName, font: url, options: {} }], {
      timeOut: 2000,
    });

    loadListener();

    if (loader.isFontFailed(fontName)) {
      reject(loader.getFontError(fontName));
    }

    const fontFaces = loader.getFontFaces();
    const fontData = loader.getFontData(fontName);
    const glyphs = loader.getGlyphData(fontName);

    if (loader.isAvailable(fontName)) {
      resolve(
        result.map((fontname) => {
          return {
            fontFamily: fontname,
            fontData: fontData,
            glyphs: glyphs,
          };
        })
      );
    }
  });
}
