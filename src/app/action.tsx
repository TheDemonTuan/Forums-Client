"use server";

import { cookies } from "next/headers";

export const getJwtCookie = async () => {
	const jwtCookieName = cookies().get(process.env?.JWT_COOKIE_NAME || "__tdt_t")?.value;
	return jwtCookieName;
};
