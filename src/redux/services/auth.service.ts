import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface VerifyResponse {
	username: string;
	email: string;
}

export const authApi = createApi({
	reducerPath: "authApi",
	tagTypes: ["Auth"],
	baseQuery: fetchBaseQuery({
		baseUrl: process.env.NEXT_PUBLIC_API_HOST || "",
		timeout: 10000,
		credentials: "include",
	}),
	endpoints: (builder) => ({
		authVerify: builder.query<VerifyResponse, void>({
			query: () => ({
				url: "auth/verify",
			}),
			providesTags: ["Auth"],
		}),
		authLogin: builder.mutation<VerifyResponse, { username: string; password: string }>({
			query: (body) => ({
				url: "auth/login",
				method: "POST",
				body,
			}),
		}),
		authRegister: builder.mutation<
			VerifyResponse,
			{ username: string; email: string; password: string }
		>({
			query: (body) => ({
				url: "auth/register",
				method: "POST",
				body,
			}),
		}),
		authLogout: builder.mutation<void, void>({
			query: () => ({
				url: "auth/logout",
				method: "DELETE",
			}),
			invalidatesTags: ["Auth"],
		}),
	}),
});

export const {
	useAuthVerifyQuery,
	useAuthLoginMutation,
	useAuthRegisterMutation,
	useAuthLogoutMutation,
} = authApi;
