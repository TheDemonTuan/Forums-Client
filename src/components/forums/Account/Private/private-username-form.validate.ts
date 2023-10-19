import { z } from "zod";

export const PrivateValidateUserNameFormSchema = z
	.object({
		new_username: z
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
		confirm_new_username: z
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
		confirm_password: z
			.string()
			.min(8, {
				message: "Password must be longer than or equal to 8 characters.",
			})
			.max(50, {
				message: "Password must be shorter than or equal to 50 characters.",
			}),
	})
	.refine((data) => data.new_username === data.confirm_new_username, {
		message: "New username and confirm new username must match",
		path: ["confirm_new_username"],
	});
export type PrivateValidateUserNameForm = z.infer<typeof PrivateValidateUserNameFormSchema>;
