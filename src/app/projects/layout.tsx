import Sidebar from "@/components/Sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ReactNode } from "react"


export default function ProjectLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
    <div className="flex bg-gradient-to-br from-background to-secondary dark:bg-dots-dark bg-dots-light">
      <main className="flex-1 overflow-auto" style={{width: 'calc(100vw)' }}>{children}</main>
    </div>
  </SidebarProvider>
  )
}