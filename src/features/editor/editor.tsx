"use client"
import * as fabric from "fabric";
import { useCanvas } from "./hook/useCanvas";
import { useEffect, useRef } from "react";
import { editorStore } from "./store/editorStore";

export const Editor = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const CONTAINER = containerRef.current;
    if (!CONTAINER) return;

    const canvas = new fabric.Canvas("editor-canvas", {
      width: CONTAINER.clientWidth,
      height: CONTAINER.clientHeight,
    });

    const rect = new fabric.Rect({
      left: CONTAINER.clientWidth / 2 - 300,
      top: CONTAINER.clientHeight / 2 - 300,
      fill: "blue",
      width: 600,
      height: 600,
    });

    editorStore.setCanvas(canvas);
    editorStore.setContainerRef(containerRef.current);

    canvas.add(rect);
    canvas.renderAll();

    return () => {
      canvas.dispose();
    };

  }, []);


  return (
    <div className="h-full w-full" ref={containerRef}>
      <canvas  id="editor-canvas"/>
    </div>
  );
};
