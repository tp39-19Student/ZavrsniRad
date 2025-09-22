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
    const [submitError, setSubmitError] = useState("");

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
                    rows={6}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                ></textarea>
            </div>
            <div style={{display: "flex"}}>
                <button
                    className="btn btn-primary"
                    onClick={submitText}
                >
                    {submitState == 1?"Please wait...":"Submit Text"}
                </button>
                {(submitState != 0 || submitError.length > 0) &&
                    <span id="addTextFeedback" className={submitState == -1 || submitError.length > 0?"error":"success"}>
                        {
                            submitError.length > 0?
                            <>{submitError}</>
                            :
                            <>
                                {submitState == -1 && "Text submission failed"}
                                {submitState == 2 && "Text submitted successfully"} 
                            </>
                        }
                    </span>
                }
            </div>
        </div>
    );

    function submitText() {
        setSubmitError("");

        const strippedText = text.replaceAll(/\s+/g, " ").trim();

        if (strippedText.length < 2) {
            setSubmitError("Text must be at least 2 characters long");
            return;
        }

        if (strippedText.length > 5000) {
            setSubmitError("Max text length is 5000");
            return;
        }

        //alert(strippedText.length);

        dispatch(submitTextStart({
            idCat: selectedCategory,
            text: strippedText
        }));
    }
}