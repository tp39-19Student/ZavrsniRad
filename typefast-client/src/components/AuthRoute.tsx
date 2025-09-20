import { useEffect, useState, type JSX } from "react";
import { useAppSelector } from "../hooks";
import Login from "../features/user/Login";
import Register from "../features/user/Register";
import MultiButton from "./MultiButton";

interface AuthRouteProps {
    role: number;
}

export default function AuthRoute({role, children}: React.PropsWithChildren<AuthRouteProps>) {
    const lrState = useAppSelector(state => state.users.lrState);

    const user = useAppSelector(state => state.users.user);
    const [selected, setSelected] = useState(0);

    const [username, setUsername] = useState("");

    useEffect(() => {
        if (lrState == 2) {
            setSelected(0);
        }
    }, [lrState])

    if (user == null) return (
        <div className="center">
            <div className="w-50">
            <MultiButton 
                vals={["Login", "Register"]}
                onSelect={setSelected}
                selected={selected}
            />
            {selected == 0? 
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
        </div>
    );

    if (role != 2 && user.op != role) {
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