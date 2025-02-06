"use client"

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Code, Cpu, Globe } from "lucide-react";
import { useTheme } from "next-themes";

const NavBarSection = () => {

  const { theme } = useTheme()
  const BACKGROUND = theme === 'dark' ? '#020617' : '#E3F2FD'

  return (
    <div className="z-50 fixed top-0 w-screen flex justify-between items-center p-4 bg-card border-b"
    >
      <div className="flex items-center gap-4">
        <Link href="/">
          <span className="flex items-center gap-2">
            <Cpu size={24} />
            <span className="font-bold">Tools Lab</span>
          </span>
        </Link>
      </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button variant={'ghost'} asChild>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/projects">
            Tools
          </Link>
          </Button>
        <Button variant={'ghost'} asChild>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/scripts">
            Script
          </Link>
          </Button>
        </nav>
        <div className="flex items-center gap-4">
        <ThemeToggle variant="icon" />
      </div>
    </div>
  );
};

export default NavBarSection;