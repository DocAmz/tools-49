"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface GlyphDialogProps {
  glyph: {
    name: string
    unicode?: number
    index: number
  }
  fontFamily: string
}

export function GlyphDialog({ glyph, fontFamily }: GlyphDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-full w-full p-0 bg-card-background">
          <div
            className="flex h-24 w-24 items-center justify-center text-4xl"
            style={{ fontFamily }}
          >
            {String.fromCodePoint(glyph.unicode || 0)}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Glyph Details: {glyph.name}</DialogTitle>
          <DialogDescription>
            Inspect and edit the properties of this glyph.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <div
              className="flex h-32 w-32 items-center justify-center rounded-lg border text-6xl"
              style={{ fontFamily }}
            >
              {String.fromCodePoint(glyph.unicode || 0)}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={glyph.name} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unicode" className="text-right">
              Unicode
            </Label>
            <Input
              id="unicode"
              value={glyph.unicode ? glyph.unicode.toString(16).padStart(4, '0') : 'N/A'}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="index" className="text-right">
              Index
            </Label>
            <Input id="index" value={glyph.index} className="col-span-3" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
