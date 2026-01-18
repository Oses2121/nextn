import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users, Activity } from "lucide-react";

const statItems = [
    { title: "Total Revenue", value: "$45,231.89", description: "+20.1% from last month", icon: DollarSign },
    { title: "Orders", value: "+2350", description: "+180.1% from last month", icon: Package },
    { title: "New Customers", value: "+12,234", description: "+19% from last month", icon: Users },
    { title: "Active Now", value: "+573", description: "+201 since last hour", icon: Activity },
]

export default function AdminDashboardPage() {
  return (
    <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statItems.map(item => (
                 <Card key={item.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{item.value}</div>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
