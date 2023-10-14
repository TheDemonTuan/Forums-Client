/* eslint-disable react/display-name */
"use client";

import React, { memo, useCallback, useEffect } from "react";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import SessionsBody from "@/components/forums/Account/Sessions/SessionBody";
import ConfirmDialog from "@/components/forums/ConfirmDialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SessionRevokeAllResponse, SessionsResponse, sessionAccountRevokeAll, sessionsAccount } from "@/lib/accountApi";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { ApiErrorResponse } from "@/utils/http";

const Sessions = () => {
	return (
		<>
			<Table>
				<TableCaption className="space-y-5">
					This is a list of sessions that have been used to log into your account. Revoke any sessions that you do not recognize.
					<br />
					<RevokeALl />
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Session ID</TableHead>
						<TableHead>IP</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead className="text-center">Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<SessionsBody />
				</TableBody>
			</Table>
		</>
	);
};

export default Sessions;

const RevokeALl = memo(() => {
	const [dialog, setDialog] = React.useState(false);
	const queryClient = useQueryClient();

	const {
		mutate: sessionRevokeAllMutate,
		error: sessionRevokeAllError,
		isLoading: sessionRevokeAllLoading,
		isSuccess: sessionRevokeAllIsSuccess,
		isError: sessionRevokeAllIsError,
	} = useMutation<SessionRevokeAllResponse, ApiErrorResponse>({
		mutationFn: async () => await sessionAccountRevokeAll(),
	});

	const { isFetching: sessionsIsFetching } = useQuery<SessionsResponse[], ApiErrorResponse>({
		queryKey: ["account", "sessions"],
		queryFn: async ({ signal }) => await sessionsAccount(signal),
	});

	const handleRevokeAll = () => {
		setDialog(true);
	};

	const handleConfirm = useCallback(() => {
		sessionRevokeAllMutate();
	}, [sessionRevokeAllMutate]);

	useEffect(() => {
		if (sessionRevokeAllIsSuccess) {
			queryClient.invalidateQueries(["account", "sessions"]);
			toast.success("Revoke all session successful!");
		}
	}, [queryClient, sessionRevokeAllIsSuccess]);

	useEffect(() => {
		if (sessionRevokeAllIsError) {
			toast.error(getErrorMessage(sessionRevokeAllError, "Revoke all session failed!"));
		}
	}, [sessionRevokeAllError, sessionRevokeAllIsError]);

	return (
		<>
			<ConfirmDialog title="Are you sure want to revoke all session?" dialog={dialog} setDialog={setDialog} onConfirm={handleConfirm}>
				This action cannot be undone. This will permanently delete this session and remove this session from our servers..
			</ConfirmDialog>
			<Button className="ml-2" variant={"destructive"} onClick={handleRevokeAll} disabled={sessionsIsFetching || sessionRevokeAllLoading}>
				{sessionsIsFetching || sessionRevokeAllLoading ? <span className="loading loading-spinner loading-md" /> : "Revoke All"}
			</Button>
		</>
	);
});
