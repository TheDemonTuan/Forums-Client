import axios, { AxiosError } from "axios";

interface ErrorResponse {
	error: string;
	message: string;
	statusCode: number;
}

const http = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	timeout: 10000,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

export type ApiErrorResponse = AxiosError<ErrorResponse>;

export default http;
