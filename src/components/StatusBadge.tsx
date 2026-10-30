import { Badge } from "./ui/badge";
import { getStatus, statusColors } from "@/lib/supabase";
import { daysLeft } from "@/lib/supabase";

interface StatusBadgeProps {
  expiresOn: string;
}

export function StatusBadge({ expiresOn }: StatusBadgeProps) {
  const days = daysLeft(expiresOn);
  const status = getStatus(days);
  
  const getLabel = () => {
    if (days < 0) return `Expired ${Math.abs(days)} days ago`;
    if (days === 0) return "Expires today";
    if (days === 1) return "Expires tomorrow";
    if (days <= 30) return `${days} days left`;
    return "Active";
  };

  return (
    <Badge
      variant={status === "expired" ? "destructive" : status === "soon" ? "outline" : "default"}
      className={` ${statusColors[status]} text-white`}
    >
      {getLabel()}
    </Badge>
  );
}
