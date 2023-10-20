"use client";

import Link from "next/link";
import Nav from "./Nav";
import { useAuth } from "@/hooks/useAuth";
import { ForumButton, ForumButtonOutline } from "../Button";

const Header = () => {
  const { authData } = useAuth();

  return (
    <header className="flex flex-col items-center">
      {!authData && (
        <aside
          className={`bg-forum_theme p-2 px-5 flex justify-end items-center gap-5 w-full shadow-xl`}
        >
          <>
            <Link href="/register">
              <ForumButtonOutline>Register</ForumButtonOutline>
            </Link>
            <Link href="/login">
              <ForumButton>Login</ForumButton>
            </Link>
          </>
        </aside>
      )}
      <Nav />
    </header>
  );
};

export default Header;
