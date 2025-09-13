import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getTextStart } from "./gameSlice";
import { type Text } from "../text/textsSlice";

import "./Game.css"


export default function Game() {
    const dispatch = useAppDispatch();
    const {id} = useParams();

    const text = useAppSelector(state => state.game.text) as Text;

    useEffect(() => {
        dispatch(getTextStart(id?parseInt(id):0));
    }, [dispatch])

    const [time, setTime] = useState(0.0);
    const [timerHandle, setTimerHandle] = useState(0);

    const [mistakes, setMistakes] = useState(0);
    const mistakeFlags = useRef<Boolean[]>([]);

    const [cursor, setCursor] = useState(0);
    const [correctCursor, setCorrectCursor] = useState(0);

    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (!started && cursor > 0) {
            setStarted(true);
            setTimerHandle(setInterval(() => {
                setTime(t => t + 0.01);
            }, 10));
            return;
        }

        if (started && correctCursor == text.content.length) {
            setFinished(true);
            clearInterval(timerHandle);
        }
    }, [cursor])

    useEffect(() => {
        if (text == null) return;

        document.addEventListener("keydown", typeKey);
        return () => {document.removeEventListener("keydown", typeKey)}
    }, [text, cursor, correctCursor, finished])

    useEffect(() => {
        if (text == null) return;
        mistakeFlags.current = Array(text.content.length).fill(false);
    }, [text])

    return (
        <>
            {text &&
                <div>
                    <h1>Typing text: {text.idTex}</h1>
                    <h3>Time: {time.toFixed(2)}</h3>
                    <h3>Wpm: {calcWpm().toFixed(2)}</h3>
                    <h3>Mistakes: {mistakes}</h3>
                    <h3>Accuracy: {(calcAccuracy() * 100).toFixed(2)}%</h3>
                    <p id="gameInput">
                        <span className="correct">{text.content.substring(0, correctCursor)}</span>
                        <span className="incorrect">{text.content.substring(correctCursor, cursor)}</span>
                        <span>{text.content.substring(cursor)}</span>
                    </p>
                </div>
            }
        </>
    );

    function typeKey(e: KeyboardEvent) {
        if (finished) return;
        if (e.keyCode >= 112 && e.keyCode <= 123) return; // F1 - F12
        if (e.keyCode == 91) return; // Windows(Meta)
        if (e.ctrlKey == true) return;
        if (e.altKey == true) return;
        
        e.preventDefault();

        const key = e.key;
        if (key == "Shift") return;
        console.log("Key: " + key);
        console.log("Keycode: " + e.keyCode);


        if (key == "Delete" || key == "Backspace") {
            if (cursor == 0) return;

            if (correctCursor == cursor) setCorrectCursor(correctCursor - 1);
            setCursor(cursor - 1);
        } else {
            if (cursor == text.content.length) return;

            if (correctCursor == cursor) {
                if (text.content.charAt(cursor) == key) setCorrectCursor(correctCursor + 1);
                else {
                    if (mistakeFlags.current[cursor] == false) {
                        setMistakes(mistakes + 1);
                        mistakeFlags.current[cursor] = true;
                    }
                }
            }
            setCursor(cursor + 1);
        }

        console.log(mistakeFlags.current.length);
    }

    function calcWpm() {
        return ((correctCursor / 5) * 60 / time);
    }

    function calcAccuracy() {
        const total = text.content.length;

        if (mistakes >= total) return 0;
        return ((total - mistakes) / total);
    }
}