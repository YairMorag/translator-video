import type { Role } from "@/lib/types";

export interface DemoAccount {
  role: Role;
  label: string;
  name: string;
  email: string;
  description: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "school_admin",
    label: "מנהל בית ספר",
    name: "Dana Shapiro",
    email: "admin@nextplay.demo",
    description: "מעורבות ברמת בית הספר, קבוצות וסקירת סיכונים.",
  },
  {
    role: "coach",
    label: "מאמן",
    name: "Amir Levi",
    email: "coach@nextplay.demo",
    description: "הקצאת משימות, בדיקת דוחות וסימון שחקנים לתשומת לב.",
  },
  {
    role: "parent",
    label: "הורה",
    name: "Noa Katz",
    email: "parent@nextplay.demo",
    description: "צפייה במשימות המאושרות של דניאל, בדוחות ובסטטוס האישור.",
  },
  {
    role: "player",
    label: "שחקן",
    name: "Daniel Katz",
    email: "player@nextplay.demo",
    description: "המשימה של היום, התוכנית השבועית וההתקדמות.",
  },
];
