import type { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { getTextEndpoint } from "../../constants/api";
import { getTextFailure, getTextSuccess } from "./gameSlice";


function* getText(action: PayloadAction<number>): Generator {
    try {
        const res = yield call(() => fetch(getTextEndpoint + (action.payload != 0?action.payload:"")));
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(getTextSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(getTextFailure());
    }
}

function* gameSaga() {
    yield takeEvery("game/getTextStart", getText);
}

export default gameSaga;