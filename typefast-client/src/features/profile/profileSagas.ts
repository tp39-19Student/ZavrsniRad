import type { PayloadAction } from "@reduxjs/toolkit";
import { takeEvery, call, put } from "redux-saga/effects";
import { blockFailure, blockSuccess, getGlobalLeaderboardFailure, getGlobalLeaderboardSuccess, getProfileFailure, getProfileStatsFailure, getProfileStatsSuccess, getProfileSuccess, unblockFailure, unblockSuccess, type BlockRequest } from "./profileSlice";
import { blockEndpoint, getGlobalLeaderboardEndpoint, getProfileEndpoint, getProfileTrendsEndpoint, unblockEndpoint } from "../../constants/api";






function* getProfile(action: PayloadAction<number>): Generator {
    try {
        const res = yield call(() => fetch(getProfileEndpoint + action.payload + "/"));
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(getProfileSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(getProfileFailure())
    }
}

function* getProfileStats(action: PayloadAction<number>): Generator {
    try {
        const res = yield call(() => fetch(getProfileTrendsEndpoint + action.payload + "/"));
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(getProfileStatsSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(getProfileStatsFailure())
    }
}

function* getGlobalLeaderboard(): Generator {
    try {
        const res = yield call(() => fetch(getGlobalLeaderboardEndpoint));
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(getGlobalLeaderboardSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(getGlobalLeaderboardFailure())
    }
}

function* block(action: PayloadAction<BlockRequest>): Generator {
    let msg = "";
    try {
        const res = yield call(() => fetch(blockEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        }));

        if (!res.ok) {
            msg = yield res.text();
            throw res;
        }

        const json = yield res.json();
        yield put(blockSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(blockFailure(msg));
    }
}

function* unblock(action: PayloadAction<number>): Generator {
    try {
        const res = yield call(() => fetch(unblockEndpoint + action.payload + "/", {method:"POST"}));
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(unblockSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(unblockFailure());
    }
}


function* profileSaga() {
    yield takeEvery("profile/getProfileStart", getProfile);
    yield takeEvery("profile/getProfileStatsStart", getProfileStats);
    yield takeEvery("profile/getGlobalLeaderboardStart", getGlobalLeaderboard);
    yield takeEvery("profile/blockStart", block);
    yield takeEvery("profile/unblockStart", unblock);
}

export default profileSaga;