import http from "@/utils/http";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface LoginData {
	username: string;
	password: string;
}

interface LoginResponse {
	username: string;
	email: string;
}

export const login = createAsyncThunk("auth/login", async (loginData: LoginData, thunkAPI) => {
	try {
		const response = await http.post<LoginResponse>("auth/login", loginData, {
			signal: thunkAPI.signal,
		});
		return response.data;
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error?.response?.data ?? error);
	}
});

interface RegisterData {
	username: string;
	email: string;
	password: string;
}

interface RegisterResponse {
	register_success: boolean;
}

export const register = createAsyncThunk(
	"auth/register",
	async (registerData: RegisterData, thunkAPI) => {
		try {
			const response = await http.post<RegisterResponse>("auth/register", registerData, {
				signal: thunkAPI.signal,
			});
			return response.data;
		} catch (error: any) {
			return thunkAPI.rejectWithValue(error?.response?.data ?? error);
		}
	}
);

export const verify = createAsyncThunk("auth/verify", async (_, thunkAPI) => {
	try {
		const response = await http.get("auth/verify", {
			signal: thunkAPI.signal,
		});

		if (!response.data) throw new Error("Not logged in");

		const { username, email } = response.data;
		return {
			username,
			email,
		};
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error?.response?.data ?? error);
	}
});

interface LogoutResponse {
	logout_success: boolean;
}

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
	try {
		await http.get<LogoutResponse>("auth/logout");
	} catch (error: any) {
		return thunkAPI.rejectWithValue(error?.response?.data ?? error);
	}
});

interface UserData {
	username: string;
	email: string;
}

interface AuthState {
	loading: boolean;
	userInfo: UserData | null;
}

const initialState: AuthState = {
	loading: true,
	userInfo: null,
};

const auth = createSlice({
	name: "auth",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(verify.pending, (state) => {
				state.loading = true;
			})
			.addCase(verify.fulfilled, (state, action) => {
				state.loading = false;
				state.userInfo = action.payload;
			})
			.addCase(verify.rejected, (state) => {
				state.loading = false;
				state.userInfo = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.userInfo = action.payload;
			})
			.addCase(register.fulfilled, (state) => {
				state.userInfo = null;
			})
			.addCase(logout.fulfilled, (state) => {
				state.userInfo = null;
			});
	},
});

export default auth.reducer;
