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
import { PrivateUserNameAccountBody, privateUserNameAccount } from "@/lib/accountApi";
import { useAuth } from "@/hooks/useAuth";
import { PrivateValidateUserNameForm, PrivateValidateUserNameFormSchema } from "./private-username-form.validate";
import ConfirmDialog from "@/components/forums/ConfirmDialog";
import { BiError } from "react-icons/bi";

const PrivateUserNameForm = () => {
	const queryClient = useQueryClient();
	const { data: authData } = useAuth();
	const [dialog, setDialog] = React.useState<boolean>(false);
	const [values, setValues] = React.useState<PrivateValidateUserNameForm>({
		new_username: "",
		confirm_new_username: "",
		confirm_password: "",
	});

	const { isLoading, mutate } = useMutation<AuthResponse, ApiErrorResponse, PrivateUserNameAccountBody>({
		mutationFn: async (body) => await privateUserNameAccount(body),
		onSuccess: (data) => {
			privateUserNameForm.reset();
			queryClient.setQueryData(["auth"], data);
			toast.success("Update username successful!");
		},
		onError: (err) => {
			toast.error(_.get(err?.response?.data, "message", "Update username failed!"));
		},
	});

	const privateUserNameForm = useForm<PrivateValidateUserNameForm>({
		resolver: zodResolver(PrivateValidateUserNameFormSchema),
		defaultValues: {
			new_username: "",
			confirm_new_username: "",
			confirm_password: authData?.oauth === OAuthProviders.DEFAULT ? "" : "********",
		},
	});
	const handlePrivateUserName = async (values: PrivateValidateUserNameForm) => {
		setValues(values);
		setDialog((prev) => !prev);
	};

	const handleConfirm = () => {
		mutate({
			...values,
		});
	};

	return (
		<>
			<ConfirmDialog title="Are you sure want to change your username?" dialog={dialog} setDialog={setDialog} onConfirm={handleConfirm}>
				This action cannot be undone. This will permanently change your username.
			</ConfirmDialog>
			<Form {...privateUserNameForm}>
				<form onSubmit={privateUserNameForm.handleSubmit(handlePrivateUserName)} className="space-y-5">
					<FormField
						control={privateUserNameForm.control}
						name="new_username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>New username</FormLabel>
								<FormControl>
									<Input type="text" placeholder={authData?.username} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={privateUserNameForm.control}
						name="confirm_new_username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm new username</FormLabel>
								<FormControl>
									<Input type="text" placeholder={authData?.username} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{authData?.oauth === OAuthProviders.DEFAULT && (
						<FormField
							control={privateUserNameForm.control}
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
					)}
					<ol className="text-forum_gray text-xs opacity-80 list-disc">
						<li>Make sure it&apos;s at least 3 character.</li>
						<li>Confirm password match your current password.</li>
					</ol>
					<ForumButtonOutline type="submit" className="w-max" disabled={isLoading}>
						{isLoading && <span className="loading loading-spinner loading-xs mr-2" />}
						{!isLoading ? "Update username" : "Loading..."}
					</ForumButtonOutline>
				</form>
			</Form>
		</>
	);
};

export default memo(PrivateUserNameForm);
