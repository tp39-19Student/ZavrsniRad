import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../user/usersSlice";

export type Stat = {
    datePlayed: string;
    wpm: number;
    accuracy: number;
};

interface ProfileState {
    profile: User | null;
    dailyStats: Stat[];
    monthlyStats: Stat[];
}

const initialState: ProfileState = {
    profile: null,
    dailyStats: [],
    monthlyStats: []
}

interface GetStatsResponse {
    dailyStats: Stat[];
    monthlyStats: Stat[];
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        getProfileStart: (_state, _action: PayloadAction<number>) => {},
        getProfileSuccess: (state, action: PayloadAction<User>) => {
            state.profile = action.payload
        },
        getProfileFailure: (_state) => {},

        getProfileStatsStart: (_state, _action: PayloadAction<number>) => {},
        getProfileStatsSuccess: (state, action: PayloadAction<GetStatsResponse>) => {
            state.dailyStats = action.payload.dailyStats;
            state.monthlyStats = action.payload.monthlyStats;
        },
        getProfileStatsFailure: (_state) => {},
    }
});

export const {
    getProfileStart, getProfileSuccess, getProfileFailure,
    getProfileStatsStart, getProfileStatsSuccess, getProfileStatsFailure
} = profileSlice.actions;

export default profileSlice.reducer;