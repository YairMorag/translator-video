import { z } from "zod";

export const taskReportSchema = z.object({
  completed: z.enum(["yes", "no"]),
  difficulty: z.coerce.number().int().min(1).max(5),
  fatigue: z.coerce.number().int().min(1).max(5),
  pain: z.enum(["yes", "no"]),
  note: z.string().max(500).optional(),
});

export type TaskReportFormValues = z.infer<typeof taskReportSchema>;
