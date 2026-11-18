import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { getBooks } from '../../../_services/books';
import { getGenres } from '../../../_services/genres';
import { getBookCover } from '../../../_services/bookCovers';
import { useAuth } from '../../../Context/AuthContext';
import { useCart } from '../../../Context/CartContext';

function ProductListContent({ showFilters = false }) {
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [books, setBooks] = useState([]);
    const [covers, setCovers] = useState({});
    const [genres, setGenres] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genreId, setGenreId] = useState('');
    const [addedBookId, setAddedBookId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchBooks = useCallback(async (params = {}) => {
        setLoading(true);
        setError('');

        try {
            const response = await getBooks(params);
            const bookData = response.data.data || [];

            setBooks(bookData);

            const coverEntries = await Promise.all(
                bookData.map(async (book) => [
                    book.id,
                    await getBookCover(book),
                ])
            );

            setCovers(Object.fromEntries(coverEntries));
        } catch (error) {
            setError('Gagal mengambil data buku.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchGenres = useCallback(async () => {
        try {
            const response = await getGenres();
            setGenres(response.data.data || []);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        fetchBooks();

        if (showFilters) {
            fetchGenres();
        }
    }, [fetchBooks, fetchGenres, showFilters]);

    const handleSearch = (event) => {
        event.preventDefault();

        fetchBooks({
            search: searchTerm || undefined,
            genre_id: genreId || undefined,
        });
    };

    const handleReset = () => {
        setSearchTerm('');
        setGenreId('');
        fetchBooks();
    };

    const handleAddToCart = (book) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return;
        }

        const added = addToCart(book, 1);

        if (added) {
            setAddedBookId(book.id);
            setTimeout(() => setAddedBookId(null), 1500);
        }
    };

    return (
        <main>
            <div className="album py-5 bg-light mt-5">
                <div className="container">
                    <h2 className="text-center mb-4">
                        {showFilters ? 'Daftar Buku' : 'Rekomendasi Buku'}
                    </h2>

                    {showFilters && (
                        <form
                            className="row g-2 justify-content-center mb-4"
                            onSubmit={handleSearch}
                        >
                            <div className="col-md-5">
                                <input
                                    type="search"
                                    className="form-control"
                                    placeholder="Cari judul, penulis, atau genre..."
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                />
                            </div>

                            <div className="col-md-3">
                                <select
                                    className="form-select"
                                    value={genreId}
                                    onChange={(event) =>
                                        setGenreId(event.target.value)
                                    }
                                >
                                    <option value="">Semua Genre</option>
                                    {genres.map((genre) => (
                                        <option key={genre.id} value={genre.id}>
                                            {genre.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-auto">
                                <button type="submit" className="btn btn-primary">
                                    Cari
                                </button>
                            </div>

                            <div className="col-auto">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={handleReset}
                                >
                                    Reset
                                </button>
                            </div>
                        </form>
                    )}

                    {loading && (
                        <p className="text-center">Memuat data buku...</p>
                    )}

                    {error && (
                        <div className="alert alert-danger">{error}</div>
                    )}

                    {!loading && !error && books.length === 0 && (
                        <div className="alert alert-info text-center">
                            Buku tidak ditemukan.
                        </div>
                    )}

                    {!loading && !error && books.length > 0 && (
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                            {books.map((book) => (
                                <div className="col" key={book.id}>
                                    <div className="card shadow-sm h-100">
                                        {covers[book.id] ? (
                                            <img
                                                src={covers[book.id]}
                                                alt={`Cover ${book.title}`}
                                                className="card-img-top"
                                                style={{
                                                    height: '280px',
                                                    objectFit: 'contain',
                                                    padding: '12px',
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="d-flex align-items-center justify-content-center bg-white"
                                                style={{ height: '280px' }}
                                            >
                                                <span className="text-muted">
                                                    Cover tidak tersedia
                                                </span>
                                            </div>
                                        )}

                                        <div className="card-body">
                                            {book.genre?.name && (
                                                <span className="badge bg-secondary mb-2">
                                                    {book.genre.name}
                                                </span>
                                            )}

                                            <h5 className="card-title">
                                                {book.title}
                                            </h5>

                                            <p className="card-text">
                                                {book.description}
                                            </p>

                                            <p className="text-muted">
                                                Penulis: {book.author?.name || 'Belum tersedia'}
                                            </p>

                                            <p className="fw-bold">
                                                Rp{Number(book.price).toLocaleString('id-ID')}
                                            </p>

                                            <p>
                                                Stok: {book.stock}
                                            </p>

                                            <div className="d-flex flex-wrap gap-2">
                                                <Link
                                                    to={`/books/${book.id}`}
                                                    className="btn btn-sm btn-outline-primary"
                                                >
                                                    Lihat Detail
                                                </Link>

                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleAddToCart(book)}
                                                    disabled={
                                                        book.stock < 1 ||
                                                        addedBookId === book.id
                                                    }
                                                >
                                                    {addedBookId === book.id
                                                        ? 'Ditambahkan'
                                                        : 'Tambah'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default ProductListContent;
