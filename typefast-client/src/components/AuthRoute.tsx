import { useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
import Login from "../features/user/Login";
import Register from "../features/user/Register";
import MultiButton from "./MultiButton";

interface AuthRouteProps {
    role: number;
}

/* Roles
    -1: Guests and Users
    0: Users
    1: Admins
    2: Users and Admins
*/
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

    if (user == null) {
        if (role != -1) return (
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
        </div>);
    } else {
        if (role == -1 && user.op != 0) return <h1>This page is only available to guests and regular users</h1>
        if (role == 0 && user.op != 0) return <h1>This page is only available to regular users</h1>
        if (role == 1 && user.op != 1) return <h1>This page is only available to admins</h1>
        if (role == 2 && (user.op != 0 && user.op != 1)) return <h1>This page is only avaible to admins and regular users</h1>
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