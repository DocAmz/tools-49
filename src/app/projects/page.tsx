"use client"

import { useState } from "react"
import Link from "next/link"
import { Beaker, ChevronDown, ChevronRight, ExternalLink, ImageIcon, Palette, Pencil, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

type TtoolCategories = {
    name: string
    icon: JSX.Element
    tools: {
      name: string
      description: string
      link: string
      label?: string
    }[]
  }


// Sample data for tool categories and tools
const toolCategories: TtoolCategories[] = [
  {
    name: "Images",
    icon: <ImageIcon />,
    tools: [
      {
        name: "Aspect Ratio Calculator",
        description: "Calculate the missing value for a particular aspect ratio. Perfect for resizing photos or video while maintaining proportions.",
        link: "/projects/calculator"
      },
      {
        name: "Image Comparison Tool",
        description: "Compare two images and get a diff files. With treshold setting",
        link: "/projects/comparing"
      },
    ],
  },
  {
    name: "Fonts",
    icon: <Type />,
    tools: [
      {
        label: "WIP",
        name: "Font Inspector",
        description: "Full build opentype JS font inspector with the abilitie to resolve failed font loading",
        link: "/projects/font-inspector" },
    ],
  },
  {
    name: "Colors",
    icon: <Palette />,
    tools: [
      {
        label: "WIP",
        name: "ICC Color converter",
        description: "Convert two a color in a selected ICC color file",
        link: "/projects/color-converter"
      },
      {
        label: "New",
        name: "Color picker",
        description: "Advanced color picker for color creation",
        link: "/projects/color-picker"
      },
    ],
  },
  {
    name: "Canvas",
    icon: <Pencil />,
    tools: [
      {
        label: "WIP",
        name: "Canvas editor",
        description: "Fabric.JS based canvas éditor",
        link: "/projects/editor"
      },
    ],
  },
]

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(toolCategories[0].name)
  const router = useRouter()

  return (
    <div className="w-full h-full">
    <SidebarProvider>
      <div className="flex h-full overflow-hidden">
        <Sidebar className="w-64 border-r pt-20 bg-card">
          <SidebarHeader className="h-14 flex items-center px-4">
            <Link className="flex items-center justify-center" href="/">
              <Beaker className="h-6 w-6 mr-2" />
              <span className="font-bold">Tools Lab</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {toolCategories.map((category) => (
                <Collapsible key={category.name}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton onClick={() => setSelectedCategory(category.name)} variant={selectedCategory === category.name ? "outline" : "default"}>
                        {category.icon}
                        {category.name}
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {category.tools.map((tool) => (
                          <SidebarMenuSubItem key={tool.name}>
                            <SidebarMenuSubButton onClick={() => router.push(tool.link)}>
                              {tool.name}
                              { tool.label && <span className={`ml-2 w-fit text-xs ${tool.label === 'WIP' ? 'bg-red-500' : 'bg-green-500'} text-white px-1.5 rounded`}>{tool.label}</span> }
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-3xl font-bold mb-6 flex gap-3 items-center">
            {toolCategories.find((category) => category.name === selectedCategory)?.icon}
            {selectedCategory} Tools
          </h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {toolCategories
              .find((category) => category.name === selectedCategory)
              ?.tools.map((tool) => (
                <Card key={tool.name}>
                  <CardHeader>
                    <CardTitle>
                      {tool.name}
                      { tool.label && <span className={`ml-2 w-fit text-xs ${tool.label === 'WIP' ? 'bg-red-500' : 'bg-green-500'} text-white px-1.5 rounded`}>{tool.label}</span> }
                      </CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>{/* You can add an icon or image for each tool here */}</CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant={'link'} asChild>
                      <Link href={tool.link}>
                        Open Tool
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
    </div>
  )
}

