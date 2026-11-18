import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
    getGenres,
    deleteGenre,
} from '../../../_services/genres';

export default function Genres() {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchGenres = async () => {
        try {
            const response = await getGenres();
            setGenres(response.data.data);
        } catch {
            setError('Gagal mengambil data genre.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Yakin ingin menghapus genre ini?'
        );

        if (!confirmed) return;

        try {
            await deleteGenre(id);

            setGenres((prevGenres) =>
                prevGenres.filter((genre) => genre.id !== id)
            );

            alert('Genre berhasil dihapus!');
        } catch (err) {
            alert(
                err.response?.data?.message || 'Gagal menghapus genre.'
            );
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold">Data Genre</h4>
                    <p className="text-muted mb-0">Daftar genre buku</p>
                </div>

                <Link to="/admin/genres/create" className="btn btn-primary">
                    <i className="fa-solid fa-plus me-2"></i>
                    Tambah Genre
                </Link>
            </div>

            {loading && <p>Loading data...</p>}

            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-light">
                            <tr>
                                <th width="80">No</th>
                                <th>Nama Genre</th>
                                <th width="180">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {genres.length > 0 ? (
                                genres.map((genre, index) => (
                                    <tr key={genre.id}>
                                        <td>{index + 1}</td>
                                        <td>{genre.name}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Link
                                                    to={`/admin/genres/edit/${genre.id}`}
                                                    className="btn btn-warning btn-sm"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(genre.id)
                                                    }
                                                    className="btn btn-danger btn-sm"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">
                                        Belum ada data genre.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
