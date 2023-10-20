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
}

export interface LoginAuthParams {
  body: LoginAuthBody;
  recaptcha: string;
}

export const loginAuth = async (params: LoginAuthParams) =>
  http
    .post<AuthResponse>("auth/login", params?.body, {
      headers: {
        tdt_recaptcha_v3: params?.recaptcha,
      },
    })
    .then((res) => res.data);

// ----------------------------------------------Register----------------------------------------------

export interface RegisterAuthBody {
  username: string;
  email: string;
  password: string;
}

export interface RegisterAuthParams {
  body: RegisterAuthBody;
  recaptcha: string;
}

export const registerAuth = async (params: RegisterAuthParams) =>
  http
    .post<AuthResponse>("auth/register", params?.body, {
      headers: {
        tdt_recaptcha_v3: params?.recaptcha,
      },
    })
    .then((res) => res.data);

// ----------------------------------------------Logout----------------------------------------------

export interface LogoutAuthResponse {
  message: string;
}

export const logoutAuth = async () => http.delete<LogoutAuthResponse>("auth/logout");

// ----------------------------------------------Oauth----------------------------------------------

export interface OAuthAuthBody {
  code: string;
  provider: string;
}

export interface OAuthAuthParams {
  body: OAuthAuthBody;
  recaptcha: string;
}

export const oauthAuth = async (params: OAuthAuthParams) =>
  http
    .post<AuthResponse>(`auth/oauth`, params?.body, {
      headers: {
        tdt_recaptcha_v3: params?.recaptcha,
      },
    })
    .then((res) => res.data);
