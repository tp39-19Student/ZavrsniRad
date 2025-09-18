import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getGlobalLeaderboardStart } from "./profileSlice";
import { Link } from "react-router";


export default function GlobalLeaderboard() {
    const dispatch = useAppDispatch();

    const leaderboard = useAppSelector(state => state.profile.leaderboard);

    useEffect(() => {
        dispatch(getGlobalLeaderboardStart());
    }, [dispatch]);

    const [filterText, setFilterText] = useState("");

    const markedLeaderboard = leaderboard.map((el, i) => {
        return {
            ...el,
            place: i
        }
    })

    let filteredLeaderboard = markedLeaderboard;
    if (filterText.length > 0) filteredLeaderboard = markedLeaderboard.filter(el => el.username.toLowerCase().includes(filterText.toLowerCase()));

    return(
        <div>
            <h1>Leaderboard</h1>
            <input className="form-control" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Wpm</th>
                        <th>Accuracy</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLeaderboard.map((r) =>
                        <tr key={r.idPer}>
                            <td>{r.place + 1}</td>
                            <td><Link to={"/profile/" + r.idPer}>{r.username}</Link></td>
                            <td>{r.wpm.toFixed(2)}</td>
                            <td>{(r.accuracy * 100).toFixed(2)}%</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}