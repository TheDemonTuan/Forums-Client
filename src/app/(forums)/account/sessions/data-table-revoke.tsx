import ConfirmDialog from "@/components/forums/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  SessionRevokeAllKey,
  SessionRevokeAllResponse,
  SessionRevokeSelectedKey,
  SessionRevokeSelectedResponse,
  SessionsKey,
  SessionsResponse,
  sessionAccountRevokeAll,
  sessionAccountRevokeSelected,
} from "@/lib/api/accountApi";
import { useAccountSessionsStore } from "@/lib/store/accountStore";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { ApiErrorResponse } from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface DataTableRevokeProps<TData> {
  table: Table<TData>;
}

export function DataTableRevoke<TData>({ table }: DataTableRevokeProps<TData>) {
  const { setTableHandle } = useAccountSessionsStore();
  const [dialog, setDialog] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const listRows = table.getFilteredRowModel().rows;
  const listSelectedRows = useRef<string[]>([]);

  const { mutate: sessionRevokeSelectedMutate, isPending: sessionRevokeSelectedIsPending } =
    useMutation<SessionRevokeSelectedResponse, ApiErrorResponse, string[]>({
      mutationKey: SessionRevokeSelectedKey,
      mutationFn: async (body) => await sessionAccountRevokeSelected(body),
      onMutate: () => {
        setTableHandle(true);
      },
      onSuccess: (data) => {
        const sessionsQueryData = queryClient.getQueryData<SessionsResponse[]>(SessionsKey);
        if (!sessionsQueryData) {
          queryClient.invalidateQueries({
            queryKey: SessionsKey,
          });
        } else {
          queryClient.setQueryData<SessionsResponse[]>(
            SessionsKey,
            sessionsQueryData.filter((session) => !listSelectedRows.current?.includes(session?.id))
          );
        }
        table.resetRowSelection();
        toast.success(data?.message || "Selected sessions revoked");
      },
      onError: (err) => {
        toast.error(getErrorMessage(err, "Failed to revoke selected sessions"));
      },
      onSettled: () => {
        setTableHandle(false);
      },
    });

  const { mutate: sessionRevokeAllMutate, isPending: sessionRevokeAllIsPending } = useMutation<
    SessionRevokeAllResponse,
    ApiErrorResponse
  >({
    mutationKey: SessionRevokeAllKey,
    mutationFn: async () => await sessionAccountRevokeAll(),
    onMutate: () => {
      setTableHandle(true);
    },
    onSuccess: (data) => {
      const sessionsQueryData = queryClient.getQueryData<SessionsResponse[]>(SessionsKey);
      if (!sessionsQueryData) {
        queryClient.invalidateQueries({
          queryKey: SessionsKey,
        });
      } else {
        queryClient.setQueryData<SessionsResponse[]>(
          SessionsKey,
          sessionsQueryData.filter((session, index) => !index)
        );
      }
      toast.success(data?.message || "All sessions revoked");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Failed to revoke all sessions"));
    },
    onSettled: () => {
      setTableHandle(false);
    },
  });

  const handleConfirm = useCallback(() => {
    if (selectedRows?.length > 0) {
      sessionRevokeSelectedMutate(listSelectedRows.current);
    } else {
      sessionRevokeAllMutate();
    }
    setDialog(false);
  }, [selectedRows, sessionRevokeAllMutate, sessionRevokeSelectedMutate]);

  useEffect(() => {
    listSelectedRows.current = selectedRows.map((row) => row?.getValue("id"));
    return () => {
      setTableHandle(false);
      listSelectedRows.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRows]);

  const buttonIsLoading = sessionRevokeAllIsPending || sessionRevokeSelectedIsPending;

  return (
    <>
      <ConfirmDialog
        title="Are you sure want to revoke session?"
        dialog={dialog}
        setDialog={setDialog}
        onConfirm={handleConfirm}
      >
        This action cannot be undone. This will permanently delete this session and remove this
        session from our servers.
      </ConfirmDialog>
      <div className="flex items-center justify-center px-2">
        <Button
          variant="destructive"
          onClick={() => setDialog(true)}
          disabled={
            listRows?.length === 1 ||
            listSelectedRows.current?.includes(listRows[0]?.getValue("id"))
          }
        >
          {!buttonIsLoading ? (
            selectedRows?.length > 0 ? (
              `Revoke ${table.getFilteredSelectedRowModel().rows?.length} selected`
            ) : (
              "Revoke all"
            )
          ) : (
            <>
              Loading... <span className="loading loading-spinner loading-xs ml-1" />
            </>
          )}
        </Button>
      </div>
    </>
  );
}
