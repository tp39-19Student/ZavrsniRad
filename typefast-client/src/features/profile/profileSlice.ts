import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../user/usersSlice";

export type Stat = {
    datePlayed: string;
    wpm: number;
    accuracy: number;
};

export type Ranking = {
    idPer: number;
    username: string;
    wpm: number;
    accuracy: number;
}

interface ProfileState {
    profile: User | null;
    wpm: number;
    accuracy: number;
    totalPlays: number;
    dailyStats: Stat[];
    monthlyStats: Stat[];

    leaderboard: Ranking[];

    blockState: number;
    blockMsg: string;
}

const initialState: ProfileState = {
    profile: null,
    wpm: 0,
    accuracy: 0,
    totalPlays: 0,
    dailyStats: [],
    monthlyStats: [],

    leaderboard: [],

    blockState: 0,
    blockMsg: ""
}

interface GetProfileResponse {
    user: User;
    wpm: number;
    accuracy: number;
    totalPlays: number;
}

interface GetTrendsResponse {
    dailyStats: Stat[];
    monthlyStats: Stat[];
    totalPlays: number;
};

export interface BlockRequest {
    idPer: number;
    blUntil: number;
    blReason: string;
}

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        getProfileStart: (_state, _action: PayloadAction<number>) => {},
        getProfileSuccess: (state, action: PayloadAction<GetProfileResponse>) => {
            state.profile = action.payload.user;
            state.wpm = action.payload.wpm;
            state.accuracy = action.payload.accuracy;
            state.totalPlays = action.payload.totalPlays;
        },
        getProfileFailure: (_state) => {},

        getProfileStatsStart: (_state, _action: PayloadAction<number>) => {},
        getProfileStatsSuccess: (state, action: PayloadAction<GetTrendsResponse>) => {
            state.dailyStats = action.payload.dailyStats;
            state.monthlyStats = action.payload.monthlyStats;
        },
        getProfileStatsFailure: (_state) => {},

        getGlobalLeaderboardStart: (_state) => {},
        getGlobalLeaderboardSuccess: (state, action: PayloadAction<Ranking[]>) => {
            state.leaderboard = action.payload;
        },
        getGlobalLeaderboardFailure: (_state) => {},

        setBlockMsg: (state, action:PayloadAction<string>) => {state.blockMsg = action.payload; state.blockState = -1;},
        clearBlockMsg: (state) => {state.blockMsg = ""; state.blockState = 0;},


        blockStart: (state, _action:PayloadAction<BlockRequest>) => {state.blockState = 1;},
        blockSuccess: (state, action: PayloadAction<User>) => {
            state.profile = action.payload;
            state.blockState = 2;
            state.blockMsg = "Successfully blocked";
        },
        blockFailure: (state, action: PayloadAction<string>) => {
            state.blockMsg = action.payload;
            state.blockState = -1;
        },

        unblockStart: (_state, _action: PayloadAction<number>) => {},
        unblockSuccess: (state, action: PayloadAction<User>) => {state.profile = action.payload;},
        unblockFailure: (_state) => {}
    }
});

export const {
    getProfileStart, getProfileSuccess, getProfileFailure,
    getProfileStatsStart, getProfileStatsSuccess, getProfileStatsFailure,
    getGlobalLeaderboardStart, getGlobalLeaderboardSuccess, getGlobalLeaderboardFailure,
    setBlockMsg, clearBlockMsg,
    blockStart, blockSuccess, blockFailure,
    unblockStart, unblockSuccess, unblockFailure
} = profileSlice.actions;

export default profileSlice.reducer;