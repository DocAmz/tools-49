"use client"

interface WaterfallViewProps {
  fontFamily: string
  isEditing: boolean
}

export function WaterfallView({ fontFamily, isEditing }: WaterfallViewProps) {
  const sizes = [8, 12, 16, 24, 32, 48, 64, 96]
  const text = "The quick brown fox jumps over the lazy dog"

  return (
    <div className="space-y-8">
      {sizes.map((size) => (
        <div key={size} className="space-y-2">
          <p className="text-sm text-muted-foreground">{size}px</p>
          <p
            style={{
              fontFamily,
              fontSize: size,
              lineHeight: 1.2,
            }}
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
          >
            {text}
          </p>
        </div>
      ))}
    </div>
  )
}

