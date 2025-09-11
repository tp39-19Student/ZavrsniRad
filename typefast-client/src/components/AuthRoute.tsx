import { useEffect, useState, type JSX } from "react";
import { useAppSelector } from "../hooks";
import Login from "../features/user/Login";
import Register from "../features/user/Register";

interface AuthRouteProps {
    role: number;
}

export default function AuthRoute({role, children}: React.PropsWithChildren<AuthRouteProps>) {
    const lrState = useAppSelector(state => state.users.lrState);

    const user = useAppSelector(state => state.users.user);
    const [showLogin, setShowLogin] = useState(true);

    const [username, setUsername] = useState("");

    useEffect(() => {
        if (lrState == 2) {
            setShowLogin(true);
        }
    }, [lrState])

    if (user == null) return (
        <div>
            <button
            className={"btn " + (showLogin?"btn-primary":"btn-secondary")}
            onClick={() => setShowLogin(true)}
            >
                Login
            </button>
            <button
            className={"btn " + (!showLogin?"btn-primary":"btn-secondary")}
            onClick={() => setShowLogin(false)}
            >
                Register
            </button>
            {showLogin? 
            <Login
                username = {username}
                onChange = {handleUsernameChange}
            />
            :
            <Register
                username = {username}
                onChange = {handleUsernameChange}
            />}
        </div>
    );

    if (user.op != role) {
        if (role == 0) return <h1>This page is only available to regular users.</h1>
        if (role == 1) return <h1>This page is only available to admins.</h1>
        return <h1>User doesnt have the permission to use this page.</h1>
    }

    return (
        <>
            {children}
        </>
    );

    function handleUsernameChange(nextUsername: string) {
        setUsername(nextUsername);
    }
}