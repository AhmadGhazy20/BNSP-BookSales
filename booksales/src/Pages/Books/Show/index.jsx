import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { getBookById } from '../../../_services/books';
import { getBookCover } from '../../../_services/bookCovers';
import { createTransaction } from '../../../_services/transactions';
import { useCart } from '../../../Context/CartContext';

export default function ShowBook() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [book, setBook] = useState(null);
    const [cover, setCover] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);
    const [error, setError] = useState('');

    const fetchBook = useCallback(async () => {
        try {
            const response = await getBookById(id);
            const bookData = response.data.data;

            setBook(bookData);

            const image = await getBookCover(bookData);
            setCover(image);
        } catch (error) {
            setError('Gagal mengambil detail buku.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchBook();
    }, [fetchBook]);

    const handleAddToCart = () => {
        if (quantity < 1 || quantity > book.stock) {
            alert('Jumlah melebihi stok yang tersedia.');
            return;
        }

        const added = addToCart(book, Number(quantity));

        if (added) {
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 1500);
        }
    };

    const handleBuy = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');

        if (!token) {
            navigate('/login');
            return;
        }

        if (quantity < 1 || quantity > book.stock) {
            alert('Jumlah pembelian melebihi stok yang tersedia.');
            return;
        }

        setBuying(true);

        try {
            const response = await createTransaction(book.id, Number(quantity));
            const orderNumber = response.data.data?.order_number;

            if (!orderNumber) {
                throw new Error('Nomor pesanan tidak ditemukan.');
            }

            navigate(`/payment/${orderNumber}`);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                'Pembelian gagal. Silakan coba lagi.'
            );
        } finally {
            setBuying(false);
        }
    };

    if (loading) {
        return <p className="text-center mt-5">Memuat detail buku...</p>;
    }

    if (error || !book) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger">
                    {error || 'Buku tidak ditemukan.'}
                </div>
                <Link to="/books" className="btn btn-secondary">
                    Kembali ke Buku
                </Link>
            </div>
        );
    }

    return (
        <main className="container py-5 mt-5">
            <div className="card shadow">
                <div className="card-body p-4">
                    <div className="row g-4 align-items-start">
                        <div className="col-md-4 text-center">
                            {cover ? (
                                <img
                                    src={cover}
                                    alt={`Cover ${book.title}`}
                                    className="img-fluid rounded"
                                    style={{
                                        maxHeight: '420px',
                                        objectFit: 'contain',
                                    }}
                                />
                            ) : (
                                <div
                                    className="d-flex align-items-center justify-content-center bg-light rounded"
                                    style={{ height: '300px' }}
                                >
                                    <span className="text-muted">
                                        Cover tidak tersedia
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="col-md-8">
                            <h2 className="mb-3">{book.title}</h2>

                            <p>{book.description}</p>

                            <p>
                                <strong>Penulis:</strong>{' '}
                                {book.author?.name || 'Belum tersedia'}
                            </p>

                            <p>
                                <strong>Genre:</strong>{' '}
                                {book.genre?.name || 'Belum tersedia'}
                            </p>

                            <p>
                                <strong>Harga:</strong>{' '}
                                Rp{Number(book.price).toLocaleString('id-ID')}
                            </p>

                            <p>
                                <strong>Stok:</strong> {book.stock}
                            </p>

                            <hr />

                            <form onSubmit={handleBuy}>
                                <div className="mb-3">
                                    <label className="form-label">
                                        Jumlah Pembelian
                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        max={book.stock}
                                        value={quantity}
                                        onChange={(event) =>
                                            setQuantity(Number(event.target.value))
                                        }
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary me-2"
                                    disabled={buying || book.stock < 1}
                                >
                                    {buying ? 'Memproses...' : 'Beli'}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-outline-primary me-2"
                                    onClick={handleAddToCart}
                                    disabled={
                                        book.stock < 1 || addedToCart
                                    }
                                >
                                    {addedToCart
                                        ? 'Ditambahkan'
                                        : 'Tambah ke Keranjang'}
                                </button>

                                <Link to="/books" className="btn btn-secondary">
                                    Kembali
                                </Link>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
