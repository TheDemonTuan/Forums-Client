"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GrView } from "react-icons/gr";
import { statuses } from "./data";
import { sessionsSchema } from "./schema";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/forums/ConfirmDialog";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SessionRevokeBody,
  SessionRevokeResponse,
  SessionsResponse,
  sessionAccountRevoke,
} from "@/lib/api/accountApi";
import { ApiErrorResponse } from "@/utils/http";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/getErrorMessage";

// import { labels } from "../data/data"
// import { taskSchema } from "../data/schema"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const sessions = sessionsSchema.parse(row.original);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState<boolean>(false);

  const handleSeeMore = () => {};

  const { mutate: sessionRevokeMutate } = useMutation<
    SessionRevokeResponse,
    ApiErrorResponse,
    SessionRevokeBody
  >({
    mutationFn: async (id) => await sessionAccountRevoke(id),
    onSuccess: () => {
      const sessionsData = queryClient.getQueryData<SessionsResponse[]>(["account", "sessions"]);
      if (!sessionsData) {
        queryClient.invalidateQueries({
          queryKey: ["account", "sessions"],
        });
      } else {
        queryClient.setQueryData<SessionsResponse[]>(
          ["account", "sessions"],
          sessionsData.filter((session) => session.id !== sessions?.id)
        );
      }
      toast.success("Revoke session successful!");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Revoke sesion failed!"));
    },
  });

  const handleRevoke = () => {
    sessionRevokeMutate({ id: sessions?.id });
  };

  return (
    <>
      <ConfirmDialog
        title="Are you sure want to delete this session?"
        dialog={dialog}
        setDialog={setDialog}
        onConfirm={handleRevoke}
      >
        This action cannot be undone. This will permanently delete this session.
      </ConfirmDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            className="flex items-center gap-1"
            onClick={() => router.push(sessions?.id)}
          >
            <GrView />
            See More
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {/* <DropdownMenuSub>
          <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={sessions.status ? "Active" : "Inactive"}>
              {statuses.map((status) => (
                <DropdownMenuRadioItem key={status.value} value={status.value}>
                  {status.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setDialog(true)}>
            Revoke
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
