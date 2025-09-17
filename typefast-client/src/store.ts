import { configureStore } from "@reduxjs/toolkit"
import createSagaMiddleware from "redux-saga";

import usersReducer from "./features/user/usersSlice"
import usersSaga from "./features/user/usersSagas";

import textsReducer from "./features/text/textsSlice"
import textsSaga from "./features/text/textsSagas"

import gameReducer from "./features/game/gameSlice"
import gameSaga from "./features/game/gameSagas"

import profileReducer from "./features/profile/profileSlice";
import profileSaga from "./features/profile/profileSagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        users: usersReducer,
        texts: textsReducer,
        game: gameReducer,
        profile: profileReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
});


sagaMiddleware.run(usersSaga);
sagaMiddleware.run(textsSaga);
sagaMiddleware.run(gameSaga);
sagaMiddleware.run(profileSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;