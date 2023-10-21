"use client";

import React, { memo, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import _ from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthResponse } from "@/lib/api/authApi";
import { ApiErrorResponse } from "@/utils/http";
import { ForumButtonOutline } from "../../Button";
import { ProfileBody, profileAccount } from "@/lib/api/accountApi";
import { useAuth } from "@/hooks/useAuth";
import ConfirmDialog from "@/components/forums/ConfirmDialog";
import { Textarea } from "@/components/ui/textarea";
import { AiOutlineEdit } from "react-icons/ai";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { ProfileFormSchema, ProfileFormType } from "./profile-form.validate";
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

const ProfileForm = () => {
  const queryClient = useQueryClient();
  const { authData } = useAuth();
  const [dialog, setDialog] = React.useState<boolean>(false);
  const [values, setValues] = React.useState<ProfileBody>({
    display_name: "",
    about: "",
    avatar: null,
  });
  const [selectedImage, setSelectedImage] = React.useState<string>("");

  const avatarInputRef = useRef<HTMLInputElement>(null);

  const { isPending: profileIsPending, mutate: profileMutate } = useMutation<
    AuthResponse,
    ApiErrorResponse,
    ProfileBody
  >({
    mutationFn: async (body) => await profileAccount(body),
    onSuccess: (data) => {
      setSelectedImage("");
      setValues((prev) => ({ ...prev, avatar: null }));
      queryClient.setQueryData(["auth"], data);
      toast.success("Update public info successful!");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Update public info failed!"));
    },
  });

  //* handle image change and preview
  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setValues((prev) => ({ ...prev, avatar: file }));
    }
  }, []);

  const profileForm = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      display_name: authData?.display_name || "",
      about: authData?.about || "",
    },
  });

  const handleSubmit = useCallback((values: ProfileFormType) => {
    setValues((prev) => ({ ...prev, ...values }));
    setDialog(true);
  }, []);

  const handleConfirm = useCallback(() => {
    profileMutate({
      ...values,
    });
  }, [profileMutate, values]);

  useEffect(() => {
    return () => {
      selectedImage && URL.revokeObjectURL(selectedImage);
    };
  }, [selectedImage]);

  return (
    <>
      <ConfirmDialog
        title="Are you sure want to change your public info?"
        dialog={dialog}
        setDialog={setDialog}
        onConfirm={handleConfirm}
      >
        This action cannot be undone. This will permanently change your account profile.
      </ConfirmDialog>
      <Form {...profileForm}>
        <div className="grid lg:grid-flow-col items-start">
          <form onSubmit={profileForm.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={profileForm.control}
              name="display_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display name: </FormLabel>
                  <FormControl>
                    <Input type="text" placeholder={authData?.display_name} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={profileForm.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>About: </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={authData?.about}
                      defaultValue={authData?.about}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ForumButtonOutline type="submit">
              {!profileIsPending ? (
                "Update profile"
              ) : (
                <>
                  Loading... <span className="loading loading-spinner loading-xs ml-1" />
                </>
              )}
            </ForumButtonOutline>
          </form>
          <div className="px-14 center flex items-center justify-center mx-auto lg_max:order-first">
            <div className="relative">
              <div
                className="relative group cursor-pointer rounded-full overflow-hidden ring-4 ring-forum_pink"
                onClick={() => avatarInputRef.current?.click()}
              >
                <Avatar>
                  <AvatarImage
                    src={selectedImage || authData?.avatar || "/guest.webp"}
                    alt="Profile Avatar"
                    className="rounded-full w-28 h-28 lg:w-40 lg:h-40 object-fill object-center transition-transform transform group-hover:grayscale-0 group-hover:opacity-20"
                  />
                  <AvatarFallback>{authData?.username} Avatar</AvatarFallback>
                </Avatar>
                <p className="absolute bottom-0 inset-0 rounded-full text-center flex items-center justify-center lg:text-lg text-forum_pink font-bold shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  Click here to edit avatar
                </p>
              </div>
              <label className="cursor-pointer absolute bottom-5 left-0">
                <span className="flex items-center gap-1 mt-2 leading-normal p-2 bg-forum_gray text-white text-sm rounded-full hover:text-forum_black hover:scale-105">
                  <AiOutlineEdit size={16} />
                  Edit
                </span>
                <input
                  type="file"
                  className="hidden"
                  name="avatar"
                  ref={avatarInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
        </div>
      </Form>
      {/* <form className="space-y-20" encType="multipart/form-data" onSubmit={(e) => handleSubmit(e)}>
        <div className="grid lg:grid-flow-col items-start">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name">Display name</Label>
              <Input
                name="display_name"
                placeholder={authData?.display_name}
                defaultValue={authData?.display_name}
                ref={displayNameInputRef}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="name">Bio</Label>
              <Textarea
                name="about"
                placeholder={authData?.about}
                defaultValue={authData?.about}
                ref={aboutAreaRef}
              />
            </div>
          </div>
          <div className="px-14 center flex items-center justify-center mx-auto lg_max:order-first">
            <div className="relative">
              <div
                className="relative group cursor-pointer rounded-full overflow-hidden ring-4 ring-forum_pink"
                onClick={() => avatarInputRef.current?.click()}
              >
                <Avatar>
                  <AvatarImage
                    src={selectedImage || authData?.avatar || "/guest.webp"}
                    alt="Profile Avatar"
                    className="rounded-full w-28 h-28 lg:w-40 lg:h-40 object-fill object-center transition-transform transform group-hover:grayscale-0 group-hover:opacity-20"
                  />
                  <AvatarFallback>{authData?.username} Avatar</AvatarFallback>
                </Avatar>
                <p className="absolute bottom-0 inset-0 rounded-full text-center flex items-center justify-center lg:text-lg text-forum_pink font-bold shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  Click here to edit avatar
                </p>
              </div>
              <label className="cursor-pointer absolute bottom-5 left-0">
                <span className="flex items-center gap-1 mt-2 leading-normal p-2 bg-forum_gray text-white text-sm rounded-full hover:text-forum_black hover:scale-105">
                  <AiOutlineEdit size={16} />
                  Edit
                </span>
                <input
                  type="file"
                  className="hidden"
                  name="avatar"
                  ref={avatarInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
        </div>
        <ForumButtonOutline type="submit" disabled={profileIsPending}>
          {!profileIsPending ? (
            "Update profile"
          ) : (
            <>
              Loading... <span className="loading loading-spinner loading-xs ml-1" />
            </>
          )}
        </ForumButtonOutline>
      </form> */}
    </>
  );
};

export default memo(ProfileForm);
