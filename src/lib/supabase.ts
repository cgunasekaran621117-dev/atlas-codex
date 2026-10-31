import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://your-project-ref.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Days until a date; this drives every status badge
export const daysLeft = (dateStr: string): number => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(y, m - 1, d) - today) / 864e5);
};

// red if expired, yellow if 30 days or less, otherwise green
export const getStatus = (days: number): "expired" | "soon" | "ok" => {
  if (days < 0) return "expired";
  if (days <= 30) return "soon";
  return "ok";
};

// Status colors for badges
export const statusColors: Record<"expired" | "soon" | "ok", string> = {
  expired: "bg-red-500",
  soon: "bg-amber-500",
  ok: "bg-emerald-500",
};

// Format date for display
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get user initials from email
export const getInitials = (email: string): string => {
  const name = email.split("@")[0];
  return name
    .split(".")
    .map((part) => part.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};
