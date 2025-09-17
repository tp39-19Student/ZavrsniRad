import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getProfileStart, getProfileStatsStart } from "./profileSlice";
import { useParams } from "react-router";
import type { User } from "../user/usersSlice";



export default function Profile() {
    const dispatch = useAppDispatch();
    const {id} = useParams();

    const user = useAppSelector(state => state.users.user) as User;
    const profile = useAppSelector(state => state.profile.profile);

    const dailyStats = useAppSelector(state => state.profile.dailyStats);
    const monthlyStats = useAppSelector(state => state.profile.monthlyStats);

    useEffect(() => {
        dispatch(getProfileStart(id?parseInt(id):0));
        dispatch(getProfileStatsStart(id?parseInt(id):0));
    }, [dispatch])

    return (
        <div>
            {profile != null?
            <>
                <div>
                    <h1>{profile.username}</h1>
                    
                </div>
                <div>Gold: {profile.gold}</div>
                <div>Silver: {profile.silver}</div>
                <div>Bronze: {profile.bronze}</div>

                {profile.followed.map(f => 
                    <div>F:{f.username}</div>
                )}

                {dailyStats.length}<br/>
                {monthlyStats.length}
            </>
            :
            <h1>No profile loaded</h1>
        }
            
        </div>
    );
};