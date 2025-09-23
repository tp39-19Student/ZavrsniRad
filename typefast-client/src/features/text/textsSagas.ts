import { put, takeEvery, call, take} from "redux-saga/effects"
import { 
    approveTextEndpoint,
    changeTextCategoryEndpoint,
    deleteScoreEndpoint,
    deleteTextEndpoint,
    getApprovedTextsEndpoint,
    getCategoriesEndpoint,
    getDailyScoresEndpoint,
    getPendingTextsEndpoint,
    getTextEndpoint,
    submitTextEndpoint
} from "../../constants/api";
import { 
    changeTextCategoryFailure, changeTextCategorySuccess,
    deleteTextFailure, deleteTextSuccess,
    getApprovedTextsFailure, getApprovedTextsSuccess,
    getPendingTextsFailure, getPendingTextsSuccess,
    getCategoriesFailure, getCategoriesSuccess,
    submitTextFailure, submitTextSuccess,
    type ChangeTextCategoryRequest, type SubmitTextRequest, type Text,
    approveTextFailure,
    approveTextSuccess,
    getScoresForTextSuccess,
    getScoresForTextFailure,
    deleteScoreSuccess,
    deleteScoreFailure,
    getDailyScoresFailure,
    getDailyScoresSuccess
} from "./textsSlice";
import type { PayloadAction } from "@reduxjs/toolkit";


function* getApprovedTexts(): Generator {
    try {
        const res = yield call(() => fetch(getApprovedTextsEndpoint));

        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(getApprovedTextsSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(getApprovedTextsFailure());
    }
}

function* getPendingTexts(): Generator {
    try {
        const res = yield call(() => fetch(getPendingTextsEndpoint));

        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(getPendingTextsSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(getPendingTextsFailure());
    }
}

function* approveText(action: PayloadAction<number>): Generator {
    try {
        const res = yield call(() => fetch(approveTextEndpoint + action.payload + "/", {method: "PUT"}));
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(approveTextSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(approveTextFailure());
    }
}

function* getCategories(): Generator {
    try {
        const res = yield call(() => fetch(getCategoriesEndpoint));
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(getCategoriesSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(getCategoriesFailure());
    }
}

function* submitText(action: PayloadAction<SubmitTextRequest>): Generator {
    try {
        const res = yield call(() => fetch(submitTextEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        }));

        if (!res.ok) throw res;
        yield put(submitTextSuccess());
    } catch(e) {
        console.error(e);
        yield put(submitTextFailure());
    }
}

function* deleteText(action: PayloadAction<Text>): Generator {
    try {
        const res = yield call(() => fetch(deleteTextEndpoint + action.payload.idTex, {
            method: "DELETE"
        }));
        if (!res.ok) throw res;
        yield put(deleteTextSuccess(action.payload));
    } catch(e) {
        console.error(e);
        yield put(deleteTextFailure());
    }
}

function* changeTextCategory(action: PayloadAction<ChangeTextCategoryRequest>): Generator {
    try {
        const res = yield call(() => fetch(changeTextCategoryEndpoint + action.payload.idTex + "/" + action.payload.idCat + "/", {
            method: "PUT"
        }));
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(changeTextCategorySuccess(json));
    } catch(e) {
        console.error(e);
        yield put(changeTextCategoryFailure());
    }
}

function* getScoresForText(action: PayloadAction<number>): Generator {
    try {
        const res = yield call(() => fetch(getTextEndpoint + action.payload + "/scores/"));
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(getScoresForTextSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(getScoresForTextFailure());
    }
}

function* getDailyScores(): Generator {
    try {
        const res = yield call(() => fetch(getDailyScoresEndpoint));
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(getDailyScoresSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(getDailyScoresFailure());
    }
}

function* deleteScore(action: PayloadAction<number>): Generator {
    try {
        const res = yield call(() => fetch(deleteScoreEndpoint + action.payload + "/", {method: "DELETE"}));
        if (!res.ok) throw res;

        yield put(deleteScoreSuccess(action.payload));
    } catch(e) {
        console.error(e);
        yield put(deleteScoreFailure());
    }
}

function* textsSaga() {
    yield takeEvery("texts/getApprovedTextsStart", getApprovedTexts);
    yield takeEvery("texts/getPendingTextsStart", getPendingTexts);
    yield takeEvery("texts/approveTextStart", approveText);
    yield takeEvery("texts/getCategoriesStart", getCategories);
    yield takeEvery("texts/submitTextStart", submitText);
    yield takeEvery("texts/deleteTextStart", deleteText);
    yield takeEvery("texts/changeTextCategoryStart", changeTextCategory);
    yield takeEvery("texts/getScoresForTextStart", getScoresForText);
    yield takeEvery("texts/getDailyScoresStart", getDailyScores);
    yield takeEvery("texts/deleteScoreStart", deleteScore);
}


export default textsSaga;