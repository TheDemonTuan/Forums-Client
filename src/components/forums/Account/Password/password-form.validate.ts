import { z } from "zod";

export const PasswordValidateFormSchema = z
	.object({
		old_password: z
			.string()
			.min(8, {
				message: "Old password must be longer than or equal to 8 characters.",
			})
			.max(50, {
				message: "Old password must be shorter than or equal to 50 characters.",
			}),
		new_password: z
			.string()
			.min(8, {
				message: "New password must be longer than or equal to 8 characters.",
			})
			.max(50, {
				message: "New password must be shorter than or equal to 50 characters.",
			}),
		confirm_new_password: z
			.string()
			.min(8, {
				message: "Confirm new password must be longer than or equal to 8 characters.",
			})
			.max(50, {
				message: "Confirm new password must be shorter than or equal to 50 characters.",
			}),
	})
	.refine((data) => data.old_password !== data.new_password, {
		message: "New password must be different from old password",
		path: ["new_password"],
	})
	.refine((data) => data.new_password === data.confirm_new_password, {
		message: "New password and confirm new password must match",
		path: ["confirm_new_password"],
	});
export type PrivateValidatePasswordForm = z.infer<typeof PasswordValidateFormSchema>;
