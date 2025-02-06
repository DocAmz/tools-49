"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GlyphDialog } from "./glyph-dialog"

interface GlyphGridProps {
  glyphs: Array<{
    name: string
    unicode?: number
    index: number
  }>
  fontFamily: string
  isEditing: boolean
}

export function GlyphGrid({ glyphs, fontFamily, isEditing }: GlyphGridProps) {
  return (
    <div className="h-full w-full">
      <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
        {glyphs.map((glyph) => (
          <Card key={glyph.index} className="flex border-none shadow-none flex-col items-center justify-center p-4">
            <GlyphDialog glyph={glyph} fontFamily={fontFamily} />
            <CardContent className="p-2 text-center">
              <p className="text-sm font-medium">{glyph.name}</p>
              <p className="text-xs text-muted-foreground">
                {glyph.unicode ? glyph.unicode.toString(16).padStart(4, '0') : 'N/A'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

