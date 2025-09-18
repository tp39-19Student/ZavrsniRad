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
}

const initialState: ProfileState = {
    profile: null,
    wpm: 0,
    accuracy: 0,
    totalPlays: 0,
    dailyStats: [],
    monthlyStats: [],

    leaderboard: []
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
    }
});

export const {
    getProfileStart, getProfileSuccess, getProfileFailure,
    getProfileStatsStart, getProfileStatsSuccess, getProfileStatsFailure,
    getGlobalLeaderboardStart, getGlobalLeaderboardSuccess, getGlobalLeaderboardFailure
} = profileSlice.actions;

export default profileSlice.reducer;