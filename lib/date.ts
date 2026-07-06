import { addDays, format } from "date-fns";
import { CURRENT_WEEK_START } from "@/lib/data/seed";

export function currentWeekLabel(): string {
  const end = addDays(CURRENT_WEEK_START, 6);
  return `${format(CURRENT_WEEK_START, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
}

export function formatDate(iso: string): string {
  return format(new Date(iso), "MMM d, yyyy");
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "MMM d, h:mm a");
}
