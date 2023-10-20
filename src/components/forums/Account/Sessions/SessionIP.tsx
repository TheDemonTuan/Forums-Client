import { SessionIpResponse, SessionResponse, sessionIpAccount } from "@/lib/api/accountApi";
import { ApiErrorResponse } from "@/utils/http";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { memo, useEffect } from "react";
import { toast } from "react-toastify";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getErrorMessage } from "@/utils/getErrorMessage";

const SessionIP = ({ sessionData }: { sessionData: SessionResponse }) => {
	const queryClient = useQueryClient();

	const {
		data: sessionIpData,
		error: sessionIpError,
		isFetching: sessionIpIsFetching,
	} = useQuery<SessionIpResponse, ApiErrorResponse>({
		queryKey: ["account", "session", sessionData?.id, sessionData?.ip],
		queryFn: async ({ signal }) => await sessionIpAccount("14.161.48.112", signal),
	});

	useEffect(() => {
		return () => {
			queryClient.cancelQueries(["account", "session", sessionData?.id, sessionData?.ip]);
		};
	}, [queryClient, sessionData?.id, sessionData?.ip]);

	useEffect(() => {
		if (sessionIpError) {
			toast.error(getErrorMessage(sessionIpError, "Get session IP failed!"));
		}
	}, [sessionIpError]);

	if (sessionIpIsFetching) return <span className="loading loading-spinner loading-md" />;

	return (
		<>
			<Table>
				<TableCaption>
					This is a tables provides you with location information such as the country, state, city, zip code, latitude/longitude, ISP, area code, and
					other information.
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Continent</TableHead>
						<TableHead>Country</TableHead>
						<TableHead>Region Name</TableHead>
						<TableHead>District</TableHead>
						<TableHead>Zip</TableHead>
						<TableHead>City</TableHead>
						<TableHead>Time Zone</TableHead>
						<TableHead>ISP</TableHead>
						<TableHead>AS</TableHead>
						<TableHead>Mobile</TableHead>
						<TableHead>Proxy</TableHead>
						<TableHead>Hosting</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell>{sessionIpData?.continent}</TableCell>
						<TableCell>{sessionIpData?.country}</TableCell>
						<TableCell>{sessionIpData?.regionName}</TableCell>
						<TableCell>{sessionIpData?.district}</TableCell>
						<TableCell>{sessionIpData?.zip}</TableCell>
						<TableCell>{sessionIpData?.city}</TableCell>
						<TableCell>{sessionIpData?.timezone}</TableCell>
						<TableCell>{sessionIpData?.isp}</TableCell>
						<TableCell>{sessionIpData?.as}</TableCell>
						<TableCell>{sessionIpData?.mobile ? "Yes" : "No"}</TableCell>
						<TableCell>{sessionIpData?.proxy ? "Yes" : "No"}</TableCell>
						<TableCell>{sessionIpData?.hosting ? "Yes" : "No"}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
			<iframe
				className="w-full h-96 rounded-md mt-5"
				src={`https://maps.google.com/maps?q=${sessionIpData?.lat},${sessionIpData?.lon}&z=15&output=embed&embedded=true`}
			/>
		</>
	);
};

export default memo(SessionIP);
