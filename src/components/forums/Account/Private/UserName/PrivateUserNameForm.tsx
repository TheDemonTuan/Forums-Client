"use client";

import React, { memo, useEffect } from "react";
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
import _ from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthResponse, OAuthProviders } from "@/lib/api/authApi";
import { ApiErrorResponse } from "@/utils/http";
import { ForumButtonOutline } from "../../../Button";
import { PrivateUserNameAccountBody, privateUserNameAccount } from "@/lib/api/accountApi";
import { useAuth } from "@/hooks/useAuth";
import { UserNameFormType, UserNameFormSchema } from "./private-username-form.validate";
import ConfirmDialog from "@/components/forums/ConfirmDialog";
import { useAccountPrivateStore } from "@/lib/store/accountStore";

const PrivateUserNameForm = () => {
  const queryClient = useQueryClient();
  const { authData } = useAuth();
  const [dialog, setDialog] = React.useState<boolean>(false);
  const [values, setValues] = React.useState<UserNameFormType>({
    new_username: "",
    confirm_new_username: "",
    confirm_password: "",
  });
  const { setIsFormHandle } = useAccountPrivateStore();

  const { isPending: privateUserNameIsPending, mutate: privateUserNameMutate } = useMutation<
    AuthResponse,
    ApiErrorResponse,
    PrivateUserNameAccountBody
  >({
    mutationFn: async (body) => await privateUserNameAccount(body),
    onMutate: () => {
      setIsFormHandle(true);
    },
    onSuccess: (data) => {
      privateUserNameForm.reset();
      queryClient.setQueryData(["auth"], data);
      toast.success("Update username successful!");
    },
    onError: (err) => {
      toast.error(_.get(err?.response?.data, "message", "Update username failed!"));
    },
    onSettled: () => {
      setIsFormHandle(false);
    },
  });

  const privateUserNameForm = useForm<UserNameFormType>({
    resolver: zodResolver(UserNameFormSchema),
    defaultValues: {
      new_username: "",
      confirm_new_username: "",
      confirm_password: authData?.oauth === OAuthProviders.DEFAULT ? "" : "********",
    },
  });
  
  const handleSubmit = (values: UserNameFormType) => {
    setValues(values);
    setDialog((prev) => !prev);
  };

  const handleConfirm = () => {
    privateUserNameMutate({
      ...values,
    });
  };

  return (
    <>
      <ConfirmDialog
        title="Are you sure want to change your username?"
        dialog={dialog}
        setDialog={setDialog}
        onConfirm={handleConfirm}
      >
        This action cannot be undone. This will permanently change your username.
      </ConfirmDialog>
      <Form {...privateUserNameForm}>
        <form
          onSubmit={privateUserNameForm.handleSubmit(handleSubmit)}
          className="space-y-5"
        >
          <FormField
            control={privateUserNameForm.control}
            name="new_username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New username: </FormLabel>
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
                <FormLabel>Confirm new username: </FormLabel>
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
                  <FormLabel>Confirm password: </FormLabel>
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
          <ForumButtonOutline type="submit">
            {!privateUserNameIsPending ? (
              "Update username"
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

export default memo(PrivateUserNameForm);
