"use client";

import { SecurityLogResponse } from "@/lib/accountApi";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/common/data-table/data-table-column-header";
import { DataTableRowActions } from "@/components/common/data-table/data-table-row-actions";

export const columns: ColumnDef<SecurityLogResponse>[] = [
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
    accessorKey: "browser",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Browser" />
    ),
  },
  {
    accessorKey: "device",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Device" />
    ),
  },
  {
    accessorKey: "device_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Device Type" />
    ),
  },
  {
    accessorKey: "engine",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Engine" />
    ),
  },
  {
    accessorKey: "os",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="OS" />
    ),
  },
  {
    accessorKey: "cpu",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="CPU" />
    ),
  },
  {
    accessorKey: "ip",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="IP" />
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Create At" />
    ),
    cell: (row) => {
      return new Date(row.getValue<Date>()).toLocaleString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
