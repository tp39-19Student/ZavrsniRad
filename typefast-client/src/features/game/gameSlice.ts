import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Text } from "../text/textsSlice"
import type { User } from "../user/usersSlice";

export type Score = {
    idSco: number;
    idPer: number;
    idTex: number;

    datePlayed: string;
    time: number;
    accuracy: number;
    wpm: number;

    user: User;

    current: boolean;
}

interface GameState {
    text: Text | null;
    leaderboard: Score[];
    leaderboardIdTex: number;

    dailyText: Text | null;
    dailyLeaderboard: Score[];
    nextDailyTime: number;
}

const initialState: GameState = {
    text: null,
    leaderboard: [],
    leaderboardIdTex: -1,

    dailyText: null,
    dailyLeaderboard: [],
    nextDailyTime: 0
}

export interface GetLeaderboardResponse {
    scores: Score[];
    idTex: number;
}

export interface SubmitScoreRequest {
    idTex: number;
    time: number;
    accuracy: number;
}

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        getTextStart: (_state, _action: PayloadAction<number>) => {},
        getTextSuccess: (state, action: PayloadAction<Text>) => {
            state.text = action.payload;
        },
        getTextFailure: (_state) => {},

        submitScoreStart: (_state, _action: PayloadAction<SubmitScoreRequest>) => {},
        submitScoreSuccess: (state, action: PayloadAction<Score>) => {
            action.payload.current = true;
            state.leaderboard.push(action.payload);
        },
        submitScoreFailure: (_state) => {},

        submitDailyScoreStart: (_state, _action: PayloadAction<SubmitScoreRequest>) => {},
        submitDailyScoreSuccess: (state, action: PayloadAction<Score>) => {
            action.payload.current = true;
            state.dailyLeaderboard.push(action.payload);
        },
        submitDailyScoreFailure: (_state) => {},

        getLeaderboardStart: (state, action: PayloadAction<number>) => {state.leaderboardIdTex = action.payload;},
        getLeaderboardSuccess: (state, action: PayloadAction<GetLeaderboardResponse>) => {
            if (action.payload.idTex == state.leaderboardIdTex) {
                state.leaderboard = action.payload.scores;
            }
        },
        getLeaderboardFailure: (_state) => {},

        clearText: (state) => {state.text = null;},
        clearLeaderboard: (state) => {state.leaderboard = [];},

        getDailyTextStart: (_state) => {},
        getDailyTextSuccess: (state, action: PayloadAction<Text>) => {state.dailyText = action.payload},
        getDailyTextFailure: (_state) => {},

        getDailyLeaderboardStart: (_state) => {},
        getDailyLeaderboardSuccess: (state, action: PayloadAction<Score[]>) => {state.dailyLeaderboard = action.payload},
        getDailyLeaderboardFailure: (_state) => {},

        getNextDailyTimeStart: (_state) => {},
        getNextDailyTimeSuccess: (state, action: PayloadAction<number>) => {state.nextDailyTime = action.payload},
        getNextDailyTimeFailure: (_state) => {},
    }
})


export const {
    getTextStart, getTextSuccess, getTextFailure,
    submitScoreStart, submitScoreSuccess, submitScoreFailure,
    submitDailyScoreStart, submitDailyScoreSuccess, submitDailyScoreFailure,
    getLeaderboardStart, getLeaderboardSuccess, getLeaderboardFailure,
    clearText, clearLeaderboard,
    getDailyTextStart, getDailyTextSuccess, getDailyTextFailure,
    getDailyLeaderboardStart, getDailyLeaderboardSuccess, getDailyLeaderboardFailure,
    getNextDailyTimeStart, getNextDailyTimeSuccess, getNextDailyTimeFailure
} = gameSlice.actions;

export default gameSlice.reducer;