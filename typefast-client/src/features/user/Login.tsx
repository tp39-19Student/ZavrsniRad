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
        <div>
            <div className="error">{error}</div>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Username..."
                    value={username}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button
                className="btn btn-primary"
                onClick={login}
                disabled={lrState == 1}
                >
                    {lrState == 1?"Please wait...":"Login"}
            </button>{
                lrState != 1 &&
                <div className={lrState == 2?"success":"error"}>{lrMessage}</div>
            }
            
        </div>
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