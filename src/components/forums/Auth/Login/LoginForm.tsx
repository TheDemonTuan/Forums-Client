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
import { LoginAuthBody, AuthResponse, loginAuth, LoginAuthParams } from "@/lib/authApi";
import { ApiErrorResponse } from "@/utils/http";
import { ForumButtonOutline } from "../../Button";
import { useGoogleRecaptchaV3 } from "@/hooks/useGoogleRecaptcha";
import ConfirmDialog from "../../ConfirmDialog";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useAuthStore } from "@/lib/authStore";

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
    isLoading: loginIsLoading,
    isError: loginIsError,
  } = useMutation<AuthResponse, ApiErrorResponse, LoginAuthParams>({
    mutationFn: async (params) => await loginAuth(params),
  });

<<<<<<< HEAD
  const loginForm = useForm<AuthValidateLoginForm>({
    resolver: zodResolver(AuthValidateLoginFormSchema),
=======
  const loginForm = useForm<ValidateLoginForm>({
    resolver: zodResolver(ValidateLoginFormSchema),
>>>>>>> c58e3b02d0443a4187075c7d2b23c9a1cc4122d4
    defaultValues: {
      username: "",
      password: "",
    },
  });

<<<<<<< HEAD
  const handleLogin = (values: AuthValidateLoginForm) => {
=======
  const handleLogin = (values: ValidateLoginForm) => {
>>>>>>> c58e3b02d0443a4187075c7d2b23c9a1cc4122d4
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
          <ForumButtonOutline
            type="submit"
            className="w-full"
            disabled={loginIsLoading || recaptchaIsLoading}
          >
            {(loginIsLoading || recaptchaIsLoading) && (
              <span className="loading loading-spinner loading-xs mr-2" />
            )}
            {!loginIsLoading && !recaptchaIsLoading ? "Login" : "Loading..."}
          </ForumButtonOutline>
        </form>
      </Form>
    </>
  );
};

export default memo(LoginForm);
