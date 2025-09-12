import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { adminOnlyEndpoint, userOnlyEndpoint, type User } from "../user/usersSlice";
import { changeTextCategoryStart, deleteTextStart, getAllTextsStart, getCategoriesStart } from "./textsSlice";
import AddText from "./AddText";


export default function Texts() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getAllTextsStart());
    }, [dispatch]);

    const texts = useAppSelector(state => state.texts.allTexts);
    const user = useAppSelector(state => state.users.user) as User;

    const categories = useAppSelector(state => state.texts.allCategories);

    useEffect(() => {
            dispatch(getCategoriesStart());
    }, [dispatch])

    return (
        <div>
            <button onClick={() => dispatch(userOnlyEndpoint())}>User only</button>
            <button onClick={() => dispatch(adminOnlyEndpoint())}>Admin only</button>

            <AddText />

            <h1>Texts</h1>

            <table className="table">
                <thead>
                    <tr>
                        <th>Text</th>
                        <th>Category</th>
                        <th>Length</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {texts.map(t =>
                        <tr key={t.idTex}>
                            <td>{t.content.substring(0, 50) + (t.content.length > 50?"...":"")}</td>
                            <td>{t.category.name}</td>
                            <td>{t.idTex}</td>
                            <td>
                                {user.op == 0 &&
                                    <div>
                                        <button className="btn btn-primary">Play</button>
                                    </div>
                                }
                                {user.op == 1 &&
                                    <div style={{display: "flex"}}>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => dispatch(deleteTextStart(t.idTex))}
                                        >
                                                Delete
                                        </button>
                                        <div className="dropdown">
                                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                Change Category
                                            </button>
                                            <ul className="dropdown-menu">
                                                {categories.map(c =>
                                                    <li
                                                        className="dropdown-item"
                                                        key={t.idTex + "/" + c.idCat}
                                                        onClick={() => dispatch(changeTextCategoryStart({
                                                            idTex: t.idTex,
                                                            idCat: c.idCat
                                                        }))}
                                                        >
                                                            {c.name}
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>
        
    );
}