import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getLeaderboardStart, type Score } from "./gameSlice";
import MultiButton from "../../components/MultiButton";



export default function Scores({idTex}: {idTex: number}) {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.users.user);
    const leaderboard = useAppSelector(state => state.game.leaderboard);

    const [showFollowing, setShowFollowing] = useState(0);

    useEffect(() => {
        dispatch(getLeaderboardStart(idTex));
    }, [dispatch]);

    const sortedLeaderboard = [...leaderboard].sort((a,b) => a.time - b.time);
    let rankedLeaderboard = sortedLeaderboard.map((el, i) => {return {...el, rank: i};})

    if (user != null && showFollowing == 1) rankedLeaderboard = rankedLeaderboard.filter(el => {
        return (user.followed.findIndex(u => u.idPer == el.idPer) != -1) || el.idPer == user.idPer;
    })

    return (
        <div>
            <h1>Scores {leaderboard.length}</h1>
            <MultiButton
                selected={showFollowing}
                onSelect={setShowFollowing}
                vals={["All", "Followed"]}
            />
            <table id="leaderboard" className="table">
                <thead>
                    <tr>
                        <th>Place</th>
                        <th>User</th>
                        <th>Time</th>
                        <th>Accuracy</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {rankedLeaderboard.map(s =>
                        <tr key={s.idSco} className={scoreClass(s)}>
                            <td>{s.rank + 1}</td>
                            <td>{s.user.username}</td>
                            <td>{s.time.toFixed(2)}</td>
                            <td>{(s.accuracy * 100).toFixed(2)}%</td>
                            <td>{new Date(s.datePlayed).toLocaleDateString()}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    function scoreClass(score: Score) {
        //console.log(JSON.stringify(user));
        if (score.current) return "currentScore";
        if (score.user.idPer == user?.idPer) return "myScore";
        return ""
    }
}