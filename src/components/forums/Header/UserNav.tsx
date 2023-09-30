/* eslint-disable react/display-name */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { LogoutAuthResponse, logoutAuth } from "@/lib/authApi";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { ApiErrorResponse } from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmDialog from "../ConfirmDialog";

const DropdownMenuContent = dynamic(() => import("@/components/ui/dropdown-menu").then((mod) => mod.DropdownMenuContent));

export const UserNav = memo(() => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [dialog, setDialog] = useState(false);

	const {
		mutate: logoutMutate,
		error: logoutError,
		isSuccess: logoutIsSuccess,
		isLoading: logoutIsLoading,
		isError: logoutIsError,
	} = useMutation<any, ApiErrorResponse>({
		mutationFn: async () => await logoutAuth(),
	});

	const handleLogout = () => {
		setDialog(true);
	};

	const handleConfirm = () => {
		logoutMutate();
	};

	useEffect(() => {
		if (logoutIsLoading) toast.loading("Logging out...");
		else toast.dismiss();
	}, [logoutIsLoading]);

	useEffect(() => {
		if (logoutIsSuccess) {
			queryClient.clear();
			router.replace("/login");
			toast.success("Logout successful!");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [logoutIsSuccess]);

	useEffect(() => {
		if (logoutIsError) {
			toast.error(getErrorMessage(logoutError, "Logout failed!"));
		}
	}, [logoutError, logoutIsError]);

	const { data: authData, isLoading: authLoading } = useAuth();

	if (authLoading) return <Skeleton className="h-12 w-12 rounded-full bg-forum_gray" />;
	else if (!authData) return;

	return (
		<>
			<ConfirmDialog title="Are you sure want to logout?" dialog={dialog} setDialog={setDialog} onConfirm={handleConfirm}>
				This action will logout your account and you cannot undo this action.
			</ConfirmDialog>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Avatar className="h-10 w-10 cursor-pointer ring ring-forum_pink">
						<AvatarImage src={authData?.avatar || "/guest.webp"} alt="User Avatar" />
						<AvatarFallback>Avatar</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">{authData?.username}</p>
							<p className="text-xs leading-none text-muted-foreground">{authData?.email}</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem>
							Profile
							<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
						</DropdownMenuItem>
						<Link href="/account">
							<DropdownMenuItem>
								My Account
								<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
							</DropdownMenuItem>
						</Link>
						<DropdownMenuItem>
							Settings
							<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>New Team</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleLogout} disabled={logoutIsLoading}>
						{logoutIsLoading ? "Logging out..." : "Logout"}
						<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
});
