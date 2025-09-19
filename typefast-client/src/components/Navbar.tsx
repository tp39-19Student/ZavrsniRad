import { NavLink } from "react-router";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logoutStart } from "../features/user/usersSlice";
import { Container, Navbar as NavB, Nav, NavDropdown } from "react-bootstrap";

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

        <nav className="navbar navbar-expand navbar-dark bg-dark">
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
                    {user != null &&
                        <ul className="navbar-nav mb-auto mb-2 mb-lg-0">
                            
                            <li className="nav-item" id="navbarInfo">
                                <span>Logged in as {user?.username}</span>
                            </li>
                            {user.op == 0 &&
                                <li className="nav-item">
                                    <NavLink to={"/profile/" + user.idPer} className="nav-link">Profile</NavLink>
                                </li>
                            }
                            <li className="nav-item">
                                <button onClick={() => dispatch(logoutStart())}>Logout</button> 
                            </li>
                        </ul>
                    }
                    
                    
                </div>
            </div>
        </nav>
        </>
    );
}