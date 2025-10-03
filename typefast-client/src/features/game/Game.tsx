import { useEffect, useRef, useState } from "react";
import { type SubmitScoreRequest } from "./gameSlice";
import { type Text } from "../text/textsSlice";

import type { GraphNode } from "./GameGraph";
import GameGraph from "./GameGraph";


export default function Game({text, onFinish, onTick = () => {}, autoStart = false}: {
                                text: Text,
                                onFinish: (score: SubmitScoreRequest) => any,
                                onTick?: (progress: number, wpm: number, accuracy: number, time: number) => any,
                                autoStart?: boolean
                            })
    {
    const [time, setTime] = useState(0.0);

    const [mistakes, setMistakes] = useState(0);
    const mistakeFlags = useRef<Boolean[]>([]);

    const [cursor, setCursor] = useState(0);
    const [correctCursor, setCorrectCursor] = useState(0);

    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);

    

    const graph = useRef<GraphNode[]>([{time: 0, wpm: 0, accuracy: 100}]);
    const graphCaptureRate = text.content.length;
    const n = useRef(0);

    const startTime = useRef(0);

    useEffect(() => {
        if (time > 0) {
            onTick(correctCursor / text.content.length, calcWpm(), calcAccuracy(), time);
            n.current++;
            if (n.current >= graphCaptureRate) {
                graphCapture();
                n.current = 0;
            }
        }
    }, [time]);

    useEffect(() => {
        if (!started || finished) return;
        const timer = setInterval(() => {
            setTime((Date.now() - startTime.current)/1000);
        }, 10)
        return () => clearInterval(timer);
    }, [started, finished])

    useEffect(() => {
        if (!started && (autoStart || cursor > 0)) {
            startTime.current = Date.now();
            setStarted(true);
        } else if (!finished && correctCursor == text.content.length) {
            graphCapture();
            setFinished(true);
            onTick(1, calcWpm(), calcAccuracy(), time);

            onFinish({
                idTex: text.idTex,
                time: time,
                accuracy: calcAccuracy()
            });
        }
    }, [correctCursor])

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
                    <div id="gameHeader">
                        <div>
                            <span>Time: {time.toFixed(2)}</span>
                            </div>
                        <div id="gameHeaderMain">
                            <span id="wpmSpan">Wpm: {calcWpm().toFixed(2)}</span>
                            <span id="accSpan">Accuracy: {(calcAccuracy() * 100).toFixed(2)}%</span>
                        </div>
                        <div>
                            <span>Mistakes: {mistakes}</span>
                        </div>
                    </div>

                    <div id="gameText">
                        <span className="correct">{text.content.substring(0, correctCursor)}</span>
                        <span className="incorrect">{text.content.substring(correctCursor, cursor)}</span>
                        <span>{text.content.substring(cursor)}</span>
                    </div>
                </div>
            }

            
            {finished &&
            <div className="center">
                <div id="gameChart">
                    <GameGraph
                        graphData={graph.current}
                    />
                </div>
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

        if (e.keyCode == 9) return; // Tab
        if (e.keyCode >= 37 && e.keyCode <= 40) return; // Arrow keys
        
        e.preventDefault();

        const key = e.key;
        if (key == "Shift" || key == "CapsLock") return;
        //console.log("Key: " + key);
        //console.log("Keycode: " + e.keyCode);


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

        //console.log(mistakeFlags.current.length);
    }

    function calcWpm() {
        return ((correctCursor / 5) * 60 / time);
    }

    function calcAccuracy() {
        const total = text.content.length;

        if (mistakes >= total) return 0;
        return ((total - mistakes) / total);
    }

    function graphCapture() {
        if (finished) return;
        graph.current.push({
            time: (Math.ceil(time * 100) / 100),
            wpm: (Math.ceil(calcWpm() * 100) / 100),
            accuracy: (Math.ceil(calcAccuracy() * 10000) / 100)
        });
    }
}