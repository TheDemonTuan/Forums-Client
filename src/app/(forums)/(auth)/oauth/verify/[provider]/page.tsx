"use client";

import { notFound, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";
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
import { AuthResponse, oauthAuth, OAuthAuthParams } from "@/lib/authApi";
import { ApiErrorResponse } from "@/utils/http";
import _ from "lodash";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useAuthStore } from "@/lib/authStore";

const OAuthVerify = ({ params }: { params: { provider: string } }) => {
  const searchParams = useSearchParams();
  const provider = params.provider;
  const code = searchParams.get("code");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { setAuthTitle, setCardDisableStatus } = useAuthStore();

  //* Google OAuth
  const {
    data: googleData,
    error: googleError,
    mutate: googleMutate,
    isSuccess: googleIsSuccess,
    isError: googleIsError,
  } = useMutation<AuthResponse, ApiErrorResponse, OAuthAuthParams>({
    mutationFn: async (params) => await oauthAuth(params),
  });

  useEffect(() => {
    if (googleIsSuccess) {
      toast.success("Logged in with Google successfully");
      queryClient.setQueryData(["auth"], googleData);
      router.replace("/");
    }
  }, [googleData, googleIsSuccess, queryClient, router]);

  useEffect(() => {
    if (googleIsError) {
      toast.error(
        _.get(
          googleError?.response?.data,
          "message",
          "An error occurred while authenticating with Google"
        )
      );
      router.replace("/login");
    }
  }, [googleError?.response?.data, googleIsError, router]);

  //* Github OAuth
  const {
    data: githubData,
    error: githubError,
    mutate: githubMutate,
    isSuccess: githubIsSuccess,
    isError: githubIsError,
  } = useMutation<AuthResponse, ApiErrorResponse, OAuthAuthParams>({
    mutationFn: async (params) => await oauthAuth(params),
  });

  useEffect(() => {
    setCardDisableStatus(true);
    setAuthTitle(provider + " OAuth Verifying");
  }, [provider, setAuthTitle, setCardDisableStatus]);

  useEffect(() => {
    if (githubIsSuccess) {
      toast.success("Logged in with Github successfully");
      queryClient.setQueryData(["auth"], githubData);
      router.replace("/");
    }
  }, [githubData, githubIsSuccess, queryClient, router]);

  useEffect(() => {
    if (githubIsError) {
      toast.error(
        _.get(
          githubError?.response?.data,
          "message",
          "An error occurred while authenticating with Github"
        )
      );
      router.replace("/login");
    }
  }, [githubError?.response?.data, githubIsError, router]);

  const handleReCaptchaVerify = useCallback(async () => {
    if (!provider || !code) {
      router.replace("/login");
      return toast.error("Invalid OAuth request!");
    }

    if (!executeRecaptcha) return;

    const recaptcha = await executeRecaptcha("tdtAction");

    if (!recaptcha) {
      router.replace("/login");
      return toast.error("Can't verify reCaptcha!");
    }
    switch (provider) {
      case "google":
        googleMutate({
          body: {
            code,
            provider,
          },
          recaptcha,
        });
        break;
      case "github":
        githubMutate({
          body: {
            code,
            provider,
          },
          recaptcha,
        });
        break;
      default:
        notFound();
    }
    // Do whatever you want with the token
  }, [code, executeRecaptcha, githubMutate, googleMutate, provider, router]);

  useEffect(() => {
    handleReCaptchaVerify();
  }, [handleReCaptchaVerify]);

  return (
    <>
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
    </>
  );
};

export default OAuthVerify;
