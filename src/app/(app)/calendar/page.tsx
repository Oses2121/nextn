"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { appointments } from "@/lib/data"
import { Button } from "@/components/ui/button"

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <Button>Add Appointment</Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
                <CardContent className="p-0 flex justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-3"
                    classNames={{
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
                    }}
                />
                </CardContent>
            </Card>
            <Card className="lg:col-span-1">
                <CardHeader>
                <CardTitle>Appointments for Today</CardTitle>
                <CardDescription>You have {appointments.length} appointments scheduled.</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {appointments.map(appointment => (
                        <div key={appointment.id} className="flex items-start space-x-4 rounded-md border p-4">
                            <div className="flex-shrink-0 w-12 text-center">
                                <p className="text-sm font-medium text-primary">{appointment.time.split(' ')[0]}</p>
                                <p className="text-xs text-muted-foreground">{appointment.time.split(' ')[1]}</p>
                            </div>
                            <div className="flex-1 space-y-1 border-l pl-4">
                                <p className="text-sm font-medium leading-none">{appointment.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
