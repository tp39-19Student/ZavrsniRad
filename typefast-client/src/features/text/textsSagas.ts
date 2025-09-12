import { put, takeEvery, call} from "redux-saga/effects"
import { changeTextCategoryEndpoint, deleteTextEndpoint, getAllTextsEndpoint, getCategoriesEndpoint, submitTextEndpoint } from "../../constants/api";
import { changeTextCategoryFailure, changeTextCategorySuccess, deleteTextFailure, deleteTextSuccess, getAllTextsFailure, getAllTextsSuccess, getCategoriesFailure, getCategoriesSuccess, submitTextFailure, submitTextSuccess, type ChangeTextCategoryRequest, type SubmitTextRequest } from "./textsSlice";
import type { PayloadAction } from "@reduxjs/toolkit";


function* getAllTexts(): Generator {
    try {
        const res = yield call(() => fetch(getAllTextsEndpoint));

        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(getAllTextsSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(getAllTextsFailure());
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

function* deleteText(action: PayloadAction<number>): Generator {
    try {
        const res = yield call(() => fetch(deleteTextEndpoint + action.payload, {
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
            method: "PUT",
            credentials: "include"
        }));
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(changeTextCategorySuccess(json));
    } catch(e) {
        console.error(e);
        yield put(changeTextCategoryFailure());
    }
}

function* textsSaga() {
    yield takeEvery("texts/getAllTextsStart", getAllTexts);
    yield takeEvery("texts/getCategoriesStart", getCategories);
    yield takeEvery("texts/submitTextStart", submitText);
    yield takeEvery("texts/deleteTextStart", deleteText);
    yield takeEvery("texts/changeTextCategoryStart", changeTextCategory);
}


export default textsSaga;