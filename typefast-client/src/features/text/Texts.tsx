import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector, useDailyCountdown } from "../../hooks";
import { adminOnlyEndpoint, userOnlyEndpoint, type User } from "../user/usersSlice";
import { type Text, approveTextStart, changeTextCategoryStart, deleteTextStart, getApprovedTextsStart, getCategoriesStart, getPendingTextsStart } from "./textsSlice";
import AddText from "./AddText";
import { Link } from "react-router";
import TextScores from "./TextScores";
import Pagination from "../../components/Pagination";
import { DropdownButton, DropdownItem, Modal } from "react-bootstrap";
import MultiButton from "../../components/MultiButton";
import { getDailyTextStart, getNextDailyTimeStart } from "../game/gameSlice";


export default function Texts() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.users.user) as User;

    useEffect(() => {
        dispatch(getApprovedTextsStart());
        if (user.op == 1) dispatch(getPendingTextsStart());
    }, [dispatch]);

    const texts = useAppSelector(state => state.texts.approvedTexts);
    const pendingTexts = useAppSelector(state => state.texts.pendingTexts);

    const dailyText = useAppSelector(state => state.game.dailyText);

    const categories = useAppSelector(state => state.texts.allCategories);

    const dailyCountdown = useDailyCountdown();

    useEffect(() => {
            dispatch(getCategoriesStart());
            dispatch(getDailyTextStart());
    }, [dispatch])

    

    const [showPending, setShowPending] = useState(0);

    const [filterText, setFilterText] = useState("");
    const [filterCategory, setFilterCategory] = useState(0);
    const [page, setPage] = useState(0);

    const [sortBy, setSortBy] = useState("");
    const [sortDirection, setSortDirection] = useState("");

    const TEXTS_PER_PAGE = 5;

    let displayedTexts = (showPending == 1)?pendingTexts:texts;

    if (filterCategory != 0) displayedTexts = displayedTexts.filter(t => t.category.idCat == filterCategory);
    if (filterText.length > 0) displayedTexts = displayedTexts.filter(t => t.content.toLowerCase().includes(filterText.toLowerCase()));

    const totalPages = Math.ceil(displayedTexts.length / TEXTS_PER_PAGE);

    
    if (sortBy.length > 0) {
        displayedTexts = [...displayedTexts].sort((a, b) => {
            let res = 0;
            switch(sortBy.toLowerCase()) {
                case "length": res = a.content.length - b.content.length; break;
                case "text": res = a.content.localeCompare(b.content); break;
                case "category": res = a.category.name.localeCompare(b.category.name); break;
                default: break;
            }
            return (sortDirection == "desc")?-res:res;
        })
    }
    
    displayedTexts = displayedTexts.slice(page * TEXTS_PER_PAGE, (page + 1) * TEXTS_PER_PAGE);

    useEffect(() => {
        if (totalPages > 0 && page >= totalPages) setPage(totalPages - 1);
    }, [texts, pendingTexts])

    const [modalText, setModalText] = useState<Text | null>(null);
    const [showModalText, setshowModalText] = useState(false);

    const [modalScoresId, setModalScoresId] = useState(-1);
    const [showModalScores, setShowModalScores] = useState(false);

    const [showModalAdd , setShowModalAdd] = useState(false);

    return (
        <div>
            <Modal show={showModalText} onHide={() => setshowModalText(false)} scrollable>
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>
                        {modalText != null && ("Category: " + modalText.category.name + ", Length: " + modalText.content.length)}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalText != null && modalText.content}
                </Modal.Body>
            </Modal>


            <Modal size="lg" show={showModalScores} onHide={() => setShowModalScores(false)}>
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>
                        {modalScoresId >= 0 && (
                            modalScoresId == 0?
                            "Daily Scores"
                            :
                            "Scores for id " + modalScoresId
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalScoresId != null && <TextScores idTex={modalScoresId} />}
                </Modal.Body>
            </Modal>

            <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)} size="lg">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>
                        New text
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddText />
                </Modal.Body>
            </Modal>


            {/*
            <button onClick={() => dispatch(userOnlyEndpoint())}>User only</button>
            <button onClick={() => dispatch(adminOnlyEndpoint())}>Admin only</button>
            */}

            
            <div id="texts-input">
                <button
                    className="btn btn-success"
                    onClick={() => setShowModalAdd(true)}
                >
                    Add Text
                </button>

                <input
                    type="text"
                    className="form-control"
                    placeholder="Search texts..."
                    value={filterText}
                    onChange={(e) => {setFilterText(e.target.value); setPage(0);}}
                />

                <select
                    className="form-select"
                    value={filterCategory}
                    onChange={(e) => {setFilterCategory(parseInt(e.target.value)); setPage(0);}}
                >
                    <option value={0}>All Categories</option>
                    {categories.map(c =>
                        <option key={c.idCat} value={c.idCat}>{c.name}</option>
                    )}
                </select>
            </div>
            {user.op == 1 &&
                <MultiButton
                    vals={["Approved", "Pending"]}
                    selected={showPending}
                    onSelect={(n) => {setPage(0); setShowPending(n);}}
                />
            }
            <table className="table">
                <thead>
                    <tr>
                        {["Text", "Category", "Length"].map(h =>
                            <th
                                key={h}
                                onClick={() => changeSort(h)}
                            >
                                {h} 
                                <img
                                    src={getSortImg(h)}
                                />
                            </th>
                        )}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {(displayedTexts).map(t =>
                        <tr key={t.idTex}>
                            <td
                                className="col"
                                onClick={() => {
                                    setModalText(t);
                                    setshowModalText(true);
                                }}
                            >
                                {t.content.substring(0, 200) + (t.content.length > 200?"...":"")}
                            </td>
                            <td className="col-2">{t.category.name}</td>
                            <td className="col-1">{t.content.length}</td>
                            <td className={user.op == 1?"col-4":"col-2"}>
                                <div className="textActions">
                                    {user.op == 0 &&
                                        <>
                                            <Link to={"/play/" + t.idTex} className="btn btn-primary">Play</Link>
                                        </>
                                    }
                                    {user.op == 1 &&
                                        <>
                                            {t.approved == false?
                                                <button
                                                    className="btn btn-success"
                                                    onClick={() => dispatch(approveTextStart(t.idTex))}
                                                >
                                                    Approve
                                                </button>
                                                :
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        setModalScoresId(t.idTex);
                                                        setShowModalScores(true);
                                                    }}
                                                >
                                                    Scores
                                                </button>
                                            }
                                            {(dailyText == null || t.idTex != dailyText.idTex) && <>
                                                <DropdownButton title="Change Category" variant="warning">
                                                    {categories.map(c =>
                                                        <DropdownItem
                                                            key={t.idTex + "/" + c.idCat}
                                                            onClick={() => dispatch(changeTextCategoryStart({
                                                                idTex: t.idTex,
                                                                idCat: c.idCat
                                                            }))}
                                                        >
                                                            {c.name}
                                                        </DropdownItem>
                                                    )}
                                                </DropdownButton>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => dispatch(deleteTextStart(t))}
                                                >
                                                        Delete
                                                </button>
                                            </>}
                                        </>
                                    }
                                </div>
                            </td>
                        </tr>
                    )}
                    {dailyText != null && showPending == 0 &&
                        <tr id="dailyText">
                            <td
                                className="col"
                                onClick={() => {
                                    setModalText(dailyText);
                                    setshowModalText(true);
                                }}
                            >{dailyText.content.substring(0, 200) + (dailyText.content.length > 200?"...":"")}</td>
                            <td className="col-2">{dailyText.category.name}</td>
                            <td className="col-1">{dailyText.content.length}</td>
                            <td className={user.op == 1?"col-4":"col-2"}><div className="textActions">
                            {user.op == 1?
                            <button
                                id="dailyButton"
                                className="btn"
                                onClick={() => {
                                    setModalScoresId(0);
                                    setShowModalScores(true);
                                }}
                            >
                                Daily Scores ({dailyCountdown})
                            </button>
                            :
                            <Link to={"/playDaily/"} className="btn" id="dailyButton">Play Daily ({dailyCountdown})</Link>
                            }
                            </div></td>
                    </tr>}
                </tbody>
            </table>
            <Pagination 
                current={page}
                total={totalPages}
                onPageChange={showPage}
                maxWidth={20}
            />
        </div>
    );

    function showPage(page: number) {
        if (page < 0 || page >= totalPages) return;
        setPage(page);
    }

    function getSortImg(field: string): string {
        if (sortBy != field) return "chevrons-up-down.svg";
        
        if (sortDirection == "asc") return "chevron-up.svg";
        return "chevron-down.svg";
    }

    function changeSort(field: string) {
        setPage(0);
        if (field != sortBy) {
            setSortBy(field);
            setSortDirection("asc");
        } else {
            if (sortDirection == "asc") setSortDirection("desc");
            else {
                setSortBy("");
                setSortDirection("");
            }
        }
    }
}