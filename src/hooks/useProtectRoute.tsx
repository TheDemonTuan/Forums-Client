import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export const useProtectRoute = () => {
	const { data: authData, isLoading: authLoading } = useAuth();
	const router = useRouter();
	if (authLoading) {
		return (
			<div className="flex items-center gap-2">
				Loading
				<span className="loading loading-spinner text-forum_black" />
			</div>
		);
	} else if (!authData) {
		router.replace("/login");
		return (
			<div className="flex items-center">
				Redirecting
				<span className="loading loading-spinner text-forum_black" />
			</div>
		);
	}
};
