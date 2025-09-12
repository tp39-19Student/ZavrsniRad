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
    allTexts: Text[];
    allCategories: Category[];
    text: Text | null;
    submitState: number;
}

const initialState: TextsState = {
    allTexts: [],
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
        getAllTextsStart: (_state) => {},
        getAllTextsSuccess: (state, action: PayloadAction<Text[]>) => {
            state.allTexts = action.payload;
        },
        getAllTextsFailure: (_state) => {},

        getCategoriesStart: (_state) => {},
        getCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
            state.allCategories = action.payload;
        },
        getCategoriesFailure: (_state) => {},

        submitTextStart: (state, _action: PayloadAction<SubmitTextRequest>) => {state.submitState = 1;},
        submitTextSuccess: (state) => {state.submitState = 2;},
        submitTextFailure: (state) => {state.submitState = -1;},

        deleteTextStart: (_state, _action: PayloadAction<number>) => {},
        deleteTextSuccess: (state, action: PayloadAction<number>) => {
            state.allTexts = state.allTexts.filter(t => t.idTex != action.payload);
        },
        deleteTextFailure: (_state) => {},

        changeTextCategoryStart: (_state, _action: PayloadAction<ChangeTextCategoryRequest>) => {},
        changeTextCategorySuccess: (state, action: PayloadAction<Text>) => {
            var text = state.allTexts.find(t => t.idTex == action.payload.idTex);
            if (text) text.category = action.payload.category;
        },
        changeTextCategoryFailure: (_state) => {},
    }
});


export default textsSlice.reducer;

export const {
    getAllTextsStart, getAllTextsSuccess, getAllTextsFailure,
    getCategoriesStart, getCategoriesSuccess, getCategoriesFailure,
    submitTextStart, submitTextSuccess, submitTextFailure,
    deleteTextStart, deleteTextSuccess, deleteTextFailure,
    changeTextCategoryStart, changeTextCategorySuccess, changeTextCategoryFailure
} = textsSlice.actions;