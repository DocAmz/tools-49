import type { Metadata } from "next"
import { Bricolage_Grotesque, Poppins } from 'next/font/google'
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import Sidebar from "@/components/Sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import NavBarSection from "@/Sections/NavbarSection"

const bricolage = Bricolage_Grotesque({
  weight: ['400', '600', '700'],
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "TechInnovate | Cutting-edge Solutions",
  description: "Innovating the future with AI, cloud computing, and custom software solutions.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={bricolage.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
           {/* Navbar Section */}
           <NavBarSection />
              <main className="flex-1 overflow-auto" style={{width: 'calc(100vw)' }}>{
              children
            }</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

