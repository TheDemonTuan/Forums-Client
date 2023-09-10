import http from "@/utils/http";

// ----------------------------------------------Verify----------------------------------------------
export enum OAuthProviders {
	DEFAULT = "DEFAULT",
	GOOGLE = "GOOGLE",
	GITHUB = "GITHUB",
}

export interface AuthResponse {
	id: string;
	display_name: string;
	avatar: string;
	about: string;
	email: string;
	username: string;
	role: number;
	oauth: OAuthProviders;
	status: boolean;
	created_at: Date;
}

export const verifyAuth = async () => http.get<AuthResponse>("auth/verify").then((res) => res.data);

// ----------------------------------------------Login----------------------------------------------

export interface LoginAuthBody {
	username: string;
	password: string;
	recaptcha: string;
}

export const loginAuth = async (body: LoginAuthBody) =>
	http.post<AuthResponse>("auth/login", body).then((res) => res.data);

// ----------------------------------------------Register----------------------------------------------

export interface RegisterAuthBody {
	username: string;
	email: string;
	password: string;
	recaptcha: string;
}

export const registerAuth = async (body: RegisterAuthBody) =>
	http.post<AuthResponse>("auth/register", body).then((res) => res.data);

// ----------------------------------------------Logout----------------------------------------------

export const logoutAuth = async () => http.delete("auth/logout");

// ----------------------------------------------Oauth----------------------------------------------

export interface OAuthAuthBody {
	code: string;
	provider: string;
	// recaptcha: string;
}
export const oauthAuth = async (body: OAuthAuthBody) =>
	http.post<AuthResponse>(`auth/oauth`, body).then((res) => res.data);
