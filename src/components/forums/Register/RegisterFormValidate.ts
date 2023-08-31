import { z } from "zod";

export const RegisterFormValidateSchema = z
	.object({
		email: z
			.string()
			.email({
				message: "Email must be a valid email.",
			})
			.max(50, {
				message: "Email must be at most 50 characters.",
			}),
		username: z
			.string()
			.min(2, {
				message: "Username must be at least 2 characters.",
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
		confirm_password: z
			.string()
			.min(8, {
				message: "Confirm password must be at least 8 characters.",
			})
			.max(50, {
				message: "Confirm password must be at most 50 characters.",
			}),
	})
	.refine((data) => data.password === data.confirm_password, {
		message: "Confirm password must match password",
		path: ["confirm_password"],
	});

export type RegisterFormValidate = z.infer<typeof RegisterFormValidateSchema>;
