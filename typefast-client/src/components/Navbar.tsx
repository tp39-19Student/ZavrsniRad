import { NavLink } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logoutStart } from "../features/user/usersSlice";

export default function Navbar() {
    const user = useAppSelector(state => state.users.user);
    const dispatch = useAppDispatch();

    return (
        <>
        {/*<NavB expand="lg" className="bg-body-tertiary">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link>
                        <NavLink to="/" className="nav-link">Home</NavLink>
                    </Nav.Link>
                    <Nav.Link>
                        <NavLink to="/texts" className="nav-link">Texts</NavLink>
                    </Nav.Link>
                    <Nav.Link>
                        <NavLink to="/leaderboard" className="nav-link">Users</NavLink>
                    </Nav.Link>
                </Nav>
                {user != null &&
                    <Nav>
                        
                        <NavB.Text className="text-center">
                            Logged in as {user.username}
                        </NavB.Text>
                        <Nav.Link>
                            <NavLink to={"/profile/" + user.idPer} className="nav-link">Profile</NavLink>
                        </Nav.Link>
                        <Nav.Item as={Nav.Link}>
                            <button onClick={() => dispatch(logoutStart())}>Logout</button> 
                        </Nav.Item>
                    </Nav>
                }
            </Container>
        </NavB> */}

        <nav className="navbar navbar-expand" id="navbar">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse row" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 col-lg-6 col-sm-12">
                        {(user == null || user.op != 1) &&
                        <li className="nav-item">
                            <NavLink to="/play" className="nav-link">Play</NavLink>
                        </li>
                        }
                        {user != null && user.op == 0 &&
                        <li className="nav-item">
                            <NavLink to="/multiplayer" className="nav-link">Multi</NavLink>
                        </li>
                        }
                        {user != null &&
                        <li className="nav-item">
                            <NavLink to="/texts" className="nav-link">Texts</NavLink>
                        </li>
                        }
                        <li className="nav-item">
                            <NavLink to="/leaderboard" className="nav-link">Users</NavLink>
                        </li>
                    </ul>
                    <ul className="navbar-nav mb-auto mb-2 mb-lg-0 col-lg-6 col-sm-12 justify-content-end">
                        {user != null? <>
                            <li className="" id="navbarInfo">
                                <span>Logged in as {user?.username}</span>
                            </li>
                            {user.op == 0 &&
                                <li className="nav-item" id="profileNav">
                                    <NavLink to={"/profile/" + user.idPer} className="nav-link">Profile</NavLink>
                                </li>
                            }
                            <li className="nav-item">
                                <button id="logout" onClick={() => dispatch(logoutStart())}>Logout</button> 
                            </li>
                        </>
                        :
                        <>
                            <li className="nav-item">
                                <NavLink className="nav-link" to={"/"}>Sign In</NavLink>
                            </li>
                        </>}
                    </ul>
                </div>
            </div>
        </nav>
        
        </>
    );
}