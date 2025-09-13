import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Category = {
    idCat: number;
    name: string;
}

export type Text = {
    idTex: number;
    content: string;
    category: Category;
    approved: boolean;
}

interface TextsState {
    approvedTexts: Text[];
    pendingTexts: Text[];
    allCategories: Category[];
    text: Text | null;
    submitState: number;
}

const initialState: TextsState = {
    approvedTexts: [],
    pendingTexts: [],
    allCategories: [],
    text: null,
    submitState: 0
}

export interface SubmitTextRequest {
    idCat: number;
    text: string;
}

export interface ChangeTextCategoryRequest {
    idTex: number;
    idCat: number;
}


const textsSlice = createSlice({
    name: "texts",
    initialState,
    reducers: {
        getApprovedTextsStart: (_state) => {},
        getApprovedTextsSuccess: (state, action: PayloadAction<Text[]>) => {
            state.approvedTexts = action.payload;
        },
        getApprovedTextsFailure: (_state) => {},

        getPendingTextsStart: (_state) => {},
        getPendingTextsSuccess: (state, action: PayloadAction<Text[]>) => {
            state.pendingTexts = action.payload;
        },
        getPendingTextsFailure: (_state) => {},

        approveTextStart: (_state, _action: PayloadAction<number>) => {},
        approveTextSuccess: (state, action: PayloadAction<Text>) => {
            state.pendingTexts = state.pendingTexts.filter(t => t.idTex != action.payload.idTex);
            state.approvedTexts.push(action.payload);
        },
        approveTextFailure: () => {},

        getCategoriesStart: (_state) => {},
        getCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
            state.allCategories = action.payload;
        },
        getCategoriesFailure: (_state) => {},

        submitTextStart: (state, _action: PayloadAction<SubmitTextRequest>) => {state.submitState = 1;},
        submitTextSuccess: (state) => {state.submitState = 2;},
        submitTextFailure: (state) => {state.submitState = -1;},

        deleteTextStart: (_state, _action: PayloadAction<Text>) => {},
        deleteTextSuccess: (state, action: PayloadAction<Text>) => {
            if (action.payload.approved == true)
                state.approvedTexts = state.approvedTexts.filter(t => t.idTex != action.payload.idTex);
            else
                state.pendingTexts = state.pendingTexts.filter(t => t.idTex != action.payload.idTex);
        },
        deleteTextFailure: (_state) => {},

        changeTextCategoryStart: (_state, _action: PayloadAction<ChangeTextCategoryRequest>) => {},
        changeTextCategorySuccess: (state, action: PayloadAction<Text>) => {
            let text;
            if (action.payload.approved == true)
                text = state.approvedTexts.find(t => t.idTex == action.payload.idTex);
            else
                text = state.pendingTexts.find(t => t.idTex == action.payload.idTex);

            if (text) text.category = action.payload.category;
        },
        changeTextCategoryFailure: (_state) => {},
    }
});


export default textsSlice.reducer;

export const {
    getApprovedTextsStart, getApprovedTextsSuccess, getApprovedTextsFailure,
    getPendingTextsStart, getPendingTextsSuccess, getPendingTextsFailure,
    approveTextStart, approveTextSuccess, approveTextFailure,
    getCategoriesStart, getCategoriesSuccess, getCategoriesFailure,
    submitTextStart, submitTextSuccess, submitTextFailure,
    deleteTextStart, deleteTextSuccess, deleteTextFailure,
    changeTextCategoryStart, changeTextCategorySuccess, changeTextCategoryFailure
} = textsSlice.actions;