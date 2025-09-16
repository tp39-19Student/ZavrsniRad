import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getLeaderboardStart, getTextStart, submitScoreStart, type Score } from "./gameSlice";
import { type Text } from "../text/textsSlice";

import "./Game.css"
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


export default function Game() {
    const dispatch = useAppDispatch();
    const {id} = useParams();

    const text = useAppSelector(state => state.game.text) as Text;
    const leaderboard = useAppSelector(state => state.game.leaderboard);
    const user = useAppSelector(state => state.users.user);

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

    interface GraphNode {
        time: number;
        wpm: number;
        accuracy: number;
    };

    const graph = useRef<GraphNode[]>([{time: 0, wpm: 0, accuracy: 100}]);
    const n = useRef(0);

    useEffect(() => {
        if (time > 0) {
            n.current++;
            if (n.current == 25) {
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

            dispatch(submitScoreStart({
                idTex: text.idTex,
                time: time,
                accuracy: calcAccuracy()
            }))
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
        dispatch(getLeaderboardStart(text.idTex));
    }, [text])

    const sortedLeaderboard = [...leaderboard].sort((a,b) => a.time - b.time);

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

            <h1>Scores</h1>
            <table id="leaderboard" className="table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Time</th>
                        <th>Accuracy</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedLeaderboard.map(s =>
                        <tr key={s.idSco} className={scoreClass(s)}>
                            <td>{s.user.username}</td>
                            <td>{s.time.toFixed(2)}</td>
                            <td>{(s.accuracy * 100).toFixed(2)}%</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {finished &&
                <>
                    <LineChart data={graph.current} width={800} height={300} margin={{ top: 25, right: 25, bottom: 25, left: 25 }}>
                        <Line dataKey="wpm" stroke="blue" />
                        <Line dataKey="accuracy" stroke="red" />
                        <YAxis padding={{top: 25}} />
                        <XAxis dataKey="time" type="number" domain={[0,0]}/>
                        <Legend />
                        <CartesianGrid />
                        <Tooltip />
                    </LineChart>
                </>
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

    function scoreClass(score: Score) {
        if (score.current) return "table-success";
        if (score.user.idPer == user?.idPer) return "table-warning";
        return ""
    }

    function graphCapture() {
        graph.current.push({
            time: (Math.ceil(time * 100) / 100),
            wpm: (Math.ceil(calcWpm() * 100) / 100),
            accuracy: (Math.ceil(calcAccuracy() * 10000) / 100)
        });
    }
}