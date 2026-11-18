import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { createGenre } from '../../../_services/genres';

export default function CreateGenre() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await createGenre({ name });
            alert('Genre berhasil ditambahkan!');
            navigate('/admin/genres');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Gagal menambahkan genre.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-4">
                <h4 className="fw-bold">Tambah Genre</h4>
                <p className="text-muted">Masukkan nama genre buku baru.</p>
            </div>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nama Genre</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Contoh: Fantasy"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="d-flex gap-2">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Genre'}
                    </button>

                    <Link to="/admin/genres" className="btn btn-secondary">
                        Kembali
                    </Link>
                </div>
            </form>
        </div>
    );
}