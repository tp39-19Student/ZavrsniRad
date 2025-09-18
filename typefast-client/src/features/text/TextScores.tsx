import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { deleteScoreStart, getScoresForTextStart } from "./textsSlice";
import Pagination from "../../components/Pagination";
import { Link } from "react-router";

export default function TextScores({idTex}: {idTex: number}) {
    const dispatch = useAppDispatch();
    const scores = useAppSelector(state => state.texts.scores);
    
    const [page, setPage] = useState(0);

    const SCORES_PER_PAGE = 8;
    const totalPages = Math.ceil(scores.length / SCORES_PER_PAGE);

    useEffect(() => {
        dispatch(getScoresForTextStart(idTex));
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
                            <td>{s.user.username}</td>
                            <td>{s.time.toFixed(2)}s</td>
                            <td>{(s.accuracy * 100).toFixed(2)}%</td>
                            <td>
                                <div>
                                    <button
                                        className="btn btn-warning"
                                        onClick={() => dispatch(deleteScoreStart(s.idSco))}
                                    >
                                        Delete
                                    </button>
                                    <Link className="btn btn-danger" to={"/block/" + s.idPer}>Block</Link>
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