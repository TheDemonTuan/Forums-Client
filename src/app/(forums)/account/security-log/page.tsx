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
  );
};

export default SecurityLog;
