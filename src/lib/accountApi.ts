import http from "@/utils/http";
import { AuthResponse } from "./authApi";

export interface PasswordAccountBody {
	old_password: string;
	new_password: string;
	confirm_new_password: string;
}

export const passwordAccount = async (body: PasswordAccountBody) =>
	http.put<AuthResponse>("account/password", body).then((res) => res.data);

export interface PrivateEmailAccountBody {
	new_email: string;
	confirm_new_email: string;
	confirm_password: string;
}

export const privateEmailAccount = async (body: PrivateEmailAccountBody) =>
	http.put<AuthResponse>("account/private/email", body).then((res) => res.data);

export interface PrivateUserNameAccountBody {
	new_username: string;
	confirm_new_username: string;
	confirm_password?: string;
}

export const privateUserNameAccount = async (body: PrivateUserNameAccountBody) =>
	http.put<AuthResponse>("account/private/username", body).then((res) => res.data);

export interface PublicBody {
	display_name: string;
	about: string;
	avatar: File | null;
}

export const publicAccount = async (body: PublicBody) =>
	http
		.put<AuthResponse>("account/profile", body, {
			baseURL: process.env.NEXT_PUBLIC_STATIC_URL,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		})
		.then((res) => res.data);
