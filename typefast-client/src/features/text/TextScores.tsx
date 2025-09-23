import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { deleteScoreStart, getDailyScoresStart, getScoresForTextStart } from "./textsSlice";
import Pagination from "../../components/Pagination";
import { Link } from "react-router";

export default function TextScores({idTex}: {idTex: number}) {
    const dispatch = useAppDispatch();
    const scores = idTex != 0?useAppSelector(state => state.texts.scores): useAppSelector(state => state.texts.dailyScores);
    
    const [page, setPage] = useState(0);

    const SCORES_PER_PAGE = 8;
    const totalPages = Math.ceil(scores.length / SCORES_PER_PAGE);

    useEffect(() => {
        if (idTex != 0) dispatch(getScoresForTextStart(idTex));
        else dispatch(getDailyScoresStart());
    }, [dispatch])

    const displayedScores = [...scores].sort((a, b) => a.time - b.time).slice(page * SCORES_PER_PAGE, (page + 1) * SCORES_PER_PAGE);

    return (
        <div>
            <Pagination 
                current={page}
                total={totalPages}
                onPageChange={showPage}
                maxWidth={3}
            />
            <table className="table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Time</th>
                        <th>Accuracy</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {displayedScores.map(s =>
                        <tr key={s.idSco}>
                            <td className="col"><Link to={"/profile/" + s.idPer}>{s.user.username}</Link></td>
                            <td className="col-2">{s.time.toFixed(2)}s</td>
                            <td className="col-2">{(s.accuracy * 100).toFixed(2)}%</td>
                            <td className="col-2">
                                <div className="textActions">
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => dispatch(deleteScoreStart(s.idSco))}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    function showPage(page: number) {
        if (page < 0 || page >= totalPages) return;
        setPage(page);
    } 
}