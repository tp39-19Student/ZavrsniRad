import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Text } from "../text/textsSlice"

interface GameState {
    text: Text | null;
}

const initialState: GameState = {
    text: null
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
    }
})


export const {
    getTextStart, getTextSuccess, getTextFailure
} = gameSlice.actions;

export default gameSlice.reducer;