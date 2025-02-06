"use client"

import { FontLoader, sanitizeFamilyName } from "advanced-font-manager"
import { useEffect, useState } from "react";

export default function PageTestLib() {
  const [font, setFont] = useState<FontFace | null>(null);
  const [file, setFile] = useState<File | undefined>(undefined);

  const loadFont = async (file: File) => {
    if (!file) {
      return;
    }

    const loader = new FontLoader({ debugLevel: 'info'}, []);
    const familyName: string = file.name ? sanitizeFamilyName(file.name.split('.')[0]) as string : "Test";

    await loader.loadFromBuffer({
      fonts: [
        {
          buffer: await file.arrayBuffer() as ArrayBuffer,
          family: familyName
        }
      ]
    });

    const fontFace = loader.getFontFaces().find((face) => face.family === familyName);

    if (!fontFace) {
      console.error("Font face not found");
      return;
    }

    setFont(fontFace);
  }

  useEffect(() => {
    if (file) {
      loadFont(file);
    }
  }, [file]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div>
        {font ? (
          <div className="text-center">
            {font.family}
            <h1
              style={{
                fontSize: "8rem",
                fontFamily: font.family,
              }}
            >Whereas disregard and contempt for human rights have resulted</h1>
          </div>
        ) : (
          <div>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
          </div>
        )}
      </div>
    </div>
  )
}

