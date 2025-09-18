import { NavLink } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logoutStart } from "../features/user/usersSlice";

export default function Navbar() {
    const user = useAppSelector(state => state.users.user);
    const dispatch = useAppDispatch();

    return (
        <nav className="navbar navbar-expand navbar-light bg-light">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/texts" className="nav-link">Texts</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/leaderboard" className="nav-link">Users</NavLink>
                        </li>
                    </ul>
                    <div>
                        {user != null && <>
                            <NavLink to={"/profile/" + user.idPer} className="nav-link">Profile</NavLink>
                            <span>Logged in as {user?.username}</span>
                            <button onClick={() => dispatch(logoutStart())}>Logout</button> 
                        </>}
                    </div>
                </div>
            </div>
        </nav>
    );
}