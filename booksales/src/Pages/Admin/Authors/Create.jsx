import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { createAuthor } from '../../../_services/authors';

export default function CreateAuthor() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        photo: '',
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
            await createAuthor(formData);
            alert('Author berhasil ditambahkan!');
            navigate('/admin/authors');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Gagal menambahkan author.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h4 className="fw-bold">Tambah Author</h4>
            <p className="text-muted">Masukkan data penulis buku.</p>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nama Author</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Nama penulis"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                        name="bio"
                        className="form-control"
                        rows="3"
                        placeholder="Biografi penulis"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Photo URL</label>
                    <input
                        type="text"
                        name="photo"
                        className="form-control"
                        placeholder="https://example.com/photo.jpg"
                        value={formData.photo}
                        onChange={handleChange}
                    />
                </div>

                <div className="d-flex gap-2">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Author'}
                    </button>

                    <Link to="/admin/authors" className="btn btn-secondary">
                        Kembali
                    </Link>
                </div>
            </form>
        </div>
    );
}