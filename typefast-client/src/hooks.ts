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

export function useCountdown(targetMs: number) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        //setTime(targetMs - Date.now());
        const timer = setInterval(() => {
            setTime(targetMs - Date.now());
        }, 25);
        return () => clearInterval(timer);
    }, [targetMs]);

    if (time < 0) return "00.0";

    let seconds = time / 1000;
    let miliseconds = time % 1000;

    let res = "";

    if (seconds > 3600) {
        res += String(Math.floor(seconds / 3600)).padStart(2, "0") + ":";
        seconds = seconds % 3600;

        res += String(Math.floor(seconds / 60)).padStart(2, "0") + ":";
        seconds = seconds % 60;

        res += String(Math.floor(seconds)).padStart(2, "0");
    } else if (seconds > 60) {
        res += String(Math.floor(seconds / 60)).padStart(2, "0") + ":";
        seconds = seconds % 60;

        res += String(Math.floor(seconds)).padStart(2, "0");
    } else if (seconds > 0) {
        res += String(Math.floor(seconds)).padStart(2, "0");
    } else res += "00";

    if (miliseconds > 0) res += "." + String(Math.floor((miliseconds % 1000)/100));
    else res += ".0";

    return res;
}