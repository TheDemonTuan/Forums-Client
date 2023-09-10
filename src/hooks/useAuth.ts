import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthResponse } from "@/lib/authApi";
import { ApiErrorResponse } from "@/utils/http";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { meMember } from "@/lib/memberApi";

export const useAuth = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useQuery<AuthResponse, ApiErrorResponse>({
		queryKey: ["auth"],
		queryFn: async () => await meMember(),
		onSuccess: (data) => {
			if (!data) {
				queryClient.setQueryData(["auth"], null);
			}
		},
		onError: () => {
			if (queryClient.getQueryData(["auth"])) {
				toast.error("Your session has expired. Please login again.");
				router.replace("/login");
				queryClient.resetQueries(["auth"]);
			}
		},
		refetchOnWindowFocus: false,
		retry: false,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};
