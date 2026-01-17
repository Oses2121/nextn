import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserNav } from "@/components/user-nav"
import { DateRangePicker } from "@/components/date-range-picker"

export function Header() {
  return (
    <header className="flex h-16 items-center border-b bg-background px-4 md:px-6 lg:px-8">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <DateRangePicker />
        </div>
        <UserNav />
      </div>
    </header>
  )
}
