import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface SearchProps {
	customClass?: string;
}

const Search = ({ customClass }: SearchProps) => {
	return (
		<div className={cn("relative flex items-center justify-center", customClass)}>
			<div className="absolute lg:w-1/2">
				<AiOutlineSearch size={28} className="absolute h-full pl-2 cursor-pointer" />
				<Input
					type="search"
					name="search"
					placeholder="Search..."
					className="pl-8 ring-1 ring-forum_black focus-visible:ring-forum_pink"
				/>
			</div>
		</div>
	);
};

export default memo(Search);
