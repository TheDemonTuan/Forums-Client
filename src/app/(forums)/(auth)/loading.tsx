import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Loading() {
	// You can add any UI inside Loading, including a Skeleton.
	return (
		<>
		<CardHeader className="p-3">
		  <CardTitle className="text-2xl capitalize text-center flex items-center justify-center gap-2">
			Loading...
		  </CardTitle>
		  <CardDescription className="text-center">
			Please wait while we loading content...
		  </CardDescription>
		</CardHeader>
		<div className="divider" />
		<CardContent className="grid gap-5 p-5 items-center justify-center">
		  <span className="loading loading-bars loading-lg" />
		</CardContent>
	  </>
	);
}
