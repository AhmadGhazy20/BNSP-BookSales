import { useEffect, useState } from 'react';
import HeaderContent from '../../components/shared/Header';
import FooterContent from '../../components/shared/Footer';
import { useAuth } from '../../Context/AuthContext';
import { createMessage } from '../../_services/messages';

export default function Contact() {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setFormData((previousData) => ({
                ...previousData,
                name: previousData.name || user.name || '',
                email: previousData.email || user.email || '',
            }));
        }
    }, [user]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await createMessage(formData);

            setSuccess(response.data.message || 'Pesan berhasil dikirim.');
            setFormData((previousData) => ({
                ...previousData,
                subject: '',
                message: '',
            }));
        } catch (error) {
            const errorData = error.response?.data;
            const firstValidationError = errorData?.errors
                ? Object.values(errorData.errors)[0]?.[0]
                : null;

            setError(
                firstValidationError ||
                errorData?.message ||
                'Pesan gagal dikirim. Silakan coba lagi.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <HeaderContent />

            <div className="container my-5 py-5">
                <h2 className="text-center mb-4">Hubungi Kami</h2>

                <div className="row justify-content-center">
                    <div className="col-md-7">
                        <div className="card shadow-sm p-4">
                            {error && (
                                <div className="alert alert-danger">{error}</div>
                            )}

                            {success && (
                                <div className="alert alert-success">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        placeholder="Masukkan nama Anda"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Alamat Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="nama@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Subjek
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        className="form-control"
                                        placeholder="Subjek pesan (opsional)"
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Pesan
                                    </label>
                                    <textarea
                                        name="message"
                                        className="form-control"
                                        rows="4"
                                        placeholder="Tulis pesan Anda di sini..."
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Mengirim...' : 'Kirim Pesan'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <FooterContent />
        </>
    );
}
