import { z } from "zod";

export const ProfileFormSchema = z.object({
  display_name: z
    .string()
    .min(3, {
      message: "Display name must be longer than or equal to 3 characters.",
    })
    .max(25, {
      message: "Display name must be at most 25 characters.",
    })
    .regex(/^[a-zA-Z0-9]*$/, "Display name must be alphanumeric."),
  about: z.string().max(255, {
    message: "About must be at most 255 characters.",
  }),
});

export type ProfileFormType = z.infer<typeof ProfileFormSchema>;
