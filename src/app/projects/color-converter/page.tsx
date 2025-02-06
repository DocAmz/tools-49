"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ColorConverter } from "@/features/color-converter/colorConverter"
import EditorToolbar from "@/features/editor/components/editorToolbar"
import { Editor } from "@/features/editor/editor"

export default function PageEditor() {

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <ColorConverter />
    </div>
  )
}

