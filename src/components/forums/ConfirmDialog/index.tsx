import Dialog from "./Dialog";
import { ForumButton, ForumButtonOutline } from "../Button";
import { memo, useEffect } from "react";
interface Props {
	title: string;
	children: React.ReactNode;
	open: boolean;
	onClose: Function;
	onConfirm: Function;
}
const ConfirmDialog = (props: Props) => {
	const { open, onClose, title, children, onConfirm } = props;

	useEffect(() => {
		document.body.classList.toggle("overflow-hidden", open);
	}, [open]);

	if (!open) {
		return <></>;
	}

	return (
		<Dialog open={open} onClose={onClose}>
			<h2 className="text-xl">{title}</h2>
			<div className="py-5">{children}</div>
			<div className="flex justify-end gap-3">
				<ForumButtonOutline onClick={() => onClose()}>No</ForumButtonOutline>
				<ForumButton
					onClick={() => {
						onClose();
						onConfirm();
					}}>
					Confirm
				</ForumButton>
			</div>
		</Dialog>
	);
};

export default memo(ConfirmDialog);
