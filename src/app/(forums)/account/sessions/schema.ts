import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const sessionsSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  ip: z.string(),
  status: z.boolean(),
  created_at: z.string(),
  is_active: z.boolean(),
});

export type Sessions = z.infer<typeof sessionsSchema>;
