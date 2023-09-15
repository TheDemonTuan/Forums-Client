"use client";

import React, { memo, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import _ from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthResponse } from "@/lib/authApi";
import { ApiErrorResponse } from "@/utils/http";
import { ForumButtonOutline } from "../../Button";
import { PublicBody, publicAccount } from "@/lib/accountApi";
import { useAuth } from "@/hooks/useAuth";
import ConfirmDialog from "@/components/forums/ConfirmDialog";
import { BiError } from "react-icons/bi";
import { Textarea } from "@/components/ui/textarea";
import { AiOutlineEdit } from "react-icons/ai";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const ProfileForm = () => {
	const queryClient = useQueryClient();
	const { data: authData } = useAuth();
	const [modal, setModal] = React.useState<boolean>(false);
	const [selectedImage, setSelectedImage] = React.useState<string>("");
	const [image, setImage] = React.useState<File>();

	const displayNameInputRef = useRef<HTMLInputElement>(null);
	const aboutAreaRef = useRef<HTMLTextAreaElement>(null);
	const avatarInputRef = useRef<HTMLInputElement>(null);

	const { isLoading, mutate } = useMutation<AuthResponse, ApiErrorResponse, PublicBody>({
		mutationFn: async (body) => await publicAccount(body),
		onSuccess: (data) => {
			setSelectedImage("");
			setImage(undefined);
			queryClient.setQueryData(["auth"], data);
			toast.success("Update public info successful!");
		},
		onError: (err) => {
			toast.error(_.get(err?.response?.data, "message", "Update avatar failed!"));
		},
	});

	useEffect(() => {
		return () => {
			selectedImage && URL.revokeObjectURL(selectedImage);
		};
	}, [selectedImage]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) return;
		const file = e.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setSelectedImage(imageUrl);
			setImage(file);
			avatarInputRef.current?.value && (avatarInputRef.current.value = "");
		}
	};

	const handleConfirm = () => {
		mutate({
			display_name: displayNameInputRef.current?.value || "",
			about: aboutAreaRef.current?.value || "",
			avatar: image || null,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setModal(true);
	};

	return (
		<>
			<ConfirmDialog title="Confirm your public info changed?" open={modal} onClose={() => setModal(false)} onConfirm={handleConfirm}>
				<BiError size={24} />
				Are you sure you want to change your public info?
			</ConfirmDialog>
			<form className="space-y-3" encType="multipart/form-data" onSubmit={(e) => handleSubmit(e)}>
				<div className="grid lg:grid-flow-col items-start">
					<div className="space-y-3">
						<div className="space-y-1">
							<Label htmlFor="name">Display name</Label>
							<Input name="display_name" placeholder={authData?.display_name} defaultValue={authData?.display_name} ref={displayNameInputRef} />
						</div>
						<div className="space-y-1">
							<Label htmlFor="name">Bio</Label>
							<Textarea name="about" placeholder={authData?.about} defaultValue={authData?.about} ref={aboutAreaRef} />
						</div>
					</div>
					<div className="px-14 center flex items-center justify-center mx-auto lg_max:order-first">
						<div className="relative">
							<div
								className="relative group cursor-pointer rounded-full overflow-hidden ring-4 ring-forum_pink"
								onClick={() => avatarInputRef.current?.click()}>
								<Avatar>
									<AvatarImage
										src={selectedImage || authData?.avatar || "/guest.webp"}
										alt="Profile Avatar"
										className="rounded-full w-32 h-32 lg:w-52 lg:h-52 object-fill object-center transition-transform transform group-hover:grayscale-0 group-hover:opacity-20"
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
								<input type="file" className="hidden" name="avatar" ref={avatarInputRef} onChange={handleImageChange} />
							</label>
						</div>
					</div>
				</div>
				<ForumButtonOutline type="submit" className="w-max" disabled={isLoading}>
					{isLoading && <span className="loading loading-spinner loading-xs mr-2" />}
					{!isLoading ? "Update profile" : "Loading..."}
				</ForumButtonOutline>
			</form>
		</>
	);
};

export default memo(ProfileForm);
