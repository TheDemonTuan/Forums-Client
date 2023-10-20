import http from "@/utils/http";
import { AuthResponse } from "./authApi";

export const meMember = async () => http.get<AuthResponse>("member/me").then((res) => res.data);
