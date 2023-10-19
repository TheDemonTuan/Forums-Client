<<<<<<< HEAD
"use client";

import { SecurityLogResponse, securityLogAccount } from "@/lib/accountApi";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { ApiErrorResponse } from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";

const SecurityLog = () => {
  const {
    data: securityLogData,
    error: securityLogError,
    isFetching: securityLogIsFetching,
    isError: securityLogIsError,
  } = useQuery<SecurityLogResponse[], ApiErrorResponse>({
    queryKey: ["account", "security-log"],
    queryFn: async ({ signal }) => await securityLogAccount(signal),
    staleTime: 1000 * 30,
  });

  if (securityLogIsFetching) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">Here&apos;s a list of your tasks for this month!</p>
        </div>
      </div>
      <DataTable columns={columns} data={securityLogData ?? []} />
    </div>
=======
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SecurityLogBody from "@/components/forums/Account/Security-Log/SecurityLogBody";
const SecurityLog = () => {
  return (
    <>
      <Table>
        <TableCaption className="space-y-5">
          This is a list of devices that have logged into your account
          <br />
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Browser</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Device Type</TableHead>
            <TableHead>Engine</TableHead>
            <TableHead>OS</TableHead>
            <TableHead>CPU</TableHead>
            <TableHead>IP</TableHead>
            <TableHead>Create At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SecurityLogBody />
        </TableBody>
      </Table>
    </>
>>>>>>> c58e3b02d0443a4187075c7d2b23c9a1cc4122d4
  );
};

export default SecurityLog;
