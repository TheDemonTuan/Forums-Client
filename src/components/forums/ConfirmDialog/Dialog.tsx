import { memo } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface Props {
	children: React.ReactNode;
	open: boolean;
	onClose: Function;
}
const Dialog = (props: Props) => {
	const { open, onClose } = props;
	if (!open) {
		return <></>;
	}
	return (
		<div className="fixed inset-0 z-50 overflow-auto bg-black/80 flex">
			<div className="relative p-8 bg-white shadow-2xl w-full max-w-md m-auto flex-col flex rounded-lg">
				<div>{props.children}</div>
				<span className="absolute top-0 right-0 p-4">
					<AiOutlineClose
						className="hover:text-forum_pink cursor-pointer"
						onClick={() => onClose()}
						size={24}
					/>
				</span>
			</div>
		</div>
	);
};

export default memo(Dialog);
