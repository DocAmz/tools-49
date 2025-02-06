'use client'

import * as React from 'react'
import { Calculator, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const COMMON_RATIOS = [
  { label: 'HD TV, iPhone 6 plus (16:9)', width: 1920, height: 1080 },
  { label: '4K Ultra HD (16:9)', width: 3840, height: 2160 },
  { label: 'Instagram Square (1:1)', width: 1080, height: 1080 },
  { label: 'Instagram Portrait (4:5)', width: 1080, height: 1350 },
  { label: 'YouTube Thumbnail (16:9)', width: 1280, height: 720 },
]

export default function AspectRatioCalculator() {
  const [dimensions, setDimensions] = React.useState({
    w1: 1920,
    h1: 1080,
    w2: '',
    h2: '',
  })
  const [roundResults, setRoundResults] = React.useState(true)

  const calculateMissingDimension = React.useCallback(() => {
    const { w1, h1, w2, h2 } = dimensions

    if (w2 && !h2) {
      const newHeight = (Number(h1) / Number(w1)) * Number(w2)
      return setDimensions(prev => ({
        ...prev,
        h2: roundResults ? Math.round(newHeight).toString() : newHeight.toString()
      }))
    }

    if (h2 && !w2) {
      const newWidth = (Number(w1) / Number(h1)) * Number(h2)
      return setDimensions(prev => ({
        ...prev,
        w2: roundResults ? Math.round(newWidth).toString() : newWidth.toString()
      }))
    }
  }, [dimensions, roundResults])

  const resetValues = () => {
    setDimensions({
      w1: 1920,
      h1: 1080,
      w2: '',
      h2: '',
    })
  }

  const handlePresetChange = (value: string) => {
    const [width, height] = value.split('x').map(Number)
    setDimensions(prev => ({
      ...prev,
      w1: width,
      h1: height,
      w2: '',
      h2: '',
    }))
  }

  const aspectRatio = React.useMemo(() => {
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b)
    }

    const w = Number(dimensions.w1)
    const h = Number(dimensions.h1)
    const divisor = gcd(w, h)

    return `${w / divisor}:${h / divisor}`
  }, [dimensions.w1, dimensions.h1])

  React.useEffect(() => {
    calculateMissingDimension()
  }, [dimensions.w1, dimensions.h1, dimensions.w2, dimensions.h2, calculateMissingDimension])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <Calculator className="h-8 w-8" />
          Aspect Ratio Calculator
        </CardTitle>
        <CardDescription>
          Calculate the missing value for a particular aspect ratio. Perfect for resizing photos or video while maintaining proportions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="original-width">Original Width (W₁)</Label>
              <Input
                id="original-width"
                type="number"
                value={dimensions.w1}
                onChange={(e) => setDimensions(prev => ({ ...prev, w1: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="original-height">Original Height (H₁)</Label>
              <Input
                id="original-height"
                type="number"
                value={dimensions.h1}
                onChange={(e) => setDimensions(prev => ({ ...prev, h1: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-width">New Width (W₂)</Label>
              <Input
                id="new-width"
                type="number"
                value={dimensions.w2}
                onChange={(e) => setDimensions(prev => ({ ...prev, w2: e.target.value, h2: '' }))}
                placeholder="Enter new width"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-height">New Height (H₂)</Label>
              <Input
                id="new-height"
                type="number"
                value={dimensions.h2}
                onChange={(e) => setDimensions(prev => ({ ...prev, h2: e.target.value, w2: '' }))}
                placeholder="Enter new height"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="preset">Common Ratios</Label>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetValues}
              className="h-8 w-8"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Reset values</span>
            </Button>
          </div>
          <Select
            onValueChange={handlePresetChange}
            value={`${dimensions.w1}x${dimensions.h1}`}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a preset ratio" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_RATIOS.map((ratio) => (
                <SelectItem
                  key={`${ratio.width}x${ratio.height}`}
                  value={`${ratio.width}x${ratio.height}`}
                >
                  {ratio.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              id="round-results"
              checked={roundResults}
              onCheckedChange={setRoundResults}
            />
            <Label htmlFor="round-results">Round results to whole numbers</Label>
          </div>
          <div className="text-sm">
            Current Ratio: <span className="font-mono font-medium">{aspectRatio}</span>
          </div>
        </div>

        <div className="rounded-lg border bg-muted p-4">
          <h3 className="font-medium mb-2">Formula</h3>
          <p className="text-sm text-muted-foreground font-mono">
            (original height / original width) × new width = new height
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Example: A 1600×1200 photo resized to 400 pixels wide:
            <br />
            <span className="font-mono">(1200 / 1600) × 400 = 300</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

