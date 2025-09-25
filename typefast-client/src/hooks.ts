import { useSelector, useDispatch } from "react-redux"
import type {RootState, AppDispatch} from "./store"
import { useEffect, useState } from "react";
import { getNextDailyTimeStart } from "./features/game/gameSlice";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export function useDailyCountdown() {
    const dispatch = useAppDispatch();
    const nextDailyTime = useAppSelector(state => state.game.nextDailyTime);

    const [dailyCountdown, setDailyCountdown] = useState("##:##:##");

    useEffect(() => {
        dispatch(getNextDailyTimeStart());
    }, [dispatch])

    useEffect(() => {
        const timer = setInterval(() => {
            let secondsLeft = nextDailyTime - Date.now() / 1000;
            if (secondsLeft < 0) secondsLeft = 0;

            const hours = Math.floor(secondsLeft / 3600);
            const minutes = Math.floor((secondsLeft % 3600) / 60);
            const seconds = Math.floor((secondsLeft % 60));

            setDailyCountdown(String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0"));
        }, 1000);

        return () => clearInterval(timer);
    }, [nextDailyTime])

    return dailyCountdown;
}