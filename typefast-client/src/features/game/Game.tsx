import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { clearText, getTextStart, submitScoreStart, type SubmitScoreRequest } from "./gameSlice";
import { type Text } from "../text/textsSlice";

import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import Scores from "./Scores";


export default function Game({text, onFinish}: {text: Text, onFinish: (score: SubmitScoreRequest) => any}) {
    const [time, setTime] = useState(0.0);
    const [timerHandle, setTimerHandle] = useState(0);

    const [mistakes, setMistakes] = useState(0);
    const mistakeFlags = useRef<Boolean[]>([]);

    const [cursor, setCursor] = useState(0);
    const [correctCursor, setCorrectCursor] = useState(0);

    const [started, setStarted] = useState(false);
    const [finished, setFinished] = useState(false);

    interface GraphNode {
        time: number;
        wpm: number;
        accuracy: number;
    };

    const graph = useRef<GraphNode[]>([{time: 0, wpm: 0, accuracy: 100}]);
    const graphCaptureRate = text.content.length;
    const n = useRef(0);

    useEffect(() => {
        if (time > 0) {
            n.current++;
            if (n.current >= graphCaptureRate) {
                n.current = 0;
                graphCapture();
            }
        }
    }, [time]);

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

            graphCapture();

            onFinish({
                idTex: text.idTex,
                time: time,
                accuracy: calcAccuracy()
            });
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
                    <LineChart data={graph.current} width={800} height={300} margin={{ top: 25, right: 25, bottom: 25, left: 25 }}>
                        <Line dataKey="wpm" strokeWidth={3} stroke="#7ab3d8ff" dot={false} />
                        <Line dataKey="accuracy" strokeWidth={3} stroke="#ef5e5eff" dot={false} />
                        <YAxis stroke="white" padding={{top: 25}} />
                        <XAxis stroke="white" dataKey="time" type="number" domain={[0,0]}/>
                        <Legend align="right" />
                        <CartesianGrid strokeWidth={0.5} />
                        <Tooltip />
                    </LineChart>
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
        
        e.preventDefault();

        const key = e.key;
        if (key == "Shift") return;
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
        graph.current.push({
            time: (Math.ceil(time * 100) / 100),
            wpm: (Math.ceil(calcWpm() * 100) / 100),
            accuracy: (Math.ceil(calcAccuracy() * 10000) / 100)
        });
    }
}