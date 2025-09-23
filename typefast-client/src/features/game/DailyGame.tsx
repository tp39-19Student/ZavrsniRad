import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect } from "react";
import { getDailyTextStart, submitDailyScoreStart, type SubmitScoreRequest } from "./gameSlice";
import Game from "./Game";
import Scores from "./Scores";



export default function DailyGame() {
    const dispatch = useAppDispatch();

    const text = useAppSelector(state => state.game.dailyText);
    const user = useAppSelector(state => state.users.user);
    
    useEffect(() => {
        dispatch(getDailyTextStart());
    }, [dispatch])

    if (text == null) return null;

    return (
        <>
            <Game
                text={text}
                onFinish={handleFinish}
            />
            
            {user != null &&
                <Scores
                    idTex={0}
                />
            }
        </>
    );

    function handleFinish(score: SubmitScoreRequest) {
        if (user != null) {
            dispatch(submitDailyScoreStart(score));
        }
    }
}