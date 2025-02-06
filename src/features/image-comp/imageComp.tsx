"use client";

import { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import diffImagePixelMatcher from "./utils/diffImage";
import { ArrowLeft, Download, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import ImageAddition from "./components/imageAdd";
import { Badge } from "@/components/ui/badge";

export default function ImageComparisonTool() {
  const [leftImage, setLeftImage] = useState<string | null>(null);
  const [rightImage, setRightImage] = useState<string | null>(null);
  const [diffImage, setDiffImage] = useState<string | null>(null);
  const [diffPixels, setDiffPixels] = useState<number | null>(null);
  const [threshold, setThreshold] = useState<number>(0.1);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const leftCanvasRef = useRef<HTMLCanvasElement>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement>(null);
  const diffCanvasRef = useRef<HTMLCanvasElement>(null);

  const loadImageToCanvas = (
    imageUrl: string,
    canvas: HTMLCanvasElement
  ): Promise<void> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        resolve();
      };
      img.src = imageUrl;
    });
  };

  const handleImageUpload = (
    side: "left" | "right",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (side === "left") {
          setLeftImage(e.target?.result as string);
        } else {
          setRightImage(e.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (side: "left" | "right") => {
    if (side === "left") {
      setLeftImage(null);
    } else {
      setRightImage(null);
    }
    setDiffImage(null);
    setDiffPixels(null);
  };

  const compareImages = async () => {
    if (
      !leftImage ||
      !rightImage ||
      !leftCanvasRef.current ||
      !rightCanvasRef.current ||
      !diffCanvasRef.current
    )
      return;

    // Load images to canvases
    await loadImageToCanvas(leftImage, leftCanvasRef.current);
    await loadImageToCanvas(rightImage, rightCanvasRef.current);

    const width = leftCanvasRef.current.width;
    const height = leftCanvasRef.current.height;
    setDimensions({ width, height });

    // Get image data
    const leftCtx = leftCanvasRef.current.getContext("2d");
    const rightCtx = rightCanvasRef.current.getContext("2d");
    const diffCtx = diffCanvasRef.current.getContext("2d");

    if (!leftCtx || !rightCtx || !diffCtx) return;

    const leftData = leftCtx.getImageData(0, 0, width, height);
    const rightData = rightCtx.getImageData(0, 0, width, height);

    // Set dimensions for diff canvas
    diffCanvasRef.current.width = width;
    diffCanvasRef.current.height = height;

    const diffData = diffCtx.createImageData(width, height);

    // Compare images
    const diff = diffImagePixelMatcher(
      leftData.data,
      rightData.data,
      diffData.data,
      width,
      height,
      {
        threshold: threshold,
        alpha: 0.5,
        includeAA: true,
        diffColor: [255, 0, 0],
        aaColor: [255, 255, 0],
        diffColorAlt: [0, 255, 0],
        diffMask: false,
      }
    );

    console.log("Number of pixels that differ:", diff);
    console.log("Diff data:", diffData);

    // Draw diff image
    diffCtx.putImageData(diffData, 0, 0);

    const diffDataUrl = diffCanvasRef.current.toDataURL("image/png");

    console.log("Diff data URL:", diffDataUrl);

    setDiffImage(diffDataUrl);
    setDiffPixels(diff);
  };

  useEffect(() => {
    if (leftImage && rightImage) {
      compareImages();
    }
  }, [threshold]);

  useEffect(() => {
    if(!diffImage){
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [diffImage]);

  return (
    <div className="w-full h-screen p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Image Comparison Tool
      </h1>
      <div className="flex items-center justify-center space-x-4 gap-4">
      <Button
        variant={diffImage ? "default" : "secondary"}
        onClick={compareImages}
      >
          Compare Images
      </Button>
        <Button
          variant="destructive"
          className="flex items-center space-x-2"
          onClick={() => {
            setDiffImage(null);
            setDiffPixels(null);
          }}
          disabled={!diffImage}
        >
          <XCircle size={24} />
          Clear
        </Button>
        <Button
          variant="default"
          className="flex items-center space-x-2"
          disabled={!diffImage}
          onClick={() => {
            if (diffImage) {
              const a = document.createElement("a");
              a.href = diffImage;
              a.download = "diff-image.png";
              a.click();
            }
          }}
        >
          <Download size={24} />
          Download Diff Image
        </Button>
        <div className="space-y-2">
              <Label
                htmlFor="threshold-slider"
                className="text-lg font-semibold"
              >
                Comparison Threshold: {threshold.toFixed(2)}
              </Label>
              <Slider
                id="threshold-slider"
                min={0}
                max={1}
                step={0.01}
                value={[threshold]}
                onValueChange={(value) => setThreshold(value[0])}
              />
            </div>
      </div>
      <div className="w-full flex p-4 gap-4">
        <ImageAddition side="left" image={leftImage} handleImageUpload={handleImageUpload} clearImage={clearImage} expanded={isExpanded} />
        <ImageAddition side="right" image={rightImage} handleImageUpload={handleImageUpload} clearImage={clearImage} expanded={isExpanded} />
      </div>
      <div className="space-y-8">
        {diffImage && (
          <div className="p-6 rounded-lg space-y-4">
            <h2 className="text-2xl font-semibold">Comparison Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="mb-8">
                <p className="text-xl">
                  Number of pixels that differ:{" "}
                  <span className="font-bold">{diffPixels}</span>
                </p>
                {dimensions && (
                  <p className="text-xl mt-2">
                    Percentage of difference:{" "}
                    <Badge className="font-bold text-2xl"
                      variant={diffPixels ? "default" : "destructive"}
                    >
                      {(
                        ((diffPixels || 0) /
                          (dimensions.width * dimensions.height)) *
                        100
                      ).toFixed(2)}
                      %
                    </Badge>
                  </p>
                )}
              </div>
                <div className="flex justify-center items-center p-6 relative">
                  <Image
                    src={diffImage}
                    alt="Difference image"
                    width={dimensions?.width}
                    height={dimensions?.height}
                    objectFit="contain"
                  />
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
      <div className="hidden">
        <canvas ref={leftCanvasRef} />
        <canvas ref={rightCanvasRef} />
        <canvas ref={diffCanvasRef} />
      </div>
    </div>
  );
}
