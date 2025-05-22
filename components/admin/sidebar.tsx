"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Archive,
  BarChart,
  Settings,
  ChevronDown,
  ChevronRight,
  UserCheck,
  CalendarClock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SidebarItemProps {
  icon: React.ReactNode
  title: string
  href: string
  isActive: boolean
}

const SidebarItem = ({ icon, title, href, isActive }: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        isActive ? "bg-primary-kujang text-primary-foreground" : "hover:bg-muted",
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  )
}

interface SidebarGroupProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}

const SidebarGroup = ({ title, icon, children, defaultOpen = false }: SidebarGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <span>{title}</span>
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6 pt-2">{children}</CollapsibleContent>
    </Collapsible>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex w-64 flex-col border-r bg-background">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">SIMTAMU</p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <nav className="flex flex-col gap-2">
          <SidebarItem
            icon={<LayoutDashboard className="h-5 w-5" />}
            title="Dashboard"
            href="/admin"
            isActive={pathname === "/admin"}
          />

          <SidebarGroup
            title="Data Tamu"
            icon={<Users className="h-5 w-5" />}
            defaultOpen={pathname.includes("/admin/tamu")}
          >
            <div className="flex flex-col gap-2">
              <SidebarItem
                icon={<CalendarClock className="h-4 w-4" />}
                title="Tamu Hari Ini"
                href="/admin/tamu/hari-ini"
                isActive={pathname === "/admin/tamu/hari-ini"}
              />
              <SidebarItem
                icon={<Users className="h-4 w-4" />}
                title="Semua Tamu"
                href="/admin/tamu/semua"
                isActive={pathname === "/admin/tamu/semua"}
              />
              <SidebarItem
                icon={<UserCheck className="h-4 w-4" />}
                title="Verifikasi Tamu"
                href="/admin/tamu/verifikasi"
                isActive={pathname === "/admin/tamu/verifikasi"}
              />
            </div>
          </SidebarGroup>

          <SidebarItem
            icon={<Archive className="h-5 w-5" />}
            title="Arsip Kunjungan"
            href="/admin/arsip"
            isActive={pathname === "/admin/arsip"}
          />

          <SidebarItem
            icon={<BarChart className="h-5 w-5" />}
            title="Statistik"
            href="/admin/statistik"
            isActive={pathname === "/admin/statistik"}
          />

          <SidebarItem
            icon={<Settings className="h-5 w-5" />}
            title="Pengaturan"
            href="/admin/settings"
            isActive={pathname === "/admin/settings"}
          />
        </nav>
      </div>
    </div>
  )
}
