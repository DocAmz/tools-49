"use client"

import { Upload } from 'lucide-react'
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

interface DropZoneProps {
  onFileSelect: (file: File) => void
}

export function DropZone({ onFileSelect }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles?.[0]) {
      onFileSelect(acceptedFiles[0])
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'font/ttf': ['.ttf'],
      'font/otf': ['.otf'],
      'font/woff': ['.woff'],
      'font/woff2': ['.woff2'],
    },
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={`flex h-[80vh] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors
        ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
    >
      <input {...getInputProps()} />
      <Upload className="h-12 w-12 text-muted-foreground" />
      <h2 className="mt-4 text-xl font-semibold">Drop your font file here</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        or click to select a file (.ttf, .otf, .woff, .woff2)
      </p>
    </div>
  )
}

