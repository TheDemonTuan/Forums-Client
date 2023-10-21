"use client";

import React, { useEffect } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { SessionsKey, SessionsResponse, sessionsAccount } from "@/lib/api/accountApi";
import { ApiErrorResponse } from "@/utils/http";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccountSessionsStore } from "@/lib/store/accountStore";
import DataTableSkelton from "@/components/common/data-table/data-table-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AiFillWarning } from "react-icons/ai";
import { getErrorMessage } from "@/utils/getErrorMessage";

const Sessions = () => {
  const queryClient = useQueryClient();
  const { isTableHandle } = useAccountSessionsStore();
  const {
    data: sessionsData,
    error: sessionsError,
    isLoading: sessionsIsLoading,
    isError: sessionsIsError,
  } = useQuery<SessionsResponse[], ApiErrorResponse>({
    queryKey: SessionsKey,
    queryFn: async ({ signal }) => await sessionsAccount(signal),
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    return () => {
      queryClient.cancelQueries({
        queryKey: SessionsKey,
      });
    };
  }, []);

  if (sessionsIsError)
    return (
      <Alert variant="destructive" className="my-5">
        <AiFillWarning size={21} />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {getErrorMessage(sessionsError, "An error occurred while fetching sessions")}
        </AlertDescription>
      </Alert>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sessions Manager!</h2>
          <p className="text-muted-foreground">
            This is a list of sessions that have been used to log into your account. Revoke any
            sessions that you do not recognize.
          </p>
        </div>
      </div>
      <div className={`${isTableHandle && "pointer-events-none opacity-50"}`}>
        {sessionsIsLoading ? (
          <DataTableSkelton />
        ) : (
          <DataTable columns={columns} data={sessionsData ?? []} />
        )}
      </div>
    </div>
  );
};

export default Sessions;
