// Categories for deadlines
export const DEADLINE_CATEGORIES = [
  { value: "license", label: "License" },
  { value: "contract", label: "Contract" },
  { value: "compliance", label: "Compliance" },
  { value: "renewal", label: "Renewal" },
  { value: "tax", label: "Tax" },
  { value: "insurance", label: "Insurance" },
  { value: "audit", label: "Audit" },
  { value: "subscription", label: "Subscription" },
  { value: "other", label: "Other" },
];

// Status colors
export const STATUS_COLORS = {
  expired: {
    bg: "bg-red-500",
    text: "text-white",
    border: "border-red-500",
  },
  soon: {
    bg: "bg-amber-500",
    text: "text-white",
    border: "border-amber-500",
  },
  ok: {
    bg: "bg-emerald-500",
    text: "text-white",
    border: "border-emerald-500",
  },
} as const;

// Sort options
export const SORT_OPTIONS = [
  { value: "expires_soonest", label: "Expires Soonest" },
  { value: "expires_latest", label: "Expires Latest" },
  { value: "name_asc", label: "Name (A-Z)" },
  { value: "name_desc", label: "Name (Z-A)" },
];

// Filter options
export const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "expired", label: "Expired" },
  { value: "soon", label: "Due Soon (<30 days)" },
  { value: "ok", label: "Active" },
];

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
};

// Notification settings
export const NOTIFICATION_SETTINGS = {
  deadlineReminders: {
    daysBefore: [7, 3, 1],
    enabled: true,
  },
  expiredAlerts: {
    enabled: true,
  },
};
