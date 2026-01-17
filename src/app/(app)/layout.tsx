import type { ReactNode } from "react"
import Link from "next/link"
import { BarChartBig } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Header } from "@/components/header"
import { MainNav } from "@/components/main-nav"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg group">
            <BarChartBig className="h-7 w-7 text-primary" />
            <span className="group-data-[collapsible=icon]:hidden">BizSight</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-muted/40">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
