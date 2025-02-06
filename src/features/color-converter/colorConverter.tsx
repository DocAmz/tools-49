"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ColorPicker from "react-pick-color";
import ProfileSelect from "./components/ProfileSelect";

// Helper function to convert RGB to CMYK
function rgbToCmyk(r: number, g: number, b: number) {
  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;
  const k = Math.min(c, m, y);

  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null;
}

export function ColorConverter() {
  const [color, setColor] = useState("#FFFFFF");
  const [profile, setProfile] = useState<string>("Cmyk Adobe Coated Fogra39");
  const [cmyk, setCmyk] = useState({ c: 0, m: 0, y: 0, k: 0 });
  const [iccCmyk, setIccCmyk] = useState({ c: 0, m: 0, y: 0, k: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const iccProcess = async (rgb: { r: number; g: number; b: number }, profile: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputProfile: "Rgb Adobe 1998", outputProfile: profile, rgb: { r: rgb.r, g: rgb.g, b: rgb.b } }),
      });

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      // Parse the response as JSON
      const data = await response.json();
      return data as { original: { r: number; g: number; b: number }; processed: number[] };
    } catch (error) {
      console.error("ICC conversion error:", error);
      setError(error instanceof Error ? error.message : "Failed to process color");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update the useEffect to handle async conversion
  useEffect(() => {
    const rgb = hexToRgb(color);
    if (rgb) {
      const newCmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      setCmyk(newCmyk);

      // Use an async function inside useEffect
      const convertColor = async () => {
        const iccResult = await iccProcess(rgb, profile);
        const cmykArray = iccResult ? iccResult.processed : [0, 0, 0, 0];
        setIccCmyk({
          c: cmykArray[0],
          m: cmykArray[1],
          y: cmykArray[2],
          k: cmykArray[3],
        });
      };

      convertColor();
    }
  }, [color, profile]);

  const handleSelectProfile = (profile: string) => {
    setProfile(profile);
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto gap-8 p-4">
      <Card className="flex-1 rounded-none">
        <CardHeader>
          <CardTitle>Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfileSelect profile={profile} onSelect={handleSelectProfile} />

          <ColorPicker
            color={color}
            onChange={(color) => setColor(color.hex)}
            theme={{
              borderColor: "hsl(var(--border))",
              borderRadius: "var(--radius)",
              background: "hsl(var(--card))",
              inputBackground: "white",
              color: "hsl(var(--foreground))",
              width: "100%",
            }}
            presets={[
              {
                a: 0.1,
                b: 0,
                g: 0,
                r: 0,
              },
              "red",
              "blue",
              "green",
              "yellow",
              "crimson",
              "grey",
              "lightgrey",
              "white",
              "#000",
              "purple",
              "papayawhip",
              "lightgreen",
              "pink",
            ]}
          />
        </CardContent>
      </Card>

      <Card className="flex-1 rounded-none">
        <CardHeader>
          <CardTitle>Output</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full aspect-square" style={{ backgroundColor: color }}></div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Original Color</h3>
              <p>HEX: {color}</p>
              <p>RGB: {Object.values(hexToRgb(color) || {}).join(", ")}</p>
            </div>
            <div>
              <h3 className="font-semibold">Mathematical CMYK</h3>
              <p>C: {cmyk.c}%</p>
              <p>M: {cmyk.m}%</p>
              <p>Y: {cmyk.y}%</p>
              <p>K: {cmyk.k}%</p>
            </div>
            <div>
              <h3 className="font-semibold">ICC Profile CMYK</h3>
              {error ? (
                <pre className="text-red-500">{error}</pre>
              ) : (
                <>
                  <p>C: {loading ? "Loading..." : iccCmyk.c}%</p>
                  <p>M: {loading ? "Loading..." : iccCmyk.m}%</p>
                  <p>Y: {loading ? "Loading..." : iccCmyk.y}%</p>
                  <p>K: {loading ? "Loading..." : iccCmyk.k}%</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}