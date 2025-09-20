import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getProfileStart, getProfileStatsStart, unblockStart } from "./profileSlice";
import { useParams } from "react-router";
import { setFollowStart, type User } from "../user/usersSlice";
import TrendCharts from "./TrendCharts";
import { Modal } from "react-bootstrap";
import Block from "./Block";



export default function Profile() {
    const dispatch = useAppDispatch();
    const {id} = useParams();

    const user = useAppSelector(state => state.users.user) as User;
    const profile = useAppSelector(state => state.profile.profile);

    const wpm = useAppSelector(state => state.profile.wpm);
    const accuracy = useAppSelector(state => state.profile.accuracy);
    const totalPlays = useAppSelector(state => state.profile.totalPlays);

    const isFollowed = profile != null && (user.followed.findIndex(f => f.idPer == profile.idPer) != -1);

    const [showModalBlock, setShowModalBlock] = useState(false);

    useEffect(() => {
        dispatch(getProfileStart(id?parseInt(id):0));
    }, [dispatch, id])

    return (
        <div>
            {(profile != null && profile.op != 1)?
            <>
                {user.op == 1 && 
                <Modal show={showModalBlock} onHide={() => setShowModalBlock(false)} scrollable>
                    <Modal.Header closeButton closeVariant="white">
                        <Modal.Title>
                            Block user: {profile.username} (id: {profile.idPer})
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Block profile={profile} />
                    </Modal.Body>
                </Modal>

                }
                <div>
                    <div id="userTitle">
                        <div className="titleBar">
                            <div className="title">
                                <span>{profile.username}</span>
                                
                                <span id="medals">
                                    <span className="gold">{profile.gold}</span>
                                    <span className="silver">{profile.silver}</span>
                                    <span className="bronze">{profile.bronze}</span>
                                </span>
                            </div>
                            <div className="actions">
                                {profile.idPer != user.idPer &&
                                    (isFollowed?
                                        <button
                                        className="btn unfollow"
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
                                        className="btn follow"
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
                                {user.op == 1 && profile.op != 1 && (
                                    <>
                                        {(profile.blUntil < Date.now() / 1000)?
                                        <button className="btn btn-danger" onClick={() => setShowModalBlock(true)}>Block</button>
                                        :
                                        <button className="btn btn-warning" onClick={() => dispatch(unblockStart(profile.idPer))}>Unblock</button>
                                    }
                                    </>
                                )
                                    
                                }
                            </div>
                        </div>
                        <hr />
                        <div className="stats">
                            <span>Wpm: {wpm.toFixed(2)}</span>
                            <span>Accuracy: {(accuracy * 100).toFixed(2)}%</span>
                            <span>Total Plays: {totalPlays}</span>
                        </div>
                    </div>
                    
                    
                    
                </div>

                <div id="trends">
                    <TrendCharts id={profile.idPer} />
                </div>

            </>
            :
            <h1>No profile loaded</h1>
        }
            
        </div>
    );
};