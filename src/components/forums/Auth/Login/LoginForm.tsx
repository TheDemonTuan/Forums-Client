"use client";

import React, { memo, useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { AuthValidateLoginFormSchema, AuthValidateLoginForm } from "./login-form.validate";
import _ from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginAuthBody, AuthResponse, loginAuth, LoginAuthParams } from "@/lib/api/authApi";
import { ApiErrorResponse } from "@/utils/http";
import { ForumButtonOutline } from "../../Button";
import { useGoogleRecaptchaV3 } from "@/hooks/useGoogleRecaptcha";
import ConfirmDialog from "../../ConfirmDialog";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useAuthStore } from "@/lib/store/authStore";

const LoginForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { handleReCaptchaVerify, recaptchaIsLoading } = useGoogleRecaptchaV3();
  const [dialog, setDialog] = useState(false);
  const [values, setValues] = useState<LoginAuthBody>({
    username: "",
    password: "",
  });
  const { setCardDisableStatus, setAuthTitle } = useAuthStore();

  const {
    mutate: loginMutate,
    data: loginData,
    error: loginError,
    isSuccess: loginIsSuccess,
    isPending: loginIsPending,
    isError: loginIsError,
  } = useMutation<AuthResponse, ApiErrorResponse, LoginAuthParams>({
    mutationFn: async (params) => await loginAuth(params),
  });

  const loginForm = useForm<AuthValidateLoginForm>({
    resolver: zodResolver(AuthValidateLoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = (values: AuthValidateLoginForm) => {
    setDialog(true);
    setValues(values);
  };

  const handleConfirm = async () => {
    setCardDisableStatus(true);
    const recaptcha = await handleReCaptchaVerify();

    if (!recaptcha) {
      toast.error("Can't verify reCaptcha!");
      return;
    }

    loginMutate({
      body: values,
      recaptcha,
    });
  };

  useEffect(() => {
    setAuthTitle("Sign In");
  }, [setAuthTitle]);

  useEffect(() => {
    if (loginIsSuccess) {
      loginForm.reset();
      router.replace("/");
      queryClient.setQueryData(["auth"], loginData);
      toast.success("Login successful!");
    }
  }, [loginIsSuccess, loginData]);

  useEffect(() => {
    if (loginIsError) toast.error(getErrorMessage(loginError, "Login failed!"));
  }, [loginIsError, loginError]);

  useEffect(() => {
    if (loginIsSuccess || loginIsError) setCardDisableStatus(false);
  }, [loginIsSuccess, loginIsError, setCardDisableStatus]);

  const buttonIsLoading = loginIsPending || recaptchaIsLoading;

  return (
    <>
      <ConfirmDialog
        title="Are you sure want to submit?"
        dialog={dialog}
        setDialog={setDialog}
        onConfirm={handleConfirm}
      >
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
          <ForumButtonOutline type="submit" className="w-full lg:w-1/3">
            {buttonIsLoading && <span className="loading loading-spinner loading-xs mr-2" />}
            {!buttonIsLoading ? "Login" : "Loading..."}
          </ForumButtonOutline>
        </form>
      </Form>
    </>
  );
};

export default memo(LoginForm);
