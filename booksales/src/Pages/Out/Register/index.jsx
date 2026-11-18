import { useState } from 'react';
import { Link } from 'react-router';
import { register } from '../../../_services/auth';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        setSuccess('');

        if (formData.password.length < 8) {
            setError('Password minimal 8 karakter.');
            return;
        }

        setLoading(true);

        try {
            const response = await register(formData);

            setSuccess(response.data.message);
            setFormData({
                name: '',
                username: '',
                email: '',
                password: '',
            });
        } catch (error) {
            const validationErrors = error.response?.data?.errors;
            const firstError = validationErrors
                ? Object.values(validationErrors)[0][0]
                : null;

            setError(
                firstError ||
                error.response?.data?.message ||
                'Registrasi gagal. Periksa koneksi API.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="modal modal-sheet position-static d-block p-4 py-md-5">
                <div className="modal-dialog">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0 d-flex justify-content-center">
                            <h1 className="fw-bold mb-0 fs-2">
                                Register
                            </h1>
                        </div>

                        <div className="modal-body p-5 pt-0">
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success">
                                    {success}. Silakan login.
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        name="name"
                                        placeholder="Nama lengkap"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label>Nama lengkap</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        name="username"
                                        placeholder="Username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label>Username</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input
                                        type="email"
                                        className="form-control rounded-3"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label>Email address</label>
                                </div>

                                <div className="form-floating mb-3">
                                    <input
                                        type="password"
                                        className="form-control rounded-3"
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        minLength={8}
                                        required
                                    />
                                    <label>Password (minimal 8 karakter)</label>
                                </div>

                                <button
                                    className="w-100 mb-2 btn btn-lg rounded-3 btn-primary"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? 'Loading...' : 'Register'}
                                </button>

                                <p className="text-center mt-3">
                                    Already have an account?{' '}
                                    <Link to="/login">Login</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
