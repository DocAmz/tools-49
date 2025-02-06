"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"

interface PlainViewProps {
  fontFamily: string
  isEditing: boolean
}

export function PlainView({ fontFamily, isEditing }: PlainViewProps) {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog")
  const [fontSize, setFontSize] = useState(32)
  const [lineHeight, setLineHeight] = useState(1.5)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Sample Text</Label>
        <Input value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label>Font Size: {fontSize}px</Label>
        <Slider
          min={8}
          max={120}
          step={1}
          value={[fontSize]}
          onValueChange={(value) => setFontSize(value[0])}
        />
      </div>
      <div className="space-y-2">
        <Label>Line Height: {lineHeight}</Label>
        <Slider
          min={0.75}
          max={2}
          step={0.25}
          value={[lineHeight]}
          onValueChange={(value) => setLineHeight(value[0])}
        />
      </div>
      <div
        className="rounded-lg border p-4"
        style={{
          fontFamily,
          fontSize: `${fontSize}px`,
          lineHeight,
        }}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
      >
        {text}
      </div>
    </div>
  )
}

