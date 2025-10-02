import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr"
import { useAppDispatch, useAppSelector, useCountdown } from "../../hooks";
import type { User } from "../user/usersSlice";
import type { Text } from "../text/textsSlice";
import Game from "./Game";
import { submitScoreStart, type SubmitScoreRequest } from "./gameSlice";
import { Link } from "react-router";
import { race } from "redux-saga/effects";

interface MPUser {
    idPer: number;
    username: string;
}

interface MPRoom {
    chosenText: Text;
    users: MPUser[];
    startTime: number;
}

interface MPPacket {
    idPer: number;
    username: string;

    progress: number;
    time: number;
    wpm: number;
    accuracy: number;
}

interface LeaderboardRow {
    place: number;
    idPer: number;
    username: string;
    time: number;
    wpm: number;
    accuracy: number;
}

export default function MultiGame() {
    const dispatch = useAppDispatch();

    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const user = useAppSelector(state => state.users.user) as User;

    const [userData, setUserData] = useState<MPPacket[]>([]);

    const [text, setText] = useState<Text | null>(null);
    const [startTime, setStartTime] = useState(0);

    const locked = useRef(false);
    const [started, setStarted] = useState(false);

    //console.log("Start time: " + startTime);
    const countdown = useCountdown(startTime);

    const packetInterval = 25; // Every 10ms * packetInterval, sync progress to multiplayer hub
    const packetCounter = useRef(0);

    const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);

    useEffect(() => {
        const c = new signalR.HubConnectionBuilder().withUrl("/multiplayerHub").build();

        setConnection(c);

        c.start()
        .then()
        .catch((e) => console.error("SignalR connection error: " + e));

        c.on("ReceiveRoom", (room: MPRoom) => {
            //alert(JSON.stringify(room));
            setText(room.chosenText);
            room.users.forEach(u => userJoin(u));
            //alert(room.startTime);
            setStartTime(room.startTime);
        });

        c.on("Join", (u: MPUser) => userJoin(u));
        c.on("Leave", (u: MPUser) => userLeave(u))

        c.on("Lock", () => {
            //alert("Room locked");
            locked.current = true;
        })

        c.on("Start", () => {
            //alert("Room started");
            setStarted(true);
        })

        c.on("ReceiveProgress", (packet: MPPacket) => {
            updateProgress(packet);
        });

        return () => {c.stop(); setConnection(null);}
    }, []);

    const raceData = [...userData].sort((a, b) => {
        if (a.progress != b.progress) return b.progress - a.progress;
        if (a.progress == 1) return a.time - b.time;
        return 0;
    });

    return (
        <>
            <div id="race">
                {raceData.map(u =>
                    <div key={u.idPer} className={"entry" + (u.idPer == user.idPer?" myEntry":"")}>
                        <div className="name">{u.username}</div>
                        <div className="progressBar">
                            <div className={"green" + (u.accuracy<0?" quit":"") + (Math.abs(u.progress) == 1?" full":"")} style={{width: (Math.abs(u.progress) * 100) + "%"}}></div>
                            <div className={"red" + (u.accuracy<0?" quit":"") + (Math.abs(u.progress) == 0?" full":"")} style={{width: ((1 - Math.abs(u.progress)) * 100) + "%"}}></div>
                        </div>
                    </div>
                )}
            </div>
            {!started &&
            <div className="center">
                <div id="MCountdown" className={locked.current?"locked":""}>{countdown}</div>
            </div>
            }
            {started == true && text != null &&
                <Game
                    text={text}
                    onFinish={handleFinish}
                    onTick={handleTick}
                    autoStart={true}
                />
            }

            <table id="leaderboard" className="table mt-5">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>User</th>
                        <th>Time</th>
                        <th>Wpm</th>
                        <th>Accuracy</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map(s =>
                        <tr key={s.idPer} className={s.idPer == user.idPer?"myScore":""}>
                            <td className="col-1">{s.place}</td>
                            <td className="col"><Link to={"/profile/" + s.idPer}>{s.username}</Link></td>
                            <td className="col-1">{s.time.toFixed(2)}</td>
                            <td className="col-1">{s.wpm.toFixed(2)}</td>
                            <td className="col-1">{(s.accuracy * 100).toFixed(2)}%</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );

    function sendProgress(progress: number, wpm: number, accuracy: number, time: number) {
        if (connection != null) {
            connection.invoke("SendProgress", {
                idPer: user.idPer,
                username: user.username,
                time: time,
                progress: progress,
                wpm: wpm,
                accuracy: accuracy
            });
        }
    }

    function userJoin(u: MPUser) {
        setUserData(prev => {
            return [...prev, {
                idPer: u.idPer,
                username: u.username,
                time: 0,

                wpm: 0,
                accuracy: 1,
                progress: 0
            }]
        });
    }

    function userLeave(u: MPUser) {
        if (!locked.current) {
            setUserData(prev => prev.filter(p => p.idPer !== u.idPer));
        } else {
            setUserData(prev => {
                const nextData = [...prev];
                const index = nextData.findIndex(p => p.idPer == u.idPer);
                nextData[index] = {
                    ...nextData[index],
                    accuracy: -1
                }
                return nextData;
            })
        }
    }

    function updateProgress(packet: MPPacket) {
        if (packet.progress == 1) setLeaderboard(leaderboard => {
            if (leaderboard.findIndex(p => p.idPer == packet.idPer) != -1) return leaderboard;
            return [...leaderboard, {
                idPer: packet.idPer,
                username: packet.username,
                time: packet.time,
                wpm: packet.wpm,
                accuracy: packet.accuracy,
                place: leaderboard.length + 1
            }];
        })
        setUserData(prev => {
            const nextUserData = [...prev];
            const index = nextUserData.findIndex(p => p.idPer == packet.idPer);
    
            nextUserData[index] = packet;
            return nextUserData;
        });
    }

    function handleFinish(score: SubmitScoreRequest) {
        dispatch(submitScoreStart(score));
    }

    function handleTick(progress: number, wpm: number, accuracy: number, time: number) {
        //console.log("OnTick: " + time);
        packetCounter.current = packetCounter.current + 1;
        if (progress == 1 || packetCounter.current == packetInterval) {
            packetCounter.current = 0;
            //console.log(progress + "%: [" + wpm.toFixed(2) + ", " + accuracy.toFixed(2) + "]");
            sendProgress(progress, wpm, accuracy, time);
        }
    }
}