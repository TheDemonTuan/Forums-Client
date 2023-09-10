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
import { useMutation } from "@tanstack/react-query";
import { ApiErrorResponse } from "@/utils/http";
import { AuthResponse, OAuthProviders } from "@/lib/authApi";
import { PasswordAccountBody, passwordAccount } from "@/lib/accountApi";
import { toast } from "react-toastify";
import _ from "lodash";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BiError } from "react-icons/bi";

const PasswordForm = () => {
	const { data: authData } = useAuth();

	const passwordForm = useForm<ValidatePasswordForm>({
		resolver: zodResolver(ValidatePasswordFormSchema),
		defaultValues: {
			old_password: "",
			new_password: "",
			confirm_new_password: "",
		},
	});

	const { isLoading, mutate } = useMutation<AuthResponse, ApiErrorResponse, PasswordAccountBody>({
		mutationFn: async (body) => await passwordAccount(body),
		onSuccess: (data) => {
			passwordForm.reset();
			toast.success("Update password successful!");
		},
		onError: (err) => {
			toast.error(_.get(err?.response?.data, "message", "Update password failed!"));
		},
	});

	const handlePassword = async (values: ValidatePasswordForm) => {
		mutate({
			...values,
		});
	};

	if (authData?.oauth !== OAuthProviders.DEFAULT) {
		return (
			<Alert variant="destructive">
				<BiError size={24} />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>Not available for this account !</AlertDescription>
			</Alert>
		);
	}

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
								<Input type="password" placeholder="1234****" {...field} />
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
								<Input type="password" placeholder="6789****" {...field} />
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
								<Input type="password" placeholder="6789****" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<li className="text-forum_gray text-xs opacity-80">
					Make sure it&apos;s at least 8 character.
				</li>
				<ForumButtonOutline type="submit" className="w-full" disabled={isLoading}>
					{isLoading && <span className="loading loading-spinner loading-xs mr-2" />}
					{!isLoading ? "Update password" : "Loading..."}
				</ForumButtonOutline>
			</form>
		</Form>
	);
};

export default PasswordForm;
