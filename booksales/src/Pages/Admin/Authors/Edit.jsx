import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
    getAuthorById,
    updateAuthor,
} from '../../../_services/authors';

export default function EditAuthor() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        photo: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                const response = await getAuthorById(id);
                const author = response.data.data;

                setFormData({
                    name: author.name || '',
                    bio: author.bio || '',
                    photo: author.photo || '',
                });
            } catch (err) {
                setError(
                    err.response?.data?.message || 'Gagal mengambil data author.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAuthor();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            await updateAuthor(id, formData);
            alert('Author berhasil diperbarui!');
            navigate('/admin/authors');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Gagal memperbarui author.'
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading data...</p>;

    return (
        <div>
            <h4 className="fw-bold">Edit Author</h4>
            <p className="text-muted">Ubah data penulis buku.</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nama Author</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
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
                        value={formData.photo}
                        onChange={handleChange}
                    />
                </div>

                <div className="d-flex gap-2">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                    >
                        {saving ? 'Menyimpan...' : 'Update Author'}
                    </button>

                    <Link to="/admin/authors" className="btn btn-secondary">
                        Kembali
                    </Link>
                </div>
            </form>
        </div>
    );
}
