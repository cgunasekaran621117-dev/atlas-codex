import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { StatusBadge } from "./StatusBadge";
import { Deadline } from "@/lib/types";
import { Trash2, Edit2 } from "lucide-react";
import { Button } from "./ui/button";
import { formatDate } from "@/lib/utils";

interface DeadlineCardProps {
  deadline: Deadline;
  onDelete: (id: string) => void;
  onEdit?: (deadline: Deadline) => void;
  showActions?: boolean;
}

export function DeadlineCard({ deadline, onDelete, onEdit, showActions = true }: DeadlineCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200 group">
      <CardHeader className="flex flex-row justify-between items-start pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-foreground">{deadline.name}</CardTitle>
          <Badge variant="secondary" className="mt-1 text-xs">
            {deadline.category}
          </Badge>
        </div>
        {showActions && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(deadline)}
                className="h-8 w-8 p-0"
              >
                <Edit2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(deadline.id)}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-sm text-muted-foreground">Expires: {formatDate(deadline.expires_on)}</span>
          <StatusBadge expiresOn={deadline.expires_on} />
        </div>
      </CardContent>
    </Card>
  );
}
