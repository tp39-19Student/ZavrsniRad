import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getGlobalLeaderboardStart } from "./profileSlice";
import { Link } from "react-router";
import MultiButton from "../../components/Multibutton";


export default function GlobalLeaderboard() {
    const dispatch = useAppDispatch();

    const leaderboard = useAppSelector(state => state.profile.leaderboard);
    const user = useAppSelector(state => state.users.user);

    useEffect(() => {
        dispatch(getGlobalLeaderboardStart());
    }, [dispatch]);

    const [filterText, setFilterText] = useState("");
    const [showFollowing, setShowFollowing] = useState(0);

    const markedLeaderboard = leaderboard.map((el, i) => {
        return {
            ...el,
            place: i
        }
    })

    let filteredLeaderboard = markedLeaderboard;
    if (filterText.length > 0) filteredLeaderboard = markedLeaderboard.filter(el => el.username.toLowerCase().includes(filterText.toLowerCase()));
    if (user != null && showFollowing == 1) filteredLeaderboard = filteredLeaderboard.filter(el => {
        return (user.followed.findIndex(u => u.idPer == el.idPer) != -1) || el.idPer == user.idPer;
    })

    return(
        <div>
            <input
                className="form-control mb-3"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)} 
                placeholder="Search users..."
            />
            {user != null && user.op == 0 &&
                <MultiButton
                    selected={showFollowing}
                    onSelect={setShowFollowing}
                    vals={["All", "Followed"]}
                />
            }
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