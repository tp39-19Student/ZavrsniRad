import { useState } from "react";
import type { User } from "../user/usersSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { blockStart, clearBlockMsg, setBlockMsg } from "./profileSlice";


export default function Block({profile}: {profile: User}) {
    const dispatch = useAppDispatch();

    const [blockReason, setBlockReason] = useState("");
    const [blockUntil, setBlockUntil] = useState("");

    const blockDate = new Date(blockUntil);

    const blockState = useAppSelector(state => state.profile.blockState);
    const blockMsg = useAppSelector(state => state.profile.blockMsg);

    return (
        <>
            <div className="mb-3">
                <label htmlFor="reason" className="form-label">Block reason</label>
                <textarea
                    className="form-control"
                    id="reason"
                    rows={6}
                    value={blockReason}
                    onChange={(e) => {setBlockReason(e.target.value); dispatch(clearBlockMsg());}}
                ></textarea>
            </div>
            <div className="mb-3">
                <label htmlFor="time" className="form-label">Block until</label>
                <input
                    className="form-control"
                    type="datetime-local"
                    id="time"
                    value={blockUntil}
                    onChange={(e) => {setBlockUntil(e.target.value); dispatch(clearBlockMsg());}}
                ></input>
            </div>

            <div style={{display: "flex"}}>
                <button
                    className="btn btn-danger"
                    onClick={block}
                    disabled={((Date.now() / 1000) < profile.blUntil)}
                >
                    {blockState == 1?"Please wait...":"Block"}
                </button>
                {(blockMsg.length > 0) &&
                    <span id="blockFeedback" className={blockState == -1?"error":"success"}>
                        {
                            blockMsg
                        }
                    </span>
                }
            </div>
        </>
    );

    function block() {
        if (blockUntil.length == 0) {
            dispatch(setBlockMsg("Please select the block expiration date"));
            return;
        }

        const now = new Date(Date.now());

        if (blockDate < now) {
            dispatch(setBlockMsg("Block expiration is in the past"))
            return;
        }

        dispatch(blockStart({
            idPer: profile.idPer,
            blReason: blockReason,
            blUntil: (blockDate.getTime() / 1000)
        }))
    }
}