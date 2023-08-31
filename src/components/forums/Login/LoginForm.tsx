"use client";

import React, { useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoginValidateFormSchema, LoginValidateForm } from "./LoginFormValidate";
import _ from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginBody, AuthResponse, loginAuth } from "@/libs/authApi";
import { ApiErrorResponse } from "@/utils/http";

const LoginForm = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { isLoading, mutate } = useMutation<AuthResponse, ApiErrorResponse, LoginBody>({
		mutationFn: async (body) => await loginAuth(body),
		onSuccess: (data) => {
			form.reset();
			router.replace("/");
			queryClient.setQueryData(["auth"], data);
			toast.success("Login successful!");
		},
		onError: (err) => {
			toast.error(_.get(err?.response?.data, "message", "Login failed!"));
		},
	});

	const form = useForm<LoginValidateForm>({
		resolver: zodResolver(LoginValidateFormSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});
	const handleSubmit = async (values: LoginValidateForm) => {
		if (isLoading) return;

		mutate({
			username: values.username,
			password: values.password,
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input className="w-full" placeholder="example" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="123***" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					type="submit"
					variant={"outline"}
					className="w-full uppercase text-[18px] hover:bg-forum_pink hover:text-forum_white"
					disabled={isLoading}>
					{isLoading && <span className="loading loading-spinner loading-xs" />}
					{!isLoading ? "Login" : "Loading..."}
				</Button>
			</form>
		</Form>
	);
};

export default LoginForm;
