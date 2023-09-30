/* eslint-disable react/display-name */
"use client";

import React, { memo, useEffect } from "react";
import { SessionsResponse, sessionsAccount } from "@/lib/accountApi";
import { ApiErrorResponse } from "@/utils/http";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TableRow, TableCell } from "@/components/ui/table";
import { ForumButtonOutline } from "@/components/forums/Button";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AiFillWarning } from "react-icons/ai";

const SessionsBody = () => {
	const pathname = usePathname();
	const queryClient = useQueryClient();

	const {
		data: sessionsData,
		error: sessionsError,
		isFetching: sessionsIsFetching,
		isError: sessionsIsError,
	} = useQuery<SessionsResponse[], ApiErrorResponse>({
		queryKey: ["account", "sessions"],
		queryFn: async ({ signal }) => await sessionsAccount(signal),
		staleTime: 1000 * 30,
	});

	useEffect(() => {
		return () => {
			queryClient.removeQueries(["account", "session"]);
			queryClient.cancelQueries(["account", "sessions"]);
		};
	}, [queryClient]);

	useEffect(() => {
		if (sessionsError) {
			toast.error(getErrorMessage(sessionsError, "Get sessions failed!"));
		}
	}, [sessionsError]);

	if (sessionsIsFetching)
		return (
			<>
				<SessionsBodySkeleton />
				<SessionsBodySkeleton />
				<SessionsBodySkeleton />
				<SessionsBodySkeleton />
				<SessionsBodySkeleton />
				<SessionsBodySkeleton />
			</>
		);

	if (sessionsIsError) return <SessionsBodyError />;

	return sessionsData?.map((session, index) => (
		<TableRow key={session?.id}>
			<TableCell className="space-y-2">
				{session?.id}
				<br />
				{session?.is_active && (
					<div className="flex items-center gap-2">
						<span className="relative flex h-3 w-3">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
							<span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
						</span>
						<span className="relative badge badge-ghost badge-sm">{!index ? "Your current session" : "Online"}</span>
					</div>
				)}
			</TableCell>
			<TableCell>{session?.ip}</TableCell>
			<TableCell>{session?.status ? "Active" : "Inactive"}</TableCell>
			<TableCell>{new Date(session?.created_at).toLocaleString()}</TableCell>
			<TableCell className="text-center">
				<Link className="hover:opacity-80 hover:text-forum_pink" href={pathname.concat("/", session?.id)}>
					<ForumButtonOutline>See more</ForumButtonOutline>
				</Link>
			</TableCell>
		</TableRow>
	));
};

export default memo(SessionsBody);

const SessionsBodySkeleton = memo(() => {
	return (
		<TableRow className="animate-pulse rounded-full">
			<TableCell className="text-center">
				<div className="h-8 bg-primary/10" />
			</TableCell>
			<TableCell className="text-center">
				<div className="h-6 bg-primary/10" />
			</TableCell>
			<TableCell className="text-center">
				<div className="h-6 bg-primary/10" />
			</TableCell>
			<TableCell className="text-center">
				<div className="h-6 bg-primary/10" />
			</TableCell>
			<TableCell className="text-center">
				<div className="h-8 bg-primary/10 rounded-full" />
			</TableCell>
		</TableRow>
	);
});

const SessionsBodyError = memo(() => {
	return (
		<TableRow className="rounded-full">
			<TableCell colSpan={5}>
				<Alert variant="destructive" className="my-5">
					<AiFillWarning size={21} />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>Cannot get your sessions</AlertDescription>
				</Alert>
			</TableCell>
		</TableRow>
	);
});
