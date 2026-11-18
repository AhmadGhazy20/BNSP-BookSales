import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
    getGenreById,
    updateGenre,
} from '../../../_services/genres';

export default function EditGenre() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGenre = async () => {
            try {
                const response = await getGenreById(id);
                setName(response.data.data.name);
            } catch (err) {
                setError(
                    err.response?.data?.message || 'Gagal mengambil data genre.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchGenre();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            await updateGenre(id, { name });
            alert('Genre berhasil diperbarui!');
            navigate('/admin/genres');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Gagal memperbarui genre.'
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading data...</p>;

    return (
        <div>
            <div className="mb-4">
                <h4 className="fw-bold">Edit Genre</h4>
                <p className="text-muted">Ubah nama genre buku.</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nama Genre</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="d-flex gap-2">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                    >
                        {saving ? 'Menyimpan...' : 'Update Genre'}
                    </button>

                    <Link to="/admin/genres" className="btn btn-secondary">
                        Kembali
                    </Link>
                </div>
            </form>
        </div>
    );
}
