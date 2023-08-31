import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthResponse, verifyAuth } from "@/libs/authApi";
import { ApiErrorResponse } from "@/utils/http";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export const useAuth = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useQuery<AuthResponse, ApiErrorResponse>(["auth"], verifyAuth, {
		refetchOnWindowFocus: false,
		retry: false,
		onError: () => {
			if (queryClient.getQueryData(["auth"])) {
				toast.error("Your session has expired. Please login again.");
				router.replace("/login");
				queryClient.resetQueries(["auth"]);
			}
		},
	});
};
