import React from "react";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import SessionsBody from "@/components/forums/Account/Sessions/SessionBody";
import SessionRevokeAll from "@/components/forums/Account/Sessions/SessionRevokeAll";

const Sessions = () => {
	return (
		<>
			<Table>
				<TableCaption className="space-y-5">
					This is a list of sessions that have been used to log into your account. Revoke any sessions that you do not recognize.
					<br />
					<SessionRevokeAll />
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