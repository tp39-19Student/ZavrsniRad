import { configureStore } from "@reduxjs/toolkit"
import usersReducer from "./features/user/usersSlice"
import createSagaMiddleware from "redux-saga";
import usersSaga from "./features/user/usersSagas";

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        users: usersReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(sagaMiddleware)
});


sagaMiddleware.run(usersSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;