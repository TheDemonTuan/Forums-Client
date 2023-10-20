import { z } from "zod";

export const EmailFormSchema = z
	.object({
		new_email: z.string().email({ message: "New email must be a valid email address." }).max(50, {
			message: "New email must be shorter than or equal to 50 characters.",
		}),
		confirm_new_email: z
			.string()
			.email({ message: "New email must be a valid email address." })
			.max(50, {
				message: "Confirm new email must be shorter than or equal to 50 characters.",
			}),
		confirm_password: z
			.string()
			.min(8, {
				message: "Confirm password must be longer than or equal to 8 characters.",
			})
			.max(50, {
				message: "Confirm password must be shorter than or equal to 50 characters.",
			}),
	})
	.refine((data) => data.new_email === data.confirm_new_email, {
		message: "New email and confirm new email must match",
		path: ["confirm_new_email"],
	});
export type EmailFormType = z.infer<typeof EmailFormSchema>;
