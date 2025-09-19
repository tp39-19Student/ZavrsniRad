import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type User = {
    idPer: number;
    username: string;
    op: number;
    gold: number;
    silver: number;
    bronze: number;

    blReason: string;
    blUntil: number;

    followed: User[];
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

export interface FollowRequest {
    idFer: number;
    idFed: number;
    state: boolean;
}

export interface FollowResponse {
    user: User;
    state: boolean;
}

const usersSlice = createSlice({
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
            //console.log(state.user);
        },
        getUserFailure: (_state) => {},

        logoutStart: (_state) => {},
        logoutSuccess: (state) => {
            state.user = null
            state.lrState = 0;
            state.lrMessage = "";
        },
        logoutFailure: (_state) => {alert("Logout failed???");},


        setFollowStart: (_state, _action: PayloadAction<FollowRequest>) => {},
        setFollowSuccess: (state, action: PayloadAction<FollowResponse>) => {
            if (state.user != null) {
                if (action.payload.state == true) {
                    state.user.followed.push(action.payload.user);
                } else {
                    state.user.followed = state.user.followed.filter(u => u.idPer != action.payload.user.idPer);
                }
            }
        },
        setFollowFailure: (_state) => {},


        userOnlyEndpoint: (_state) => {},
        adminOnlyEndpoint: (_state) => {}
    }
});


export const {
    loginStart, loginSuccess, loginFailure,
    registerStart, registerSuccess, registerFailure,
    getUserStart, getUserSuccess, getUserFailure,
    logoutStart, logoutSuccess, logoutFailure,
    setFollowStart, setFollowSuccess, setFollowFailure,

    userOnlyEndpoint, adminOnlyEndpoint
} = usersSlice.actions;

export default usersSlice.reducer;