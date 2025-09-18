import type { PayloadAction } from "@reduxjs/toolkit";
import { takeEvery, call, put } from "redux-saga/effects";
import { getGlobalLeaderboardFailure, getGlobalLeaderboardSuccess, getProfileFailure, getProfileStatsFailure, getProfileStatsSuccess, getProfileSuccess } from "./profileSlice";
import { getGlobalLeaderboardEndpoint, getProfileEndpoint, getProfileTrendsEndpoint } from "../../constants/api";






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


function* profileSaga() {
    yield takeEvery("profile/getProfileStart", getProfile);
    yield takeEvery("profile/getProfileStatsStart", getProfileStats);
    yield takeEvery("profile/getGlobalLeaderboardStart", getGlobalLeaderboard);
}

export default profileSaga;