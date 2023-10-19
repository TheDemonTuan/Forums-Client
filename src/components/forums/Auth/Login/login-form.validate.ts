import { z } from "zod";

export const AuthValidateLoginFormSchema = z.object({
	username: z
		.string()
		.min(3, {
			message: "Username must be longer than or equal to 3 characters.",
		})
		.max(15, {
			message: "Username must be at most 15 characters.",
		})
		.regex(/^[a-zA-Z0-9]+$/, {
			message: "Username must be alphanumeric.",
		}),
	password: z
		.string()
		.min(8, {
			message: "Password must be at least 8 characters.",
		})
		.max(50, {
			message: "Password must be at most 50 characters.",
		}),
});

export type AuthValidateLoginForm = z.infer<typeof AuthValidateLoginFormSchema>;
