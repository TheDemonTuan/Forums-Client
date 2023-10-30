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
import { sessionsSchema } from "./schema";
import { usePathname } from "next/navigation";
import ConfirmDialog from "@/components/forums/ConfirmDialog";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SessionRevokeBody,
  SessionRevokeResponse,
  SessionsKey,
  SessionsResponse,
  sessionAccountRevoke,
} from "@/lib/api/accountApi";
import { ApiErrorResponse } from "@/utils/http";
import { toast } from "react-toastify";
import { getErrorMessage } from "@/utils/getErrorMessage";
import Link from "next/link";
import { useAccountSessionsStore } from "@/lib/store/accountStore";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const sessions = sessionsSchema.parse(row.original);
  const queryClient = useQueryClient();
  const [dialog, setDialog] = useState<boolean>(false);
  const pathname = usePathname();
  const { setTableHandle } = useAccountSessionsStore();

  const { mutate: sessionRevokeMutate } = useMutation<
    SessionRevokeResponse,
    ApiErrorResponse,
    SessionRevokeBody
  >({
    mutationFn: async (id) => await sessionAccountRevoke(id),
    onMutate: () => {
      setTableHandle(true);
    },
    onSuccess: () => {
      const sessionsData = queryClient.getQueryData<SessionsResponse[]>(SessionsKey);
      if (!sessionsData) {
        queryClient.invalidateQueries({
          queryKey: SessionsKey,
        });
      } else {
        queryClient.setQueryData<SessionsResponse[]>(
          SessionsKey,
          sessionsData.filter((session) => session.id !== sessions?.id)
        );
      }
      toast.success("Revoke session successful!");
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Revoke sesion failed!"));
    },
    onSettled: () => {
      setTableHandle(false);
    },
  });

  const handleRevoke = () => {
    sessionRevokeMutate({ id: sessions?.id });
  };

  useEffect(() => {
    return () => {
      setDialog(false);
    };
  }, []);

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
          <Link href={pathname?.concat("/", sessions?.id)}>
            <DropdownMenuItem className="flex items-center gap-1">
              <GrView />
              See More
            </DropdownMenuItem>
          </Link>
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
