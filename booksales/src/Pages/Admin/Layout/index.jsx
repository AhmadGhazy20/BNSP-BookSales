import { Link, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../../../Context/AuthContext';

export default function AdminLayout() {
    const navigate = useNavigate();
    const { logoutUser } = useAuth();

    const handleLogout = async () => {
        await logoutUser();
        navigate('/');
    };

    return (
        <div className="container-fluid min-vh-100 bg-light">
            <div className="row min-vh-100">

                <aside className="col-md-3 col-lg-2 bg-dark text-white p-4">
                    <h4 className="fw-bold mb-4">
                        <i className="fa-solid fa-book me-2"></i>
                        BookSales
                    </h4>

                    <p className="text-secondary small">ADMIN MENU</p>

                    <nav className="nav flex-column gap-2">
                        <Link to="/admin/books" className="nav-link text-white">
                            <i className="fa-solid fa-book-open me-2"></i>
                            Books
                        </Link>

                        <Link to="/admin/genres" className="nav-link text-white">
                            <i className="fa-solid fa-tags me-2"></i>
                            Genres
                        </Link>

                        <Link to="/admin/authors" className="nav-link text-white">
                            <i className="fa-solid fa-user-pen me-2"></i>
                            Authors
                        </Link>

                        <Link to="/admin/orders" className="nav-link text-white">
                            <i className="fa-solid fa-receipt me-2"></i>
                            Orders
                        </Link>

                        <Link to="/admin/users" className="nav-link text-white">
                            <i className="fa-solid fa-users me-2"></i>
                            Users
                        </Link>

                        <Link to="/admin/messages" className="nav-link text-white">
                            <i className="fa-solid fa-envelope me-2"></i>
                            Messages
                        </Link>

                        <hr className="border-secondary" />

                        <Link to="/" className="nav-link text-white">
                            <i className="fa-solid fa-house me-2"></i>
                            Back to Website
                        </Link>
                    </nav>
                </aside>

                <main className="col-md-9 col-lg-10 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="fw-bold mb-0">Admin Dashboard</h3>

                        <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-primary p-2">
                                Administrator
                            </span>

                            <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded shadow-sm p-4">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    );
}