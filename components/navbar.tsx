"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Menu,
  X,
  User,
  LogOut,
  BarChart,
  Archive,
  LayoutDashboard,
  Settings,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const user = localStorage.getItem("user")
    setIsLoggedIn(!!user)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    window.location.href = "/"
  }

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Formulir Tamu", href: "/formulir" },
    { name: "Kontak", href: "/kontak" },
  ]

  const adminLinks = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { name: "Data Tamu", href: "/admin/tamu", icon: <User className="mr-2 h-4 w-4" /> },
    { name: "Arsip", href: "/admin/arsip", icon: <Archive className="mr-2 h-4 w-4" /> },
    { name: "Statistik", href: "/admin/statistik", icon: <BarChart className="mr-2 h-4 w-4" /> },
    { name: "Pengaturan", href: "/admin/settings", icon: <Settings className="mr-2 h-4 w-4" /> },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/simtamu-logos.svg"
              alt="SIMTAMU Logo"
              width={60}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-primary-kujang font-semibold"
                    : "text-gray-700 hover:text-primary-kujang dark:text-gray-300 dark:hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <ModeToggle />

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/images/avatar.png" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Admin</p>
                      <p className="text-xs leading-none text-muted-foreground">admin@pupukkujang.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {adminLinks.map((link) => (
                    <DropdownMenuItem key={link.name} asChild>
                      <Link href={link.href} className="cursor-pointer flex items-center">
                        {link.icon}
                        <span>{link.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" className="bg-primary-kujang hover:bg-primary-kujang/90">
                <Link href="/login">
                  <User className="mr-2 h-4 w-4" />
                  Login Admin
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Button */}
          <div className="flex md:hidden items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-kujang dark:text-gray-300 dark:hover:text-white"
            >
              <span className="sr-only">Toggle menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <div className="flex justify-end">
              <ModeToggle />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? "text-primary-kujang font-semibold"
                    : "text-gray-700 hover:text-primary-kujang dark:text-gray-300 dark:hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                {adminLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-kujang dark:text-gray-300 dark:hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon}
                    <span className="ml-2">{link.name}</span>
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="flex w-full items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-kujang dark:text-gray-300 dark:hover:text-white"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <Button asChild variant="default" className="w-full mt-2 bg-primary-kujang hover:bg-primary-kujang/90">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <User className="mr-2 h-4 w-4" />
                  Login Admin
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
