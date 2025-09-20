import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { registerStart } from "./usersSlice";

export default function Register({username, onChange}: {username: string, onChange: (nextUsername: string) => void}) {
    const dispatch = useAppDispatch();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");

    const lrState = useAppSelector(state => state.users.lrState);
    const lrMessage = useAppSelector(state => state.users.lrMessage);

    return (
        <table className="table table-borderless">
            <tbody>

                <tr>
                    <td colSpan={2} className="error">
                        {error}
                    </td>
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
                    <td>
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                    </td>
                    <td>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirm Password..."
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}>
                        <button
                            className="btn btn-primary"
                            onClick={register}
                            disabled={lrState == 1}
                            >
                                {lrState == 1?"Please wait...":"Register"}
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

    function register() {
        if (username.length < 4) {
            setError("Username must be at least 4 characters");
            return;
        }

        if (/^[a-zA-z0-9_]+$/.test(username) == false) {
            setError("Username must only contain alphanumerics and underscores");
            return;
        } 

        if (password.length < 7) {
            setError("Password must be at least 7 characters");
            return;
        }

        if (/[A-Z]/.test(password) == false || /[0-9]/.test(password) == false) {
            setError("Password must contain at least 1 capital letter and number");
            return;
        }

        if (confirmPassword !== password) {
            setError("Password confirmation doesn't match password");
            return;
        }

        setError("");
        dispatch(registerStart({
            username: username,
            password: password
        }))
    }
};