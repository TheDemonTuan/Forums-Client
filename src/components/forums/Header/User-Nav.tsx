"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { logoutAuth } from "@/libs/authApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const UserNav = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { mutate: logoutMutate, isLoading: logoutLoading } = useMutation({
		mutationFn: async () => await logoutAuth(),
		onSuccess: () => {
			queryClient.setQueriesData(["auth"], null);
			router.replace("/login");
			toast.success("Logout successful!");
		},
		onError: () => {
			toast.error("Logout failed!");
		},
	});

	const handleLogout = async () => {
		logoutMutate();
	};

	const { data: authData } = useAuth();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="h-10 w-10 cursor-pointer ring ring-forum_pink">
					<AvatarImage src={authData?.userInfo?.avatar} alt="User Avatar" />
					<AvatarFallback>Avatar</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">@{authData?.userInfo?.username}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{authData?.userInfo?.email}
						</p>
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
				<DropdownMenuItem onClick={handleLogout} disabled={logoutLoading}>
					{logoutLoading ? "Logging out..." : "Logout"}
					<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserNav;
