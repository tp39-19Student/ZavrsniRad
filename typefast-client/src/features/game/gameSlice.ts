import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Text } from "../text/textsSlice"
import type { User } from "../user/usersSlice";

export type Score = {
    idSco: number;
    idPer: number;
    idTex: number;

    datePlayed: number;
    time: number;
    accuracy: number;
    wpm: number;

    user: User;

    current: boolean;
}

interface GameState {
    text: Text | null;
    leaderboard: Score[];
}

const initialState: GameState = {
    text: null,
    leaderboard: []
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

        getLeaderboardStart: (_state, _action: PayloadAction<number>) => {},
        getLeaderboardSuccess: (state, action: PayloadAction<Score[]>) => {
            state.leaderboard = action.payload;
        },
        getLeaderboardFailure: (_state) => {},
    }
})


export const {
    getTextStart, getTextSuccess, getTextFailure,
    submitScoreStart, submitScoreSuccess, submitScoreFailure,
    getLeaderboardStart, getLeaderboardSuccess, getLeaderboardFailure
} = gameSlice.actions;

export default gameSlice.reducer;