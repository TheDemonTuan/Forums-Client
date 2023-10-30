import http from "@/utils/http";
import { AuthResponse } from "./authApi";

const APIKey = ["account"];

export interface PrivatePasswordAccountBody {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
}

export const privatePasswordAccount = async (body: PrivatePasswordAccountBody) =>
  http.put<AuthResponse>("account/private/password", body).then((res) => res.data);

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

export interface ProfileBody {
  display_name: string;
  about: string;
  avatar: File | null;
}

export const profileAccount = async (body: ProfileBody) =>
  http
    .put<AuthResponse>("account/profile", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);

export interface SessionsResponse {
  id: string;
  user_id: string;
  ip: string;
  status: boolean;
  is_active: boolean;
  created_at: Date;
}

export const SessionsKey = [...APIKey, "sessions"];

export const sessionsAccount = async (signal: AbortSignal | undefined) =>
  http.get<SessionsResponse[]>("account/sessions", { signal }).then((res) => res.data);

export interface SessionResponse extends SessionsResponse {
  is_current: boolean;
}

export const sessionAccount = async (id: string, signal: AbortSignal | undefined) =>
  http.get<SessionResponse>(`account/session/${id}`, { signal }).then((res) => res.data);

export interface SessionRevokeSelectedResponse {
  message: string;
}

export const SessionRevokeSelectedKey = [...SessionsKey, "revoke", "selected"];

export const sessionAccountRevokeSelected = async (body: string[]) =>
  http
    .delete<SessionRevokeSelectedResponse>(`account/session/revoke/selected`, {
      data: body,
    })
    .then((res) => res.data);

export interface SessionIpResponse {
  status: string;
  continent: string;
  continentCode: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  district: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  offset: number;
  currency: string;
  isp: string;
  org: string;
  as: string;
  asname: string;
  reverse: string;
  mobile: boolean;
  proxy: boolean;
  hosting: boolean;
  query: string;
}

export const sessionIpAccount = async (ip: string, signal: AbortSignal | undefined) =>
  http.get<SessionIpResponse>(`account/session/ip/${ip}`, { signal }).then((res) => res.data);

export interface SessionRevokeResponse {
  message: string;
}

export interface SessionRevokeBody {
  id: string;
}

export const sessionAccountRevoke = async (body: SessionRevokeBody) =>
  http.delete(`account/session/revoke/${body?.id}`).then((res) => res.data);

export interface SessionRevokeAllResponse {
  message: string;
}

export const SessionRevokeAllKey = [...SessionsKey, "revoke", "all"];

export const sessionAccountRevokeAll = async () =>
  http.delete(`account/session/revoke/all`).then((res) => res.data);

export interface SessionStatusChangeBody {
  id: string;
  status: boolean;
}

export const sessionAccountStatusChange = async (body: SessionStatusChangeBody) =>
  http.put(`account/session/status/${body?.id}/${body?.status}`).then((res) => res.data);

export interface SecurityLogResponse {
  id: number;
  user_id: string;
  browser: string;
  device: string;
  device_type: string;
  engine: string;
  os: string;
  cpu: "";
  ip: string;
  created_at: Date;
}

export const securityLogAccount = async (signal: AbortSignal | undefined) =>
  http.get(`account/security-log`, { signal }).then((res) => res.data);
