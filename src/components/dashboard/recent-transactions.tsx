import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { recentTransactions } from "@/lib/data"

export function RecentTransactions() {
  return (
    <div className="space-y-8">
      {recentTransactions.map((transaction, index) => (
        <div className="flex items-center" key={index}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={transaction.avatar} alt="Avatar" />
            <AvatarFallback>{transaction.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.name}</p>
            <p className="text-sm text-muted-foreground">{transaction.email}</p>
          </div>
          <div className="ml-auto font-medium">{transaction.amount}</div>
        </div>
      ))}
    </div>
  )
}
