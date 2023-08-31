"use client";

import React, { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RegisterFormValidate, RegisterFormValidateSchema } from "./RegisterFormValidate";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import _ from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RegisterBody, AuthResponse, registerAuth } from "@/libs/authApi";
import { ApiErrorResponse } from "@/utils/http";

const RegisterForm = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { isLoading, mutate } = useMutation<AuthResponse, ApiErrorResponse, RegisterBody>({
		mutationFn: async (body) => await registerAuth(body),
		onSuccess: (data) => {
			form.reset();
			router.replace("/");
			queryClient.setQueryData(["auth"], data);
			toast.success("Register successful!");
		},
		onError: (err) => {
			toast.error(_.get(err?.response?.data, "message", "Register failed!"));
		},
	});

	const form = useForm<RegisterFormValidate>({
		resolver: zodResolver(RegisterFormValidateSchema),
		defaultValues: {
			email: "",
			username: "",
			password: "",
			confirm_password: "",
		},
	});

	const handleRegister = async (values: RegisterFormValidate) => {
		mutate({
			email: values.email,
			username: values.username,
			password: values.password,
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									type="email"
									className="w-full"
									placeholder="example@example.com"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
				<FormField
					control={form.control}
					name="confirm_password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm password</FormLabel>
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
					{!isLoading ? "Register" : "Loading..."}
				</Button>
			</form>
		</Form>
	);
};

export default RegisterForm;
