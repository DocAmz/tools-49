import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="z-50 fixed bg-card bottom-0 border-t max-w-screen w-full p-4 flex flex-col sm:flex-row items-center justify-between">
    <p className="text-xs text-gray-500 dark:text-gray-400">
      © {new Date().getFullYear()} Tools Lab. All rights reserved.
    </p>
    <nav className="sm:ml-auto flex gap-4 sm:gap-6">
      <Link className="text-xs hover:underline underline-offset-4" href="#">
        Terms of Service
      </Link>
      <Link className="text-xs hover:underline underline-offset-4" href="#">
        Privacy
      </Link>
    </nav>
  </footer>
  )
}