"use client";

import React, { memo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "react-toastify";
import _ from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthResponse, OAuthProviders } from "@/lib/authApi";
import { ApiErrorResponse } from "@/utils/http";
import { ForumButtonOutline } from "../../Button";
import { ValidatePrivateEmailForm, ValidatePrivateEmailFormSchema } from "./private-email-form.validate";
import { PrivateEmailAccountBody, privateEmailAccount } from "@/lib/accountApi";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BiError } from "react-icons/bi";
import ConfirmDialog from "../../ConfirmDialog";

const PrivateEmailForm = () => {
	const queryClient = useQueryClient();
	const { data: authData } = useAuth();
	const [dialog, setDialog] = React.useState<boolean>(false);
	const [values, setValues] = React.useState<ValidatePrivateEmailForm>({
		new_email: "",
		confirm_new_email: "",
		confirm_password: "",
	});

	const { isLoading, mutate } = useMutation<AuthResponse, ApiErrorResponse, PrivateEmailAccountBody>({
		mutationFn: async (body) => await privateEmailAccount(body),
		onSuccess: (data) => {
			privateEmailForm.reset();
			queryClient.setQueryData(["auth"], data);
			toast.success("Update email successful!");
		},
		onError: (err) => {
			toast.error(_.get(err?.response?.data, "message", "Update email failed!"));
		},
	});

	const privateEmailForm = useForm<ValidatePrivateEmailForm>({
		resolver: zodResolver(ValidatePrivateEmailFormSchema),
		defaultValues: {
			new_email: "",
			confirm_new_email: "",
			confirm_password: "",
		},
	});
	const handlePrivateEmail = async (values: ValidatePrivateEmailForm) => {
		setValues(values);
		setDialog((prev) => !prev);
	};

	const handleConfirm = () => {
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
		<>
			<ConfirmDialog title="Are you sure want to change your email?" dialog={dialog} setDialog={setDialog} onConfirm={handleConfirm}>
				This action cannot be undone. This will permanently change your email.
			</ConfirmDialog>
			<Form {...privateEmailForm}>
				<form onSubmit={privateEmailForm.handleSubmit(handlePrivateEmail)} className="space-y-5">
					<FormField
						control={privateEmailForm.control}
						name="new_email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New email</FormLabel>
								<FormControl>
									<Input type="email" placeholder={authData?.email} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={privateEmailForm.control}
						name="confirm_new_email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm new email</FormLabel>
								<FormControl>
									<Input type="email" placeholder={authData?.email} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={privateEmailForm.control}
						name="confirm_password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="1234****" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<ol className="text-forum_gray text-xs opacity-80 list-disc">
						<li>Make sure it&apos;s valid email.</li>
						<li>Confirm password match your current password</li>
					</ol>
					<ForumButtonOutline type="submit" className="w-max" disabled={isLoading}>
						{isLoading && <span className="loading loading-spinner loading-xs mr-2" />}
						{!isLoading ? "Update email" : "Loading..."}
					</ForumButtonOutline>
				</form>
			</Form>
		</>
	);
};

export default memo(PrivateEmailForm);
