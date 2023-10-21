"use client";

import { SecurityLogResponse, securityLogAccount } from "@/lib/api/accountApi";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { ApiErrorResponse } from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox";

const SecurityLog = () => {
  const {
    data: securityLogData,
    error: securityLogError,
    isLoading: securityLogIsLoading,
    isError: securityLogIsError,
  } = useQuery<SecurityLogResponse[], ApiErrorResponse>({
    queryKey: ["account", "security-log"],
    queryFn: async ({ signal }) => await securityLogAccount(signal),
    staleTime: 1000 * 30,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Log Manager!</h2>
          <p className="text-muted-foreground">
            This is a list of devices that have logged into your account!
          </p>
        </div>
      </div>
      <DataTable columns={columns} data={securityLogData ?? []} />
    </div>
  );
};

export default SecurityLog;
