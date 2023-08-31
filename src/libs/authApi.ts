import http from "@/utils/http";

// ----------------------------------------------Verify----------------------------------------------
enum Oauth {
	DEFAULT = "DEFAULT",
	GOOGLE = "GOOGLE",
	GITHUB = "GITHUB",
}

export interface UserResponse {
	id: string;
	display_name: string;
	avatar: string;
	about: string;
	email: string;
	username: string;
	role: number;
	oauth: Oauth;
	status: boolean;
	created_at: Date;
}

export interface AuthResponse {
	utid: string;
	userInfo: UserResponse;
}

export const verifyAuth = async () => http.get<AuthResponse>("auth/verify").then((res) => res.data);

// ----------------------------------------------Login----------------------------------------------

export interface LoginBody {
	username: string;
	password: string;
}

export const loginAuth = async (body: LoginBody) =>
	http.post<AuthResponse>("auth/login", body).then((res) => res.data);

// ----------------------------------------------Register----------------------------------------------

export interface RegisterBody {
	username: string;
	email: string;
	password: string;
}

export const registerAuth = async (body: RegisterBody) =>
	http.post<AuthResponse>("auth/register", body).then((res) => res.data);

// ----------------------------------------------Logout----------------------------------------------

export const logoutAuth = async () => http.delete("auth/logout");

// ----------------------------------------------Oauth----------------------------------------------

export interface OAuthAuthBody {
	code: string;
	provider: string;
}
export const oauthAuth = async (body: OAuthAuthBody) =>
	http.post<AuthResponse>(`auth/oauth`, body).then((res) => res.data);
