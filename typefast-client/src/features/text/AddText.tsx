import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { getCategoriesStart, submitTextStart } from "./textsSlice";


export default function AddText() {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getCategoriesStart());
    }, [dispatch])

    const categories = useAppSelector(state => state.texts.allCategories);


    const [selectedCategory, setSelectedCategory] = useState(1);
    const [text, setText] = useState("");

    const submitState = useAppSelector(state => state.texts.submitState);

    useEffect(() => {
        if (submitState == 2) {
            setText("");
        }
    }, [submitState])

    return (
        <div>
            <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <select
                    className="form-select"
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
                >
                    {categories.map(c =>
                        <option key={c.idCat} value={c.idCat}>{c.name}</option>
                    )}
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="text" className="form-label">Text</label>
                <textarea
                    className="form-control"
                    id="text"
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                ></textarea>
            </div>
            <button
                className="btn btn-primary"
                onClick={submitText}
            >
                {submitState == 1?"Please wait...":"Submit Text"}
            </button>
            <div className={submitState == -1?"error":"success"}>
                {submitState == -1 && "Text submission failed"}
                {submitState == 2 && "Text submitted successfully"}
            </div>
        </div>
    );

    function submitText() {
        if (text.length == 0) return;

        dispatch(submitTextStart({
            idCat: selectedCategory,
            text: text
        }));
    }
}