import { Button } from "@/components/ui/button";
import {
  SessionRevokeSelectedKey,
  SessionRevokeSelectedResponse,
  SessionsKey,
  SessionsResponse,
  sessionAccountRevokeSelected,
} from "@/lib/api/accountApi";
import { useAccountSessionsStore } from "@/lib/store/accountStore";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { ApiErrorResponse } from "@/utils/http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Table } from "@tanstack/react-table";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

interface DataTableRevokeSelectedProps<TData> {
  table: Table<TData>;
}

export function DataTableRevokeSelected<TData>({ table }: DataTableRevokeSelectedProps<TData>) {
  const queryClient = useQueryClient();
  const listSelectedRows = useRef<string[]>([]);
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const { setTableHandle } = useAccountSessionsStore();

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

  useEffect(() => {
    listSelectedRows.current = selectedRows.map((row) => row?.getValue("id"));
  }, [selectedRows]);

  useEffect(() => {
    return () => {
      listSelectedRows.current = [];
      setTableHandle(false);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center px-2">
      {selectedRows.length > 0 && (
        <Button
          variant="destructive"
          onClick={() => sessionRevokeSelectedMutate(listSelectedRows.current)}
        >
          {!sessionRevokeSelectedIsPending ? (
            `Revoke ${selectedRows.length} selected`
          ) : (
            <>
              Loading... <span className="loading loading-spinner loading-xs ml-1" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
