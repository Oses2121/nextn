import { DollarSign, CreditCard, BarChart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { StatCard } from "@/components/dashboard/stat-card";
import { totalRevenue, totalExpenses, totalProfit, appointments } from "@/lib/data";
import { DateRangePicker } from "@/components/date-range-picker";

export default function DashboardPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2 md:hidden">
            <DateRangePicker />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          description="+20.1% from last month"
          Icon={DollarSign}
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          description="+18.1% from last month"
          Icon={CreditCard}
        />
        <StatCard
          title="Profit"
          value={formatCurrency(totalProfit)}
          description="+22.4% from last month"
          Icon={BarChart}
        />
        <StatCard
          title="Appointments"
          value={`+${appointments.length}`}
          description="Total for today"
          Icon={Users}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart />
          </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Revenue</CardTitle>
            <CardContent className="text-sm text-muted-foreground">You made 5 sales this month.</CardContent>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
