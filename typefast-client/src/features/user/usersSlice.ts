import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type User = {
    username: string;
    op: number;
    gold: number;
    silver: number;
    bronze: number;

    blReason: string;
    blUntil: number;
}

interface UsersState {
    user: User | null;
    lrState: number;
    lrMessage: string;
}

const initialState: UsersState = {
    user: null,
    lrState: 0,
    lrMessage: ""
}

export interface LoginRequest {
    username: string;
    password: string;
}

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        loginStart: (state, _action: PayloadAction<LoginRequest>) => {
            state.lrState = 1;
        },
        loginSuccess: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.lrState = 0;
            state.lrMessage = action.payload;
        },

        registerStart: (state, _action: PayloadAction<LoginRequest>) => {
            state.lrState = 1;
        },
        registerSuccess: (state) => {
            state.lrState = 2;
            state.lrMessage = "Successful registration";
        },
        registerFailure: (state, action: PayloadAction<string>) => {
            state.lrState = 0;
            state.lrMessage = action.payload;
        },

        getUserStart: (_state) => {},
        getUserSuccess: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        getUserFailure: (_state) => {},

        logoutStart: (_state) => {},
        logoutSuccess: (state) => {
            state.user = null
            state.lrState = 0;
            state.lrMessage = "";
        },
        logoutFailure: (_state) => {alert("Logout failed???");}
    }
});


export const {
    loginStart, loginSuccess, loginFailure,
    registerStart, registerSuccess, registerFailure,
    getUserStart, getUserSuccess, getUserFailure,
    logoutStart, logoutSuccess, logoutFailure
} = userSlice.actions;

export default userSlice.reducer;