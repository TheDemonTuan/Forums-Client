"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
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
import { AuthValidateRegisterForm, AuthValidateRegisterFormSchema } from "./register-form.validate";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import _ from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RegisterAuthBody, AuthResponse, registerAuth, RegisterAuthParams } from "@/lib/api/authApi";
import { ApiErrorResponse } from "@/utils/http";
import { ForumButtonOutline } from "@/components/forums/Button";
import { useGoogleRecaptchaV3 } from "@/hooks/useGoogleRecaptcha";
import { getErrorMessage } from "@/utils/getErrorMessage";
import ConfirmDialog from "../../ConfirmDialog";
import { useAuthStore } from "@/lib/store/authStore";

const RegisterForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { handleReCaptchaVerify, recaptchaIsLoading } = useGoogleRecaptchaV3();
  const [dialog, setDialog] = useState(false);
  const [values, setValues] = useState<RegisterAuthBody>({
    email: "",
    username: "",
    password: "",
  });
  const { setCardDisableStatus, setAuthTitle } = useAuthStore();

  const {
    mutate: registerMutate,
    data: registerData,
    error: registerError,
    isSuccess: registerIsSuccess,
    isLoading: registerIsLoading,
    isError: registerIsError,
  } = useMutation<AuthResponse, ApiErrorResponse, RegisterAuthParams>({
    mutationFn: async (params) => await registerAuth(params),
  });

  const registerForm = useForm<AuthValidateRegisterForm>({
    resolver: zodResolver(AuthValidateRegisterFormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirm_password: "",
    },
  });

  const handleRegister = (values: AuthValidateRegisterForm) => {
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

    registerMutate({
      body: values,
      recaptcha,
    });
  };

  useEffect(() => {
    setAuthTitle("Sign Up");
  }, [setAuthTitle]);

  useEffect(() => {
    if (registerIsSuccess) {
      registerForm.reset();
      router.replace("/");
      queryClient.setQueryData(["auth"], registerData);
      toast.success("Register successful!");
    }
  }, [registerIsSuccess, registerData]);

  useEffect(() => {
    if (registerIsError) toast.error(getErrorMessage(registerError, "Register failed!"));
  }, [registerIsError, registerError]);

  useEffect(() => {
    if (registerIsSuccess || registerIsError) setCardDisableStatus(false);
  }, [registerIsSuccess, registerIsError, setCardDisableStatus]);

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
      <Form {...registerForm}>
        <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-5">
          <FormField
            control={registerForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={registerForm.control}
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
            control={registerForm.control}
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
          <FormField
            control={registerForm.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
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
            disabled={registerIsLoading || recaptchaIsLoading}
          >
            {(registerIsLoading || recaptchaIsLoading) && (
              <span className="loading loading-spinner loading-xs mr-2" />
            )}
            {!registerIsLoading && !recaptchaIsLoading ? "Register" : "Loading..."}
          </ForumButtonOutline>
        </form>
      </Form>
    </>
  );
};

export default memo(RegisterForm);
