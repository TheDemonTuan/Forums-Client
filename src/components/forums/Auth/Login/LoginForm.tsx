"use client";

import React, { memo, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ValidateLoginFormSchema, ValidateLoginForm } from "./login-form.validate";
import _ from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginAuthBody, AuthResponse, loginAuth, LoginAuthParams } from "@/lib/authApi";
import { ApiErrorResponse } from "@/utils/http";
import { ForumButtonOutline } from "../../Button";
import { useGoogleRecaptchaV3 } from "@/hooks/useGoogleRecaptcha";
import ConfirmDialog from "../../ConfirmDialog";
import { getErrorMessage } from "@/utils/getErrorMessage";

const LoginForm = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { handleReCaptchaVerify } = useGoogleRecaptchaV3();
	const [recaptchaIsLoading, setRecaptchaIsLoading] = useState<boolean>(false);
	const [dialog, setDialog] = useState(false);
	const [values, setValues] = useState<LoginAuthBody>({
		username: "",
		password: "",
	});

	const {
		mutate: loginMutate,
		data: loginData,
		error: loginError,
		isSuccess: loginIsSuccess,
		isLoading: loginIsLoading,
		isError: loginIsError,
	} = useMutation<AuthResponse, ApiErrorResponse, LoginAuthParams>({
		mutationFn: async (params) => await loginAuth(params),
	});

	const loginForm = useForm<ValidateLoginForm>({
		resolver: zodResolver(ValidateLoginFormSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const handleLogin = (values: ValidateLoginForm) => {
		setDialog(true);
		setValues(values);
		document.body.classList.add("pointer-events-none");
	};

	const handleConfirm = async () => {
		setRecaptchaIsLoading(true);
		const recaptcha = await handleReCaptchaVerify();

		if (!recaptcha) {
			toast.error("Can't verify reCaptcha!");
			return;
		}
		setRecaptchaIsLoading(false);

		loginMutate({
			body: values,
			recaptcha,
		});
	};

	useEffect(() => {
		if (loginIsSuccess) {
			loginForm.reset();
			router.replace("/");
			queryClient.setQueryData(["auth"], loginData);
			toast.success("Login successful!");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loginIsSuccess]);

	useEffect(() => {
		if (loginIsError) toast.error(getErrorMessage(loginError, "Login failed!"));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loginIsError]);

	useEffect(() => {
		if (!loginIsLoading) document.body.classList.remove("pointer-events-none");
	}, [loginIsLoading]);

	return (
		<>
			<ConfirmDialog title="Are you sure want to submit?" dialog={dialog} setDialog={setDialog} onConfirm={handleConfirm}>
				Make sure your input is correct.
			</ConfirmDialog>
			<Form {...loginForm}>
				<form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
					<FormField
						control={loginForm.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input type="text" placeholder="example" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={loginForm.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="1234****" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<ForumButtonOutline type="submit" className="w-full" disabled={loginIsLoading || recaptchaIsLoading}>
						{loginIsLoading || recaptchaIsLoading ? <span className="loading loading-spinner loading-xs mr-2" /> : ""}
						{!loginIsLoading && !recaptchaIsLoading ? "Login" : "Loading..."}
					</ForumButtonOutline>
				</form>
			</Form>
		</>
	);
};

export default memo(LoginForm);
