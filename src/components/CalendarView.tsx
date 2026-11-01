import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Deadline } from "@/lib/types";
import { getStatus } from "@/lib/supabase";
import { getDaysUntilExpiry } from "@/lib/utils";
import { statusColors } from "@/lib/supabase";

interface CalendarViewProps {
  deadlines: Deadline[];
}

export function CalendarView({ deadlines }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (year: number, month: number): Date[] => {
    const date = new Date(year, month, 1);
    const days: Date[] = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const getDayDeadlines = (date: Date): Deadline[] => {
    const dateStr = date.toISOString().split("T")[0];
    return deadlines.filter(
      (d) => d.expires_on === dateStr
    );
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar View</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="font-medium">
            {monthNames[month]} {year}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
          >
            Today
          </Button>
        </div>

        {/* Weekdays Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the first day of the month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}

          {/* Days of the month */}
          {daysInMonth.map((date) => {
            const dayDeadlines = getDayDeadlines(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const day = date.getDate();

            return (
              <div
                key={date.toISOString()}
                className={`p-2 rounded-md cursor-pointer transition-colors ${
                  isToday ? "bg-accent" : ""
                } ${dayDeadlines.length > 0 ? "bg-primary/10 dark:bg-primary/20" : ""}`}
              >
                <div className="text-sm font-medium">{day}</div>
                {/* Show dots for deadlines */}
                {dayDeadlines.length > 0 && (
                  <div className="mt-1 flex gap-1">
                    {dayDeadlines.slice(0, 3).map((d, idx) => {
                      const days = getDaysUntilExpiry(d.expires_on);
                      const status = getStatus(days);
                      return (
                        <div
                          key={idx}
                          className={`h-2 w-2 rounded-full ${statusColors[status]}`}
                          title={d.name}
                        />
                      );
                    })}
                    {dayDeadlines.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayDeadlines.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <span>Expired</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Due Soon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Active</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
