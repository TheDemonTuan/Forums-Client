import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

export const usePathsName = () => {
	const pathname = usePathname();
	const [paths, setPaths] = useState<string[]>([]);

	useMemo(() => {
		setPaths(pathname.split("/"));
	}, [pathname]);

	return {
		path: pathname,
		paths,
	};
};
