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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CiMenuFries } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { BiUserPin } from "react-icons/bi";

export const SideBar = () => {
  const { authData } = useAuth();
  const { path, paths } = usePathsName();
  const router = useRouter();

  return (
    <div className="relative space-y-2 lg:w-72">
      <div className="flex items-center gap-3 p-1 lg_max:bg-forum_white lg_max:rounded-xl lg_max:shadow-2xl lg_max:p-3">
        <div
          className="relative group cursor-pointer rounded-full overflow-hidden ring-2 ring-forum_pink"
          onClick={() => router.push(`/@${authData?.display_name}`)}>
          <Avatar className="w-16 h-16">
            <Link href={`/@${authData?.display_name}`}>
              <AvatarImage
                className="rounded-full object-fill object-center transition-transform transform group-hover:grayscale-0 group-hover:opacity-20"
                src={authData?.avatar || "/guest.webp"}
                alt="User Avatar"
              />
            </Link>
            <AvatarFallback>Avatar</AvatarFallback>
          </Avatar>
          <p className="absolute bottom-0 inset-0 rounded-full text-center flex items-center justify-center text-sm text-forum_pink font-bold shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
            View profile
          </p>
        </div>
        <div className="overflow-hidden">
          <h1 className="text-base font-semibold">{authData?.username}</h1>
          <h2 className="flex items-center text-xs text-slate-500 mb-1">
            <AiOutlineMail size={16} />
            <span className="ml-1">: {authData?.email}</span>
          </h2>
          <h2 className="flex items-center text-xs text-slate-500">
            <BiUserPin size={16} />
            <span className="ml-1">: {authData?.display_name}</span>
          </h2>
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
    <ul className={`pt-2 pb-4 space-y-3 ${!isMobile && "lg_max:hidden"} ${styles?.["sidebar-items"]}`}>
      <li className={`flex items-center p-2 space-x-3 rounded-md`} onClick={handleBack}>
        <AiOutlineArrowLeft />
        <span>Back</span>
      </li>
      {SideBarMenuData.map((item, index) => (
        <li key={index} className={`${(paths[2] ?? "") === item?.link && styles?.active}`}>
          <Link href={"/" + paths[1] + "/" + item?.link} className="flex items-center p-2 space-x-3 rounded-md">
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
        onClick={handleOpenMenu}>
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
