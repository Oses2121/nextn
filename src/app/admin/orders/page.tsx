import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AdminOrdersPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>View and manage customer orders.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Customer orders will be displayed here.</p>
        </CardContent>
    </Card>
  )
}
