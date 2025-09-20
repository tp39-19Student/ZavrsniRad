import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { loginStart } from "./usersSlice";

export default function Login({username, onChange}: {username: string, onChange: (nextUsername: string) => void}) {
    const dispatch = useAppDispatch();

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const lrState = useAppSelector(state => state.users.lrState);
    const lrMessage = useAppSelector(state => state.users.lrMessage);

    return (
        <table className="table table-borderless">
            <tbody>
                <tr>
                    <td className="error" colSpan={2}>{error}</td>
                </tr>
                <tr>
                    <td>
                        <label htmlFor="username" className="form-label">Username:</label>
                    </td>
                    <td>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Username..."
                            value={username}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <label htmlFor="password" className="form-label">Password:</label>
                    </td>
                    <td>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <button
                            className="btn btn-primary"
                            onClick={login}
                            disabled={lrState == 1}
                            >
                                {lrState == 1?"Please wait...":"Login"}
                        </button>
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        {
                            lrState != 1 &&
                            <div className={lrState == 2?"success":"error"}>{lrMessage}</div>
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    );

    function login() {
        if (username.length == 0) {
            setError("Username field is required");
            return;
        }

        if (password.length == 0) {
            setError("Password field is required");
            return;
        }


        setError("");
        dispatch(loginStart({
            username: username,
            password: password
        }));
    }
};