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
    label: "School Admin",
    name: "Dana Shapiro",
    email: "admin@nextplay.demo",
    description: "School-wide engagement, teams, and risk overview.",
  },
  {
    role: "coach",
    label: "Coach",
    name: "Amir Levi",
    email: "coach@nextplay.demo",
    description: "Assign tasks, review reports, flag players for attention.",
  },
  {
    role: "parent",
    label: "Parent",
    name: "Noa Katz",
    email: "parent@nextplay.demo",
    description: "See Daniel's approved tasks, reports, and consent status.",
  },
  {
    role: "player",
    label: "Player",
    name: "Daniel Katz",
    email: "player@nextplay.demo",
    description: "Today's task, this week's plan, and progress.",
  },
];
