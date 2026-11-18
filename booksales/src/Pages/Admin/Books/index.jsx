import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getBooks, deleteBook } from '../../../_services/books';

export default function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBooks = async () => {
        try {
            const response = await getBooks();
            setBooks(response.data.data);
        } catch {
            setError('Gagal mengambil data buku.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            'Yakin ingin menghapus buku ini?'
        );

        if (!confirmed) return;

        try {
            await deleteBook(id);

            setBooks((prevBooks) =>
                prevBooks.filter((book) => book.id !== id)
            );

            alert('Buku berhasil dihapus!');
        } catch (err) {
            alert(
                err.response?.data?.message || 'Gagal menghapus buku.'
            );
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold">Data Buku</h4>
                    <p className="text-muted mb-0">Daftar buku toko</p>
                </div>

                <Link to="/admin/books/create" className="btn btn-primary">
                    <i className="fa-solid fa-plus me-2"></i>
                    Tambah Buku
                </Link>
            </div>

            {loading && <p>Loading data...</p>}

            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th width="60">No</th>
                                <th>Judul</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th>Harga</th>
                                <th>Stok</th>
                                <th width="180">Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {books.length > 0 ? (
                                books.map((book, index) => (
                                    <tr key={book.id}>
                                        <td>{index + 1}</td>
                                        <td>{book.title}</td>
                                        <td>{book.author?.name || '-'}</td>
                                        <td>{book.genre?.name || '-'}</td>
                                        <td>
                                            Rp
                                            {Number(book.price).toLocaleString(
                                                'id-ID'
                                            )}
                                        </td>
                                        <td>{book.stock}</td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Link
                                                    to={`/admin/books/edit/${book.id}`}
                                                    className="btn btn-warning btn-sm"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(book.id)
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
                                    <td colSpan="7" className="text-center">
                                        Belum ada data buku.
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
