"use client";

import { SessionsResponse } from "@/lib/api/accountApi";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { statuses } from "./data";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<SessionsResponse>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Session ID" />,
    cell: (row) => <div className="w-32 overflow-auto">{row.getValue<string>()}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "ip",
    header: ({ column }) => <DataTableColumnHeader column={column} title="IP" />,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: (row) => {
      const status = statuses.find((s) => s?.value === row.getValue<boolean>().toString());

      if (!status) return null;

      return (
        <div className="flex w-[100px] items-center">
          {status?.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{status?.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue<boolean>(id).toString());
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Create At" />,
    cell: (row) => {
      return new Date(row.getValue<Date>()).toLocaleString();
    },
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Session Info" />,
    cell: ({ row, getValue }) => {
      const isOnline = getValue<boolean>();
      return (
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isOnline ? "bg-green-400" : "bg-red-400"
              } opacity-75`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                isOnline ? "bg-green-400" : "bg-red-400"
              }`}
            />
          </span>
          <span className="relative md:badge md:badge-ghost md:badge-sm">
            {!row.index ? "Your current session" : isOnline ? "Online" : "Offline"}
          </span>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
