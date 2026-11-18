import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
    getAuthors,
    deleteAuthor,
} from '../../../_services/authors';

export default function Authors() {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAuthors = async () => {
        try {
            const response = await getAuthors();
            setAuthors(response.data.data);
        } catch {
            setError('Gagal mengambil data author.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Yakin ingin menghapus author ini?'
        );

        if (!confirmed) return;

        try {
            await deleteAuthor(id);

            setAuthors((prevAuthors) =>
                prevAuthors.filter((author) => author.id !== id)
            );

            alert('Author berhasil dihapus!');
        } catch (err) {
            alert(
                err.response?.data?.message || 'Gagal menghapus author.'
            );
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold">Data Author</h4>
                    <p className="text-muted mb-0">Daftar penulis buku</p>
                </div>

                <Link to="/admin/authors/create" className="btn btn-primary">
                    <i className="fa-solid fa-plus me-2"></i>
                    Tambah Author
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
                                <th>Nama Author</th>
                                <th>Bio</th>
                                <th width="180">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {authors.length > 0 ? (
                                authors.map((author, index) => (
                                    <tr key={author.id}>
                                        <td>{index + 1}</td>
                                        <td>{author.name}</td>
                                        <td>{author.bio || '-'}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Link
                                                    to={`/admin/authors/edit/${author.id}`}
                                                    className="btn btn-warning btn-sm"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(author.id)
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
                                    <td colSpan="4" className="text-center">
                                        Belum ada data author.
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
