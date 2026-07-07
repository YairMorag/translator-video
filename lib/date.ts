import { addDays, format } from "date-fns";
import { he } from "date-fns/locale";
import { CURRENT_WEEK_START } from "@/lib/data/seed";

export function currentWeekLabel(): string {
  const end = addDays(CURRENT_WEEK_START, 6);
  return `${format(CURRENT_WEEK_START, "d MMM", { locale: he })} – ${format(end, "d MMM yyyy", { locale: he })}`;
}

export function formatDate(iso: string): string {
  return format(new Date(iso), "d MMM yyyy", { locale: he });
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "d MMM, HH:mm", { locale: he });
}
