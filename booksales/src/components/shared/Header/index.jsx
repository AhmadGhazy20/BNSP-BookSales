import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../../Context/AuthContext';
import { useCart } from '../../../Context/CartContext';

function HeaderContent() {
    const navigate = useNavigate();
    const { user, isAuthenticated, isAdmin, logoutUser } = useAuth();
    const { totalItems } = useCart();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        await logoutUser();
        setLoggingOut(false);
        navigate('/');
    };

    return (
        <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
            <div className="col-md-3 mb-2 mb-md-0">
                <Link
                    to="/"
                    className="d-inline-flex align-items-center text-decoration-none"
                >
                    <i
                        className="fa-solid fa-book"
                        style={{ color: "rgb(116, 192, 252)" }}
                    ></i>
                    <span className="ms-2 fs-4 text-dark fw-bold">
                        BookSales
                    </span>
                </Link>
            </div>

            <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                <li>
                    <Link to="/" className="nav-link px-2 text-dark">
                        Home
                    </Link>
                </li>

                <li>
                    <Link to="/books" className="nav-link px-2 text-dark">
                        Books
                    </Link>
                </li>

                <li>
                    <Link to="/about" className="nav-link px-2 text-dark">
                        About Us
                    </Link>
                </li>

                <li>
                    <Link to="/team" className="nav-link px-2 text-dark">
                        Team
                    </Link>
                </li>

                <li>
                    <Link to="/contact" className="nav-link px-2 text-dark">
                        Contact
                    </Link>
                </li>
            </ul>

            <div className="col-md-3 text-end d-flex flex-wrap justify-content-end align-items-center gap-2">
                <Link
                    to="/cart"
                    className="btn btn-outline-primary position-relative"
                >
                    <i className="fa-solid fa-cart-shopping me-1"></i>
                    Cart
                    {totalItems > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {totalItems}
                        </span>
                    )}
                </Link>

                {isAuthenticated ? (
                    <>
                        {isAdmin && (
                            <Link
                                to="/admin/books"
                                className="btn btn-outline-dark"
                            >
                                Dashboard
                            </Link>
                        )}

                        <span className="text-muted small">
                            Halo, {user?.name}
                        </span>

                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleLogout}
                            disabled={loggingOut}
                        >
                            {loggingOut ? 'Keluar...' : 'Logout'}
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn btn-outline-primary">
                            Login
                        </Link>

                        <Link to="/register" className="btn btn-primary">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default HeaderContent;
