import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { login } from '../../../_services/auth';
import { useAuth } from '../../../Context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginUser } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await login(formData);
            const result = response.data;

            if (!result.user || !result.token) {
                setError('Data login tidak valid.');
                return;
            }

            if (
                result.user.role !== 'admin' &&
                result.user.role !== 'customer'
            ) {
                setError('Role akun tidak dikenali.');
                return;
            }

            loginUser(result.user, result.token);

            if (result.user.role === 'admin') {
                navigate('/admin/books');
            } else {
                navigate(location.state?.from?.pathname || '/books');
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Login gagal. Periksa email dan password.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Login</h2>

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Login'}
                                </button>
                            </form>

                            <p className="text-center mt-3">
                                Don't have an account?{' '}
                                <Link to="/register">Register</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
