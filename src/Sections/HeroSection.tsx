"use client"

import { useTheme } from "next-themes"
import { motion, useMotionTemplate, useMotionValue, animate } from "framer-motion"
import { useEffect, useMemo } from "react"
import { ArrowRight, GitBranchPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const HeroSection = () => {
  const { theme } = useTheme()

  const COLORS = useMemo(() => {return ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"]}, [])
  const BACKGROUND = theme === 'dark' ? '#020617' : '#E3F2FD'
  const color = useMotionValue(COLORS[0])
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, ${BACKGROUND} 50%, ${color})`
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;


  useEffect(() => {
    animate(color, COLORS, {
      ease: "easeInOut",
      duration: 4,
      repeat: Infinity,
      repeatType: "mirror"
    })
  }, [color, COLORS])

  return (
    <section className="w-full h-full">
          <div className="w-full flex flex-col items-center justify-center gap-10 space-y-4 text-center"
          style={{ height: 'calc(100vh - 68px)' }}
          >
            <div className="space-y-8 " >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none"
                style={{ fontSize: 'clamp(1.5rem, 5vw, 4rem)' }}
              >
                Welcome to the Tools Lab
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Explore, test, and contribute to my research and development projects.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild>
                <Link href="/projects">Explore Tools</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="https://p49.me">More projects</Link>
              </Button>
            </div>
          </div>
  </section>
  )
}

export default HeroSection