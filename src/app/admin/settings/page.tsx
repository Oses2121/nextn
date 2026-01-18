import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your store settings.</CardDescription>
        </CardHeader>
        <CardContent>
            <p>Store settings will be configured here.</p>
        </CardContent>
    </Card>
  )
}
