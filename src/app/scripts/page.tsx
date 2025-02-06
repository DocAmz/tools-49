"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import EditorToolbar from "@/features/editor/components/editorToolbar"
import { Editor } from "@/features/editor/editor"
import ScriptViewer from "@/features/script-viewer/scriptViewer"

export default function PageScripts() {

  return (
    <div className="w-full h-full">
      <ScriptViewer />
    </div>
  )
}

