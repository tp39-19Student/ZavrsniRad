import type { PayloadAction } from "@reduxjs/toolkit";
import { getUserFailure, getUserSuccess, loginFailure, loginSuccess, logoutFailure, logoutSuccess, registerFailure, registerSuccess, setFollowFailure, setFollowSuccess, type FollowRequest, type LoginRequest } from "./usersSlice";
import { takeEvery, call, put } from "redux-saga/effects";
import { followEndpoint, getUserEndpoint, loginEndpoint, logoutEndpoint, registerEndpoint } from "../../constants/api";

function* login(action: PayloadAction<LoginRequest>): Generator {
    let msg = "";
    try {
        const res: Response = yield call(() => fetch(loginEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        }));
        if (res.status == 500) {
            msg = "Server unreachable";
            throw res;
        }
        if (!res.ok) {
            msg = yield res.text();
            throw res;
        }

        const json = yield res.json();
        yield put(loginSuccess(json));
    } catch(e) {
        console.error(e);
        yield put(loginFailure(msg));
    }
}

function* register(action: PayloadAction<LoginRequest>): Generator {
    let msg = "";
    try {
        const res: Response = yield call(() => fetch(registerEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        }));
        if (res.status == 500) {
            msg = "Server unreachable";
            throw res;
        }
        if (!res.ok) {
            msg = yield res.text();
            throw res;
        }

        yield put(registerSuccess());
    } catch(e) {
        console.error(e);
        yield put(registerFailure(msg));
    }
}

function* getUser(): Generator {
    try {
        const res: Response = yield call(() => fetch(getUserEndpoint));
        if (res.status == 204) {return;}
        if (!res.ok) throw res;

        const json = yield res.json();
        yield put(getUserSuccess(json));
    } catch(e) {
        console.error();
        yield put(getUserFailure());
    }
}

function* logout(): Generator {
    try {
        const res = yield call(() => fetch(logoutEndpoint, {method:"POST"}));
        if (!res.ok) {throw res;}

        yield put(logoutSuccess());
    } catch(e) {
        console.error(e);
        yield put(logoutFailure());
    }
}

function* testUserOnly(): Generator {
    try {
        const res = yield call(() => fetch("api/user/testUser"));

        if (!res.ok) {
            alert(yield res.text());
        } else alert("Success");
    } catch(e){}
}

function* testAdminOnly(): Generator {
    try {
        const res = yield call(() => fetch("api/user/testAdmin"));

        if (!res.ok) {
            alert(yield res.text());
        } else alert("Success");
    } catch(e){}
}

function* setFollow(action: PayloadAction<FollowRequest>): Generator {
    try {
        const res = yield call(() => fetch(followEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(action.payload)
        }));
        if (!res.ok) throw res;

        const json = yield res.json();

        yield put(setFollowSuccess({
            user: json,
            state: action.payload.state
        }));
    } catch(e) {
        console.error(e);
        yield put(setFollowFailure());
    }
}


function* usersSaga() {
    yield takeEvery("users/loginStart", login);
    yield takeEvery("users/registerStart", register);
    yield takeEvery("users/getUserStart", getUser);
    yield takeEvery("users/logoutStart", logout);
    yield takeEvery("users/setFollowStart", setFollow);

    yield takeEvery("users/userOnlyEndpoint", testUserOnly);
    yield takeEvery("users/adminOnlyEndpoint", testAdminOnly);
}

export default usersSaga;