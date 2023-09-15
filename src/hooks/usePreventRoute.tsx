import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export const usePreventRoute = () => {
	const { data: authData, isLoading } = useAuth();
	const router = useRouter();
	if (isLoading) {
		return (
			<h1 className="flex items-center">
				Loading...
				<span className="loading loading-infinity loading-lg" />
			</h1>
		);
	} else if (authData) {
		router.replace("/");
		return (
			<h1 className="flex items-center">
				Redirecting...
				<span className="loading loading-ring loading-lg"></span>
			</h1>
		);
	}
};
