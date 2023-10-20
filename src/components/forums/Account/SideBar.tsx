/* eslint-disable react/display-name */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import React, { ReactNode, memo, useEffect } from "react";
import { AiOutlineUser, AiFillSetting, AiOutlineArrowLeft } from "react-icons/ai";
import { BiSolidDashboard, BiSolidNotepad } from "react-icons/bi";
import { BsPersonLock } from "react-icons/bs";
import { LuRadioTower } from "react-icons/lu";
import { usePathsName } from "@/hooks/usePathsName";
import styles from "@/styles/forums/SideBar.module.css";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CiMenuFries } from "react-icons/ci";

export const SideBar = () => {
  const { authData } = useAuth();
  const { path, paths } = usePathsName();

  return (
    <div className="relative space-y-2 lg:w-72">
      <div className="flex items-center gap-1 p-1 lg_max:bg-forum_white lg_max:rounded-xl lg_max:shadow-2xl lg_max:p-3">
        <Avatar className="text-base h-16 w-16 relative inline-flex items-center justify-center mr-2 ring ring-forum_pink">
          <AvatarImage src={authData?.avatar || "/guest.webp"} alt="User Avatar" />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
        <div className="overflow-hidden">
          <h1 className="text-lg font-semibold">{authData?.username}</h1>
          <h2 className="text-xs mb-1 opacity-50">@{authData?.display_name}</h2>

          <Link
            href="/"
            className="badge badge-outline badge-sm hover:opacity-80 hover:text-forum_pink p-2"
          >
            <span>View profile</span>
          </Link>
        </div>
      </div>
      <SideBarMenu paths={paths} />
      <SideBarMenuMobile path={path} paths={paths} />
    </div>
  );
};

type SideBarMenuType = {
  children: JSX.Element | ReactNode;
  icon: JSX.Element | ReactNode;
  link: string;
  customClass?: string;
};

const SideBarMenuData: SideBarMenuType[] = [
  {
    children: "Dashboard",
    icon: <BiSolidDashboard />,
    link: "",
  },
  {
    children: "Public profile",
    icon: <AiOutlineUser />,
    link: "profile",
  },
  {
    children: "Private",
    icon: <BsPersonLock />,
    link: "private",
  },
  {
    children: "Sessions",
    icon: <LuRadioTower />,
    link: "sessions",
  },
  {
    children: "Security log",
    icon: <BiSolidNotepad />,
    link: "security-log",
  },
  {
    children: "Settings",
    icon: <AiFillSetting />,
    link: "settings",
  },
];

interface SideBarMenuProps {
  isMobile?: boolean;
  paths: string[];
}

const SideBarMenu = memo((props: SideBarMenuProps) => {
  const { isMobile, paths } = props;
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <ul
      className={`pt-2 pb-4 space-y-3 ${!isMobile && "lg_max:hidden"} ${styles?.["sidebar-items"]}`}
    >
      <li className={`flex items-center p-2 space-x-3 rounded-md`} onClick={handleBack}>
        <AiOutlineArrowLeft />
        <span>Back</span>
      </li>
      {SideBarMenuData.map((item, index) => (
        <li key={index} className={`${(paths[2] ?? "") === item?.link && styles?.active}`}>
          <Link
            href={"/" + paths[1] + "/" + item?.link}
            className="flex items-center p-2 space-x-3 rounded-md"
          >
            {item?.icon}
            <span>{item?.children}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
});

interface SideBarMenuMobileProps {
  path: string;
  paths: string[];
}

const SideBarMenuMobile = memo((props: SideBarMenuMobileProps) => {
  const { path, paths } = props;
  const [menu, setMenu] = React.useState<boolean>(false);

  useEffect(() => {
    setMenu(false);
  }, [path]);

  const handleOpenMenu = () => {
    setMenu((prev) => !prev);
  };

  return (
    <div className="lg:hidden">
      <div
        className="fixed flex items-center p-2 bottom-4 right-2 text-forum_black animate-pulse z-40 ring-1 rounded-full ring-forum_pink"
        onClick={handleOpenMenu}
      >
        <CiMenuFries size={24} />
      </div>
      <Sheet open={menu} onOpenChange={handleOpenMenu}>
        {/* <SheetTrigger></SheetTrigger> */}
        <SheetContent>
          <SheetHeader>
            <SheetTitle>My Account Menu</SheetTitle>
            <SheetDescription>
              <SideBarMenu isMobile paths={paths} />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
});
