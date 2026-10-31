import { Package, Calendar, AlertCircle, Search } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  type: "deadlines" | "search" | "company" | "error";
  onAction?: () => void;
  actionText?: string;
}

export function EmptyState({ type, onAction, actionText }: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case "deadlines":
        return {
          icon: <Calendar className="h-12 w-12 text-muted-foreground" />,
          title: "No Deadlines Yet",
          description: "Start by adding your first deadline to keep track of important dates.",
        };
      case "search":
        return {
          icon: <Search className="h-12 w-12 text-muted-foreground" />,
          title: "No Results Found",
          description: "Try adjusting your search or filter criteria.",
        };
      case "company":
        return {
          icon: <Package className="h-12 w-12 text-muted-foreground" />,
          title: "No Company Found",
          description: "Create a company profile to start managing deadlines.",
        };
      case "error":
        return {
          icon: <AlertCircle className="h-12 w-12 text-muted-foreground" />,
          title: "Something Went Wrong",
          description: "We couldn't load your data. Please try again.",
        };
      default:
        return {
          icon: <Calendar className="h-12 w-12 text-muted-foreground" />,
          title: "No Data",
          description: "There's nothing to display here.",
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="mb-4 text-muted-foreground">{content.icon}</div>
      <h3 className="text-xl font-semibold text-foreground mb-2">{content.title}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
        {content.description}
      </p>
      {onAction && actionText && (
        <Button onClick={onAction} variant="outline">
          {actionText}
        </Button>
      )}
    </div>
  );
}
