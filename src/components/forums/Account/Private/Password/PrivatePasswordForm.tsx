/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import { PasswordFormType, PasswordFormSchema } from "./private-password-form.validate";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForumButtonOutline } from "@/components/forums/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiErrorResponse } from "@/utils/http";
import { AuthResponse, OAuthProviders } from "@/lib/api/authApi";
import { PrivatePasswordAccountBody, privatePasswordAccount } from "@/lib/api/accountApi";
import { toast } from "react-toastify";
import _ from "lodash";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BiError } from "react-icons/bi";
import { getErrorMessage } from "@/utils/getErrorMessage";
import ConfirmDialog from "@/components/forums/ConfirmDialog";
import { useAccountStore } from "@/lib/store/accountStore";

const PrivatePasswordForm = () => {
  const queryClient = useQueryClient();
  const { authData } = useAuth();
  const [dialog, setDialog] = React.useState<boolean>(false);
  const [values, setValues] = React.useState<PasswordFormType>({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const passwordForm = useForm<PasswordFormType>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });
  const { setIsFormHandle } = useAccountStore();

  const { mutate: privatePasswordMutate, isPending: privatePasswordIsPending } = useMutation<
    AuthResponse,
    ApiErrorResponse,
    PrivatePasswordAccountBody
  >({
    mutationFn: async (body) => await privatePasswordAccount(body),
    onMutate: () => {
      setIsFormHandle(true);
    },
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["account", "sessions"],
      });
      passwordForm.reset();
      toast.success("Update password successful!");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Update password failed!"));
    },
    onSettled: () => {
      setIsFormHandle(false);
    },
  });

  const handlePassword = async (values: PasswordFormType) => {
    setValues(values);
    setDialog((prev) => !prev);
  };

  const handleConfirm = () => {
    privatePasswordMutate({
      ...values,
    });
  };

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
      <ConfirmDialog
        title="Are you sure want to change your password?"
        dialog={dialog}
        setDialog={setDialog}
        onConfirm={handleConfirm}
      >
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
          <li className="text-forum_gray text-xs opacity-80">
            Make sure it&apos;s at least 8 character.
          </li>
          <ForumButtonOutline type="submit">
            {!privatePasswordIsPending ? (
              "Update password"
            ) : (
              <>
                Loading... <span className="loading loading-spinner loading-xs ml-1" />
              </>
            )}
          </ForumButtonOutline>
        </form>
      </Form>
    </>
  );
};

export default PrivatePasswordForm;
