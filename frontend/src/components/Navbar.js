import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPizzaSlice, FaSignOutAlt, FaUser } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout, isAdmin, isMenaxher } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <FaPizzaSlice className="me-2" />
                    Piceria
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {user && (
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/dashboard">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/kategorite">Kategorite</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/produktet">Produktet</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/porosite">Porosite</Link>
                            </li>
                            {(isAdmin() || isMenaxher()) && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/klientet">Klientet</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/punonjesit">Punonjesit</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/dergesat">Dergesat</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/menyte">Menyte</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/kuponat">Kuponat</Link>
                                    </li>
                                </>
                            )}
                            {isAdmin() && (
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                        Administrimi
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-dark">
                                        <li><Link className="dropdown-item" to="/users">Perdoruesit</Link></li>
                                        <li><Link className="dropdown-item" to="/roles">Rolet</Link></li>
                                        <li><Link className="dropdown-item" to="/vleresimet">Vleresimet</Link></li>
                                    </ul>
                                </li>
                            )}
                        </ul>
                    )}

                    {user && (
                        <div className="d-flex align-items-center">
                            <span className="text-light me-3">
                                <FaUser className="me-1" />
                                {user.emri} {user.mbiemri}
                            </span>
                            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                <FaSignOutAlt className="me-1" />
                                Dil
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;