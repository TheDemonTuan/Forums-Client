import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthResponse } from "@/lib/api/authApi";
import { ApiErrorResponse } from "@/utils/http";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { meMember } from "@/lib/api/memberApi";
import { useEffect } from "react";
import { getErrorMessage } from "@/utils/getErrorMessage";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: authData,
    error: authError,
    isSuccess: authIsSuccess,
    isError: authIsError,
    isLoading: authIsLoading,
  } = useQuery<AuthResponse, ApiErrorResponse>({
    queryKey: ["auth"],
    queryFn: async () => await meMember(),
    staleTime: 1000 * 60 * 3, // 3 minutes
  });

  useEffect(() => {
    if (authIsError && queryClient.getQueryData(["auth"])) {
      queryClient.removeQueries({
        queryKey: ["auth"],
      });
      toast.error(getErrorMessage(authError, "Your session has expired. Please login again."));
      router.replace("/login");
    }
  }, [authIsError, authError, queryClient, router]);

  return {
    authData,
    authIsLoading,
    authIsSuccess,
  };
};
