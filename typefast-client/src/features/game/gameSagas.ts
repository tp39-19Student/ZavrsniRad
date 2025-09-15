import type { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { getTextEndpoint, leaderboardEndpoint, submitScoreEndpoint } from "../../constants/api";
import { getLeaderboardFailure, getLeaderboardSuccess, getTextFailure, getTextSuccess, submitScoreSuccess, type SubmitScoreRequest } from "./gameSlice";
import { submitTextFailure } from "../text/textsSlice";


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

function* submitScore(action: PayloadAction<SubmitScoreRequest>): Generator {
    try {
        const res = yield call(() => fetch(submitScoreEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        }));
        if (!res.ok) {
            const text = yield res.text();
            alert(text);
            throw res;
        }

        const json = yield res.json();
        yield put(submitScoreSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(submitTextFailure());
    }
}

function* getLeaderboard(action: PayloadAction<number>): Generator {
    try {
        const res = yield call(() => fetch(leaderboardEndpoint + action.payload + "/"));
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(getLeaderboardSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(getLeaderboardFailure());
    }
}

function* gameSaga() {
    yield takeEvery("game/getTextStart", getText);
    yield takeEvery("game/submitScoreStart", submitScore);
    yield takeEvery("game/getLeaderboardStart", getLeaderboard);
}

export default gameSaga;