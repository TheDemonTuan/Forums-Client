"use client";

import Breadcrumb from "@/components/forums/Breadcrumb";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OAuthAuthBody, AuthResponse, oauthAuth } from "@/lib/authApi";
import { ApiErrorResponse } from "@/utils/http";
import _ from "lodash";

const OAuthVerify = ({ params }: { params: { provider: string } }) => {
	const searchParams = useSearchParams();
	const provider = params.provider;
	const code = searchParams.get("code");
	const router = useRouter();
	const queryClient = useQueryClient();
	const oauthVerify = useRef(true);

	const { mutate: googleMutate } = useMutation<AuthResponse, ApiErrorResponse, OAuthAuthBody>({
		mutationFn: async (body) => await oauthAuth(body),
		onSuccess: (data) => {
			toast.success("Logged in with Google successfully");
			queryClient.setQueryData(["auth"], data);
			router.replace("/");
		},
		onError: (error) => {
			toast.error(
				_.get(
					error?.response?.data,
					"message",
					"An error occurred while authenticating with Google"
				)
			);
			router.replace("/login");
		},
	});

	const { mutate: githubMutate } = useMutation<AuthResponse, ApiErrorResponse, OAuthAuthBody>({
		mutationFn: async (body) => await oauthAuth(body),
		onSuccess: (data) => {
			toast.success("Logged in with Github successfully");
			queryClient.setQueryData(["auth"], data);
			router.replace("/");
		},
		onError: (error) => {
			toast.error(
				_.get(
					error?.response?.data,
					"message",
					"An error occurred while authenticating with Github"
				)
			);
			router.replace("/login");
		},
	});

	if (!provider || !code) notFound();

	useEffect(() => {
		if (!oauthVerify.current) return;
		switch (provider) {
			case "google":
				googleMutate({
					code,
					provider,
				});
				break;
			case "github":
				githubMutate({
					code,
					provider,
				});
				break;
			default:
				notFound();
		}
		return () => {
			oauthVerify.current = false;
		};
	}, [code, githubMutate, googleMutate, provider]);

	return (
		<>
			<Breadcrumb title={`${provider} OAuth Verify`} />
			<Card className="w-[90%] xl:w-[30%] mx-auto my-10">
				<CardHeader className="p-3">
					<CardTitle className="text-2xl capitalize text-center flex items-center justify-center gap-2">
						{provider} OAuth Verifying
					</CardTitle>
					<CardDescription className="text-center">
						Please wait while we verify your {provider} account to continue
					</CardDescription>
				</CardHeader>
				<div className="divider" />
				<CardContent className="grid gap-5 p-5 items-center justify-center">
					<span className="loading loading-bars loading-lg" />
				</CardContent>
			</Card>
		</>
	);
};

export default OAuthVerify;
