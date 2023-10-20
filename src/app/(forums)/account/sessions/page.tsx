"use client";

import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SessionRevokeAll from "@/components/forums/Account/Sessions/SessionRevokeAll";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { SessionsResponse, sessionsAccount } from "@/lib/api/accountApi";
import { ApiErrorResponse } from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

const Sessions = () => {
  const {
    data: sessionsData,
    error: sessionsError,
    isSuccess: sessionsIsSuccess,
    isFetching: sessionsIsFetching,
    isError: sessionsIsError,
  } = useQuery<SessionsResponse[], ApiErrorResponse>({
    queryKey: ["account", "sessions"],
    queryFn: async ({ signal }) => await sessionsAccount(signal),
    staleTime: 1000 * 30,
  });

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sessions!</h2>
          <p className="text-muted-foreground">
            This is a list of sessions that have been used to log into your account. Revoke any
            sessions that you do not recognize.
          </p>
        </div>
      </div>
      <DataTable columns={columns} data={sessionsData ?? []} />
    </div>
  );
};

export default Sessions;
