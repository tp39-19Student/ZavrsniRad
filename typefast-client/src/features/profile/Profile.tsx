import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getProfileStart, getProfileStatsStart } from "./profileSlice";
import { useParams } from "react-router";
import { setFollowStart, type User } from "../user/usersSlice";
import StatCharts from "./StatCharts";



export default function Profile() {
    const dispatch = useAppDispatch();
    const {id} = useParams();

    const user = useAppSelector(state => state.users.user) as User;
    const profile = useAppSelector(state => state.profile.profile);

    const wpm = useAppSelector(state => state.profile.wpm);
    const accuracy = useAppSelector(state => state.profile.accuracy);
    const totalPlays = useAppSelector(state => state.profile.totalPlays);

    const isFollowed = profile != null && (user.followed.findIndex(f => f.idPer == profile.idPer) != -1);


    useEffect(() => {
        dispatch(getProfileStart(id?parseInt(id):0));
    }, [dispatch, id])

    return (
        <div>
            {profile != null?
            <>
                <div>
                    <h1>{profile.username}</h1>
                    {profile.idPer != user.idPer &&
                        (isFollowed?
                            <button
                            className="btn btn-danger"
                            onClick={() => dispatch(setFollowStart({
                                idFer: user.idPer,
                                idFed: profile.idPer,
                                state: false
                            }))}
                            >
                                Unfollow
                            </button>
                            :
                            <button
                            className="btn btn-success"
                            onClick={() => dispatch(setFollowStart({
                                idFer: user.idPer,
                                idFed: profile.idPer,
                                state: true
                            }))}
                            >
                                Follow
                            </button>
                        )
                    }
                    Wpm: {wpm.toFixed(2)}, Accuracy: {(accuracy * 100).toFixed(2)}%, TotalPlays: {totalPlays}
                </div>
                <div>Gold: {profile.gold}</div>
                <div>Silver: {profile.silver}</div>
                <div>Bronze: {profile.bronze}</div>

                {profile.followed.map(f => 
                    <div>F:{f.username}</div>
                )}

                <StatCharts id={profile.idPer} />
            </>
            :
            <h1>No profile loaded</h1>
        }
            
        </div>
    );
};