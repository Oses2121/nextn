import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AdminCustomersPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Customers</CardTitle>
            <CardDescription>View and manage your customers.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Customer information will be displayed here.</p>
        </CardContent>
    </Card>
  )
}
