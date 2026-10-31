import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getInitials } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";

interface UserAvatarProps {
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ size = "md" }: UserAvatarProps) {
  const { user } = useUser();

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  if (!user) return null;

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={user.user_metadata?.avatar_url} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitials(user.email || "")}
      </AvatarFallback>
    </Avatar>
  );
}
