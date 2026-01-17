"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, DollarSign, CreditCard, BarChart, Calendar } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/revenue", label: "Revenue", icon: DollarSign },
  { href: "/expenses", label: "Expenses", icon: CreditCard },
  { href: "/reports", label: "Reports", icon: BarChart },
  { href: "/calendar", label: "Calendar", icon: Calendar },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <Link href={link.href} legacyBehavior passHref>
            <SidebarMenuButton
              isActive={pathname.startsWith(link.href)}
              tooltip={link.label}
            >
              <link.icon />
              <span>{link.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
