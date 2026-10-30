import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { StatusBadge } from "./StatusBadge";
import { Deadline } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface DeadlineCardProps {
  deadline: Deadline;
  onDelete: (id: string) => void;
}

export function DeadlineCard({ deadline, onDelete }: DeadlineCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-lg">{deadline.name}</CardTitle>
          <Badge variant="secondary" className="mt-1">
            {deadline.category}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(deadline.id)}
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Expires: {deadline.expires_on}</span>
          <StatusBadge expiresOn={deadline.expires_on} />
        </div>
      </CardContent>
    </Card>
  );
}
