"use client"

declare global {
  interface Window {
    canvas: fabric.Canvas | null;
  }
}

import { MutableRefObject, useCallback, useEffect, useRef } from "react"
import * as fabric from "fabric"

interface IUseCanvasProps {
  init: (canvas: fabric.Canvas) => Promise<void> | void
  saveState?: boolean
  deps?: any[]
}

export const useCanvas = (init: (canvas: fabric.Canvas) => Promise<void> | void, saveState = true, deps =[]) => {
  const elementRef = useRef<MutableRefObject<HTMLCanvasElement| null>>(null)
  const fc = useRef<null | fabric.Canvas >(null)
  const data = useRef(null)

  const setRef = useCallback((element: HTMLCanvasElement ) => {
    elementRef.current = element

    if(saveState && fc.current) {
      data.current = fc.current.toJSON()
    }

    fc.current?.dispose()

    if(!element) {
      fc.current = null
      return
    }

    const canvas = new fabric.Canvas(element, { backgroundColor: "white" })

    window.canvas = fc.current = canvas
    fc.current = canvas
    init && init(canvas)

    if(saveState && data.current) {
      canvas.loadFromJSON(data.current)
    }
  }, [saveState, ...deps])

  useEffect(() => {
    return () => {
      if (saveState && fc.current) {
        data.current = fc.current.toJSON();
      }

      if(!elementRef.current) {
        fc.current?.dispose()
        fc.current = null
      }
    }
  }, [saveState])

  return [fc, setRef]
}