"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Github, Linkedin, Mail, Home, FileText, Briefcase, Sun, Moon, Subscript, Option, Eclipse } from 'lucide-react'
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { useTheme } from "next-themes"

export default function AppSidebar() {

  const { setTheme, theme } = useTheme()

  return (
    <Sidebar className="border-r border-secondary">
      <SidebarHeader className="flex flex-col items-center p-6">
        <div className="relative">
          <Avatar className="h-32 w-32 border-4 border-primary animate-float">
            <AvatarImage src="/user.png" alt="John Doe" />
            <AvatarFallback>DA</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 animate-pulse-glow">
            <div className="w-3 h-3 rounded-full bg-background"></div>
          </div>
        </div>
        <h1 className="mt-4 text-3xl font-bold bg-gradient-to-r from-blue-800 to-blue-500 bg-clip-text text-transparent">DocAmz</h1>
        <p className="text-sm text-muted-foreground">React software engineer</p>
        <div className="mt-6 flex space-x-2">
          <Button size="icon" variant="outline" className="rounded-full">
            <Github className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full">
            <Linkedin className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full justify-start">
              <Link href="/" className="flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full justify-start">
              <Link href="/resume" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Resume</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full justify-start">
              <Link href="/projects" className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4" />
                <span>Projects</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full justify-start">
              <Link href="/scripts" className="flex items-center space-x-2">
                <Subscript className="h-4 w-4" />
                <span>Scripts</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full justify-start">
              <Link href="/projects" className="flex items-center space-x-2">
                <Eclipse className="h-4 w-4" />
                <span>Other</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full justify-start cursor-pointer" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <div className="flex items-center space-x-2">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>Change Theme</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full justify-start">
              <Link href="/contact" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Contact</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <p className="text-xs text-muted-foreground text-center">© 2021 John Doe. All rights reserved.</p>
      </SidebarFooter>
    </Sidebar>
  )
}

