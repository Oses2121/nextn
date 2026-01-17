import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { totalRevenue, totalExpenses, totalProfit } from "@/lib/data";
import { DollarSign, CreditCard, BarChart } from "lucide-react";
import { OverviewChart } from "@/components/dashboard/overview-chart";


export default function ReportsPage() {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
      };
      
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(totalRevenue)}
                    description="For the selected period"
                    Icon={DollarSign}
                />
                <StatCard
                    title="Total Expenses"
                    value={formatCurrency(totalExpenses)}
                    description="For the selected period"
                    Icon={CreditCard}
                />
                <StatCard
                    title="Net Profit"
                    value={formatCurrency(totalProfit)}
                    description="For the selected period"
                    Icon={BarChart}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profit & Loss Overview</CardTitle>
                    <CardDescription>Visualize your revenue and expenses over time.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <OverviewChart />
                </CardContent>
            </Card>
        </div>
    )
}
