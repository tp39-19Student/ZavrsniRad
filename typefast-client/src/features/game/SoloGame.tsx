import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { useEffect } from "react";
import { clearText, getTextStart, submitScoreStart, type SubmitScoreRequest } from "./gameSlice";
import Game from "./Game";
import Scores from "./Scores";



export default function SoloGame() {
    const dispatch = useAppDispatch();
    const {id} = useParams();

    const text = useAppSelector(state => state.game.text);

    const user = useAppSelector(state => state.users.user);
    
    useEffect(() => {
        dispatch(getTextStart(id?parseInt(id):0));
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
                    idTex={text.idTex}
                />
            }
        </>
    );

    function handleFinish(score: SubmitScoreRequest) {
        if (user != null) {
            dispatch(submitScoreStart(score));
        }
    }
}