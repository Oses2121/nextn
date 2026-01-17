import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { revenueData } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

export default function RevenuePage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Revenue</h1>
                <Button>Add Revenue</Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Revenue</CardTitle>
                    <CardDescription>A list of your recent revenue transactions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {revenueData.map((revenue) => (
                                <TableRow key={revenue.id}>
                                    <TableCell className="font-medium">{revenue.id}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={revenue.status === 'paid' ? 'secondary' : revenue.status === 'pending' ? 'outline' : 'destructive'} 
                                            className="capitalize"
                                        >
                                            {revenue.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{revenue.source}</TableCell>
                                    <TableCell>{revenue.date}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(revenue.amount)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
