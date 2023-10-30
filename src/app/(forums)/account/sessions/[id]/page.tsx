"use client";

import {
  SessionResponse,
  SessionRevokeBody,
  SessionRevokeResponse,
  SessionStatusChangeBody,
  SessionsKey,
  SessionsResponse,
  sessionAccount,
  sessionAccountRevoke,
  sessionAccountStatusChange,
} from "@/lib/api/accountApi";
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
import { ChevronDownIcon, PlusIcon, StarIcon } from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { GrLocation } from "react-icons/gr";
import { usePathsName } from "@/hooks/usePathsName";

const SessionIP = dynamic(() => import("@/components/forums/Account/Sessions/SessionIP"), {
  loading: () => <span className="loading loading-spinner loading-md" />,
});

const SessionID = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const queryClient = useQueryClient();
  const [dialog, setDialog] = React.useState(false);
  const router = useRouter();
  const { paths } = usePathsName();

  const {
    data: sessionData,
    error: sessionError,
    isLoading: sessionIsLoading,
    isError: sessionIsError,
  } = useQuery<SessionResponse, ApiErrorResponse>({
    queryKey: [...SessionsKey, id],
    queryFn: async ({ signal }) => await sessionAccount(id, signal),
    staleTime: 1000 * 30,
    enabled: !!id,
  });

  const { mutate: sessionRevokeMutate, isPending: sessionRevokeIsPending } = useMutation<
    SessionRevokeResponse,
    ApiErrorResponse,
    SessionRevokeBody
  >({
    mutationFn: async (id) => await sessionAccountRevoke(id),
    onSuccess: (data) => {
      router.replace(`/${paths[1]}/${paths[2]}`);
      const sessionsQueryData = queryClient.getQueryData<SessionsResponse[]>(SessionsKey);
      sessionsQueryData &&
        queryClient.setQueryData<SessionsResponse[]>(
          SessionsKey,
          sessionsQueryData.filter((session) => session?.id !== id)
        );
      queryClient.removeQueries({
        queryKey: [...SessionsKey, id],
      });
      toast.success(data?.message || "Revoke session successful!");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Revoke session failed!"));
    },
  });

  const handleConfirm = () => {
    sessionRevokeMutate({ id });
  };

  const { mutate: sessionStatusChange, isPending: sessionStatusIsPending } = useMutation<
    SessionResponse,
    ApiErrorResponse,
    SessionStatusChangeBody
  >({
    mutationFn: async (body) => await sessionAccountStatusChange(body),
    onSuccess: (data) => {
      const sessionQueryData = queryClient.getQueryData<SessionResponse>([...SessionsKey, id]);
      !sessionQueryData
        ? queryClient.invalidateQueries({
            queryKey: [...SessionsKey, id],
          })
        : queryClient.setQueryData<SessionResponse>([...SessionsKey, id], {
            ...data,
          });

      const sessionsQueryData = queryClient.getQueryData<SessionsResponse[]>(SessionsKey);
      sessionsQueryData &&
        queryClient.setQueryData<SessionsResponse[]>(
          SessionsKey,
          sessionsQueryData.map((session) => {
            if (session?.id === id) {
              return {
                ...session,
                ...data,
              };
            }
            return session;
          })
        );
      toast.success("Session status change successful!");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Revoke session failed!"));
    },
  });

  const handleStatus = (status: boolean) => {
    sessionStatusChange({ id, status });
  };

  const cardContentIsPending = sessionRevokeIsPending || sessionStatusIsPending;

  useEffect(() => {
    return () => {
      queryClient.cancelQueries({
        queryKey: [...SessionsKey, id],
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (sessionIsError)
    return (
      <Alert variant="destructive" className="my-5">
        <AiFillWarning size={21} />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{getErrorMessage(sessionError, "An error occurred while fetching session")}</AlertDescription>
      </Alert>
    );

  if (sessionIsLoading) return <span className="loading loading-spinner loading-md" />;

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
      <ConfirmDialog
        title="Are you sure want to delete this session?"
        dialog={dialog}
        setDialog={setDialog}
        onConfirm={handleConfirm}>
        This action cannot be undone. This will permanently delete this session and remove this session from our
        servers.
      </ConfirmDialog>
      <Card>
        <CardHeader className="lg_max:p-3">
          <CardTitle>Session details</CardTitle>
          <CardDescription>
            <Alert variant="warning">
              <AiFillWarning size={21} />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>Careful before do anything !</AlertDescription>
            </Alert>
          </CardDescription>
        </CardHeader>
        <CardContent
          className={`flex justify-center lg_max:p-3 ${cardContentIsPending && "pointer-events-none opacity-50"}`}>
          <Card className="lg_max:w-full">
            <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0 lg_max:p-4">
              <div className="space-y-1 md_max:w-28">
                <CardTitle className="md_max:overflow-auto">
                  {cardContentIsPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs mr-2" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    `#${sessionData?.id}`
                  )}
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="relative flex h-3 w-3">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                          sessionData?.is_active ? "bg-green-400" : "bg-red-400"
                        } opacity-75`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-3 w-3 ${
                          sessionData?.is_active ? "bg-green-400" : "bg-red-400"
                        }`}
                      />
                    </span>
                    <span className="relative md:badge md:badge-ghost md:badge-sm">
                      {sessionData?.is_current ? "Your current session" : sessionData?.is_active ? "Online" : "Offline"}
                    </span>
                  </div>
                </CardDescription>
              </div>
              <div className="flex items-center space-x-1 rounded-md bg-secondary text-secondary-foreground">
                <Button variant="secondary" className="px-2 shadow-none">
                  <StarIcon className="mr-2 h-4 w-4" />
                  Status
                </Button>
                <Separator orientation="vertical" className="h-[20px]" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" className="px-2 shadow-none">
                      <ChevronDownIcon className="h-4 w-4 text-secondary-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" alignOffset={-5} className="w-[200px]" forceMount>
                    <DropdownMenuLabel>Status Lists</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      disabled={sessionData?.status}
                      checked={sessionData?.status || sessionData?.is_current}
                      onClick={() => handleStatus(true)}>
                      Active
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      disabled={!sessionData?.status || sessionData?.is_current}
                      checked={!sessionData?.status}
                      onClick={() => handleStatus(false)}>
                      Inactive
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="lg_max:p-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-2 space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <GrLocation size={18} className="mr-1 fill-sky-400 text-sky-400" />
                  {sessionData?.ip}
                </div>
                <div>Created at: {new Date(sessionData?.created_at).toLocaleString()}</div>
                <>
                  {!sessionData?.is_current && (
                    <Button variant="destructive" onClick={() => setDialog(true)}>
                      Revoke
                    </Button>
                  )}
                </>
              </div>
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="grid grid-flow-row lg_max:p-3">
          {!sessionIsLoading && sessionData && <SessionIP sessionData={sessionData} />}
        </CardFooter>
      </Card>
    </>
  );
};

export default SessionID;
