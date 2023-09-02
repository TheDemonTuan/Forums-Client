"use client";

import React from "react";
import { ValidatePasswordForm, ValidatePasswordFormSchema } from "./password-form.validate";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForumButtonOutline } from "@/components/forums/Button";
const PasswordForm = () => {
	const passwordForm = useForm<ValidatePasswordForm>({
		resolver: zodResolver(ValidatePasswordFormSchema),
		defaultValues: {
			old_password: "",
			new_password: "",
			confirm_new_password: "",
		},
	});

	const handlePassword = async (values: ValidatePasswordForm) => {
		console.log(values);
	};
	return (
		<Form {...passwordForm}>
			<form onSubmit={passwordForm.handleSubmit(handlePassword)} className="space-y-4">
				<FormField
					control={passwordForm.control}
					name="old_password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Old password</FormLabel>
							<FormControl>
								<Input type="old_password" placeholder="1234****" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={passwordForm.control}
					name="new_password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New password</FormLabel>
							<FormControl>
								<Input type="new_password" placeholder="6789****" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={passwordForm.control}
					name="confirm_new_password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm new password</FormLabel>
							<FormControl>
								<Input type="confirm_new_password" placeholder="6789****" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<ForumButtonOutline type="submit" className="w-full">
					Update password
				</ForumButtonOutline>
			</form>
		</Form>
	);
};

export default PasswordForm;
