/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { ValidatePasswordForm, ValidatePasswordFormSchema } from "./password-form.validate";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForumButtonOutline } from "@/components/forums/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiErrorResponse } from "@/utils/http";
import { AuthResponse, OAuthProviders } from "@/lib/authApi";
import { PasswordAccountBody, passwordAccount } from "@/lib/accountApi";
import { toast } from "react-toastify";
import _ from "lodash";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BiError } from "react-icons/bi";
import ConfirmDialog from "../../ConfirmDialog";
import { getErrorMessage } from "@/utils/getErrorMessage";

const PasswordForm = () => {
	const { data: authData } = useAuth();
	const [dialog, setDialog] = useState<boolean>(false);
	const [values, setValues] = React.useState<ValidatePasswordForm>({
		old_password: "",
		new_password: "",
		confirm_new_password: "",
	});
	const queryClient = useQueryClient();

	const passwordForm = useForm<ValidatePasswordForm>({
		resolver: zodResolver(ValidatePasswordFormSchema),
		defaultValues: {
			old_password: "",
			new_password: "",
			confirm_new_password: "",
		},
	});

	const {
		mutate: passwordAccountMutate,
		error: passwordAccountError,
		isSuccess: passwordAccountIsSuccess,
		isLoading: passwordAccountIsLoading,
		isError: passwordAccountIsError,
	} = useMutation<AuthResponse, ApiErrorResponse, PasswordAccountBody>({
		mutationFn: async (body) => await passwordAccount(body),
	});

	const handlePassword = async (values: ValidatePasswordForm) => {
		setValues(values);
		setDialog((prev) => !prev);
	};

	const handleConfirm = () => {
		passwordAccountMutate({
			...values,
		});
	};

	useEffect(() => {
		if (passwordAccountIsSuccess) {
			queryClient.resetQueries(["account", "sessions"]);
			passwordForm.reset();
			toast.success("Update password successful!");
		}
	}, [passwordAccountIsSuccess]);

	useEffect(() => {
		if (passwordAccountIsError) {
			toast.error(getErrorMessage(passwordAccountError, "Update password failed!"));
		}
	}, [passwordAccountError, passwordAccountIsError]);

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
			<ConfirmDialog title="Are you sure want to change your password?" dialog={dialog} setDialog={setDialog} onConfirm={handleConfirm}>
				This action cannot be undone. This will permanently change your password.
			</ConfirmDialog>
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
					<li className="text-forum_gray text-xs opacity-80">Make sure it&apos;s at least 8 character.</li>
					<ForumButtonOutline type="submit" className="w-full" disabled={passwordAccountIsLoading}>
						{passwordAccountIsLoading && <span className="loading loading-spinner loading-xs mr-2" />}
						{!passwordAccountIsLoading ? "Update password" : "Loading..."}
					</ForumButtonOutline>
				</form>
			</Form>
		</>
	);
};

export default PasswordForm;
