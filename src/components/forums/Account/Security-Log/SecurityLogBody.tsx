/* eslint-disable react/display-name */
"use client";

import React, { memo, useEffect } from "react";
import { SecurityLogResponse, securityLogAccount } from "@/lib/api/accountApi";
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
    data: securityLogData,
    error: securityLogError,
    isFetching: securityLogIsFetching,
    isError: securityLogIsError,
  } = useQuery<SecurityLogResponse[], ApiErrorResponse>({
    queryKey: ["account", "security-log"],
    queryFn: async ({ signal }) => await securityLogAccount(signal),
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    return () => {
      queryClient.cancelQueries({
        queryKey: ["account", "security-log"],
      });
    };
  }, [queryClient]);

  useEffect(() => {
    if (securityLogIsError) {
      toast.error(getErrorMessage(securityLogError, "Get security log failed!"));
    }
  }, [securityLogIsError, securityLogError]);

  if (securityLogIsFetching)
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

  if (securityLogIsError) return <SessionsBodyError />;

  return securityLogData?.map((securityLog, index) => (
    <TableRow key={securityLog?.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>{securityLog?.browser}</TableCell>
      <TableCell>{securityLog?.device}</TableCell>
      <TableCell className="capitalize">{securityLog?.device_type}</TableCell>
      <TableCell>{securityLog?.engine}</TableCell>
      <TableCell>{securityLog?.os}</TableCell>
      <TableCell>{securityLog?.cpu}</TableCell>
      <TableCell>{securityLog?.ip}</TableCell>
      <TableCell>{new Date(securityLog?.created_at).toLocaleString()}</TableCell>
      <TableCell className="text-center">
        <Link
          className="hover:opacity-80 hover:text-forum_pink"
          href={pathname.concat("/", securityLog?.id?.toString())}
        >
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
