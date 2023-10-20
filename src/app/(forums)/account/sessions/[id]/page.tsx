"use client";

import { SessionResponse, SessionRevokeBody, SessionRevokeResponse, sessionAccount, sessionAccountRevoke } from "@/lib/api/accountApi";
import { ApiErrorResponse } from "@/utils/http";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AiFillWarning } from "react-icons/ai";
import { toast } from "react-toastify";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import ConfirmDialog from "@/components/forums/ConfirmDialog";
import _ from "lodash";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/utils/getErrorMessage";

const SessionIP = dynamic(() => import("@/components/forums/Account/Sessions/SessionIP"), {
	loading: () => <span className="loading loading-spinner loading-md" />,
});

const SessionID = ({ params }: { params: { id: string } }) => {
	const { id } = params;
	const queryClient = useQueryClient();
	const [dialog, setDialog] = React.useState(false);
	const router = useRouter();
	const canFetch = useRef<boolean>(true);

	const {
		data: sessionData,
		error: sessionError,
		isFetching: sessionIsFetching,
		isError: sessionIsError,
	} = useQuery<SessionResponse, ApiErrorResponse>({
		queryKey: ["account", "session", id],
		queryFn: async ({ signal }) => await sessionAccount(id, signal),
		enabled: !!id && !_.isEmpty(id) && canFetch.current,
		staleTime: 1000 * 30,
	});

	const {
		mutate: sessionRevokeMutate,
		error: sessionRevokeError,
		isLoading: sessionRevokeLoading,
		isSuccess: sessionRevokeIsSuccess,
		isError: sessionRevokeIsError,
	} = useMutation<SessionRevokeResponse, ApiErrorResponse, SessionRevokeBody>({
		mutationFn: async (id) => await sessionAccountRevoke(id),
	});

	useEffect(() => {
		return () => {
			queryClient.cancelQueries(["account", "session", id]);
		};
	}, [id, queryClient]);

	useEffect(() => {
		if (sessionIsError) {
			toast.error(getErrorMessage(sessionError, "Get session id failed!"));
		}
	}, [sessionError, sessionIsError]);

	useEffect(() => {
		if (sessionRevokeIsSuccess) {
			canFetch.current = false;
			router.replace("/account/sessions");
			queryClient.resetQueries(["account", "sessions"]);
			toast.success("Revoke successful!");
		}
	}, [id, queryClient, router, sessionRevokeIsSuccess]);

	useEffect(() => {
		if (sessionRevokeIsError) {
			toast.error(getErrorMessage(sessionRevokeError, "Revoke session failed!"));
		}
	}, [sessionRevokeError, sessionRevokeIsError]);

	const handleConfirm = () => {
		sessionRevokeMutate({ id });
	};

	if (sessionIsFetching || sessionRevokeLoading) return <span className="loading loading-spinner loading-md" />;

	if (!id || !sessionData)
		return (
			<Alert variant="destructive" className="my-5">
				<AiFillWarning size={21} />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>Session ID invalid !</AlertDescription>
			</Alert>
		);

	return (
		<>
			<ConfirmDialog title="Are you sure want to delete this session?" dialog={dialog} setDialog={setDialog} onConfirm={handleConfirm}>
				This action cannot be undone. This will permanently delete this session and remove this session from our servers..
			</ConfirmDialog>
			<Card>
				<CardHeader>
					<CardTitle>Session details</CardTitle>
					<CardDescription>Careful before do anything !</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					{sessionData?.is_active && (
						<div className="flex items-center gap-2">
							<span className="relative flex h-3 w-3">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
								<span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
							</span>
							<span className="relative badge badge-ghost badge-sm">{sessionData?.is_current ? "Your current session" : "Online"}</span>
						</div>
					)}
					<div className=" flex items-center space-x-4 rounded-md border p-4">
						<div className="flex-1 space-y-1">
							<p className="text-sm font-medium leading-none">{sessionData?.id}</p>
							<p className="text-sm text-muted-foreground">{sessionData?.ip}</p>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<h2>Created at: {new Date(sessionData?.created_at).toLocaleString()}</h2>
						{!sessionData?.is_current && (
							<Button variant="destructive" onClick={() => setDialog(true)}>
								Revoke
							</Button>
						)}
					</div>
				</CardContent>
				<CardFooter className="grid grid-flow-row">
					{!sessionIsFetching && canFetch.current && sessionData && <SessionIP sessionData={sessionData} />}
				</CardFooter>
			</Card>
		</>
	);
};

export default SessionID;
