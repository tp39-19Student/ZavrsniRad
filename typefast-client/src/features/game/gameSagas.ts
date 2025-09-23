import type { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeEvery } from "redux-saga/effects";
import { dailyLeaderboardEndpoint, getDailyTextEndpoint, getTextEndpoint, leaderboardEndpoint, submitDailyScoreEndpoint, submitScoreEndpoint } from "../../constants/api";
import { getDailyLeaderboardFailure, getDailyLeaderboardSuccess, getDailyTextFailure, getDailyTextSuccess, getLeaderboardFailure, getLeaderboardSuccess, getTextFailure, getTextSuccess, submitDailyScoreFailure, submitDailyScoreSuccess, submitScoreSuccess, type SubmitScoreRequest } from "./gameSlice";
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

function* submitDailyScore(action: PayloadAction<SubmitScoreRequest>): Generator {
    try {
        const res = yield call(() => fetch(submitDailyScoreEndpoint, {
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
        yield put(submitDailyScoreSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(submitDailyScoreFailure());
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

function* getDailyText(): Generator {
    try {
        const res = yield call(() => fetch(getDailyTextEndpoint));
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(getDailyTextSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(getDailyTextFailure());
    }
}

function* getDailyLeaderboard(): Generator {
    try {
        const res = yield call(() => fetch(dailyLeaderboardEndpoint));
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(getDailyLeaderboardSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(getDailyLeaderboardFailure());
    }
}

function* gameSaga() {
    yield takeEvery("game/getTextStart", getText);
    yield takeEvery("game/submitScoreStart", submitScore);
    yield takeEvery("game/submitDailyScoreStart", submitDailyScore);
    yield takeEvery("game/getLeaderboardStart", getLeaderboard);

    yield takeEvery("game/getDailyTextStart", getDailyText);
    yield takeEvery("game/getDailyLeaderboardStart", getDailyLeaderboard);
}

export default gameSaga;