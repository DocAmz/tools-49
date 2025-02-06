import { useState } from "react"
import ColorPicker from "react-pick-color";
import { hexToRgb, rgbToHex, rgbToLab, rgbToHsl, rgbToHsb, rbgToXyz, rgbToCmyk } from './utils/convertions'
import { getColorHarmonies } from "./utils/harmonies";
import { getContrastRatio } from "./utils/contrast";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { set } from "mobx";
import { CMYKColor, RGBColor } from "./types/colors";


const CustomColorPicker = () => {
  const [color, setColor] = useState("#4D7247")
  const [colorName, setColorName] = useState("Fern green")
  const [activeTab, setActiveTab] = useState("conversion")
  const [rgb, setRgb] = useState<RGBColor>({ r: 0, g: 0, b: 0 })
  const [cmyk, setCmyk] = useState<CMYKColor>({ c: 0, m: 0, y: 0, k: 0 })
  const [hsl, setHsl] = useState({ h: 0, s: 0, l: 0 })


  const harmonies = getColorHarmonies(color)
  const contrastWithWhite = getContrastRatio(color, "#FFFFFF")
  const contrastWithBlack = getContrastRatio(color, "#000000")

  const handleColorChange = (() => {
    let timeout: NodeJS.Timeout;

    return async (color: string) => {
      if (!color) return;
      setColor(color);

      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        let colorTag = color.replace('#', '');
        const colorData = await fetch(`https://www.thecolorapi.com/id?hex=${colorTag}`);

        if (colorData.ok) {
          const colorJson = await colorData.json();

          console.log(colorJson);
          const rgb = colorJson.rgb;
          const cmyk = colorJson.cmyk;

          setColorName(colorJson.name.value);
          setRgb({ r: rgb.r, g: rgb.g, b: rgb.b });
          setCmyk({ c: cmyk.c, m: cmyk.m, y: cmyk.y, k: cmyk.k });
          setHsl(colorJson.hsl.fraction);
        }
      }, 300); // Adjust the debounce delay as needed
    };
  })();


  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="container relative border flex">
        <div className="bg-background h-full w-[50%] flex flex-col items-center justify-center" style={{background: color}}>
          { color && <div className="right-0 p-4 font-bold text-xl opacity-50 text-center" style={{ color:contrastWithWhite > 4.5 ? '#fff' : '#000' }}>{color}</div> }
          { colorName && <div className="right-0 p-4 font-extrabold text-3xl text-center" style={{ color:contrastWithWhite > 4.5 ? '#fff' : '#000' }}>{colorName}</div> }
        </div>
        <div className="bg-background h-full w-[50%] p-4">
          <ColorPicker
            color={color}
            onChange={(color) => handleColorChange(color.hex)}
            hideInputs={true}
            hideAlpha={true}
            theme={{
              borderColor: "hsl(var(--border))",
              borderRadius: "var(--radius)",
              background: "hsl(var(--card))",
              inputBackground: "white",
              color: "hsl(var(--foreground))",
              width: "100%",
            }}
          />
          <Input
            value={color}
            defaultValue={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="bg-background text-black"
            />
        </div>
      </div>
      <div className="container relative border flex">
      <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
            <TabsTrigger value="contrast">Contrast</TabsTrigger>
            <TabsTrigger value="harmonies">Harmonies</TabsTrigger>
          </TabsList>

          <TabsContent value="conversion">
            <Card>
              <CardHeader>
                <CardTitle>Color Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <Label>RGB</Label>
                    <p className="text-lg">{`${rgb.r}, ${rgb.g}, ${rgb.b}`}</p>
                  </div>
                  <div>
                    <Label>CMYK</Label>
                    <p className="text-lg">{`${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contrast">
            <Card>
              <CardHeader>
                <CardTitle>Contrast Checker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">On White</h3>
                    <div className="bg-white p-4 rounded-lg">
                      <p style={{ color }}>Sample Text</p>
                    </div>
                    <p className="mt-2">Contrast ratio: {contrastWithWhite}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">On Black</h3>
                    <div className="bg-black p-4 rounded-lg">
                      <p style={{ color }}>Sample Text</p>
                    </div>
                    <p className="mt-2">Contrast ratio: {contrastWithBlack}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="harmonies">
            <Card>
              <CardHeader>
                <CardTitle>Color Harmonies</CardTitle>
              </CardHeader>
              <CardContent>
                {harmonies && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Analogous</h3>
                      <div className="flex gap-2">
                        {harmonies.analogous.map((c, i) => (
                          <div key={i} className="w-20 h-20 rounded" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Complementary</h3>
                      <div className="flex gap-2">
                        {harmonies.complementary.map((c, i) => (
                          <div key={i} className="w-20 h-20 rounded" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Triadic</h3>
                      <div className="flex gap-2">
                        {harmonies.triadic.map((c, i) => (
                          <div key={i} className="w-20 h-20 rounded" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Tetradic</h3>
                      <div className="flex gap-2">
                        {harmonies.tetradic.map((c, i) => (
                          <div key={i} className="w-20 h-20 rounded" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

    </div>

  )
}

export default CustomColorPicker