import { memo } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface Props {
	title: string;
	children: React.ReactNode;
	dialog: boolean;
	setDialog: Function;
	onConfirm: Function;
}
const ConfirmDialog = (props: Props) => {
	const { dialog, setDialog, title, children, onConfirm } = props;

	const handleConfirm = () => {
		onConfirm();
		setDialog(false);
	};

	return (
		<>
			<AlertDialog open={dialog}>
				{/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{title}</AlertDialogTitle>
						<AlertDialogDescription>{children}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setDialog(false)}>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleConfirm} className="bg-forum_pink hover:bg-forum_white hover:opacity-90 hover:text-forum_pink focus">
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default memo(ConfirmDialog);
