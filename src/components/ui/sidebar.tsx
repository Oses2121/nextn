"use client"

import * as React from "react"

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}

export function useSidebar() {
    return {
        state: "expanded",
        open: true,
        setOpen: () => {},
        openMobile: false,
        setOpenMobile: () => {},
        isMobile: false,
        toggleSidebar: () => {},
    }
}

export function Sidebar({ children }: { children: React.ReactNode }) {
    return <div className="hidden">{children}</div>
}

export function SidebarInset({ children }: { children: React.ReactNode }) {
    return <main>{children}</main>
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
    return <div className="hidden">{children}</div>
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
    return <div className="hidden">{children}</div>
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
    return <div className="hidden">{children}</div>
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
    return <div className="hidden">{children}</div>
}

export function SidebarMenuButton({ children }: { children: React.ReactNode }) {
    return <div className="hidden">{children}</div>
}
