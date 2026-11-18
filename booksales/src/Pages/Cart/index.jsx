import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import HeaderContent from '../../components/shared/Header';
import FooterContent from '../../components/shared/Footer';
import { useAuth } from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';
import { checkout } from '../../_services/transactions';

export default function Cart() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const {
        items,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
    } = useCart();

    const [checkingOut, setCheckingOut] = useState(false);
    const [error, setError] = useState('');
    const [order, setOrder] = useState(null);

    const handleCheckout = async () => {
        setError('');

        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/cart' } } });
            return;
        }

        setCheckingOut(true);

        try {
            const response = await checkout(
                items.map((item) => ({
                    book_id: item.id,
                    quantity: item.quantity,
                }))
            );

            setOrder(response.data.data);
            clearCart();
        } catch (error) {
            const errorData = error.response?.data;
            const firstValidationError = errorData?.errors
                ? Object.values(errorData.errors)[0]?.[0]
                : null;

            setError(
                firstValidationError ||
                errorData?.message ||
                'Checkout gagal. Silakan coba lagi.'
            );
        } finally {
            setCheckingOut(false);
        }
    };

    return (
        <>
            <HeaderContent />

            <main className="container py-5 mt-5">
                <h2 className="mb-4">Keranjang Belanja</h2>

                {order && (
                    <div className="alert alert-success">
                        <h5 className="alert-heading">Pesanan berhasil dibuat</h5>
                        <p className="mb-1">
                            Nomor pesanan: <strong>{order.order_number}</strong>
                        </p>
                        <p className="mb-0">
                            Total: Rp
                            {Number(order.total_amount).toLocaleString('id-ID')}
                        </p>
                        <div className="d-flex flex-wrap gap-2 mt-3">
                            <Link
                                to={`/payment/${order.order_number}`}
                                className="btn btn-success"
                            >
                                Bayar Sekarang
                            </Link>

                            <Link
                                to="/books"
                                className="btn btn-outline-secondary"
                            >
                                Lanjut Belanja
                            </Link>
                        </div>
                    </div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}

                {items.length === 0 && !order && (
                    <div className="text-center py-5">
                        <p className="text-muted">
                            Keranjang masih kosong.
                        </p>
                        <Link to="/books" className="btn btn-primary">
                            Lihat Buku
                        </Link>
                    </div>
                )}

                {items.length > 0 && (
                    <div className="row g-4">
                        <div className="col-lg-8">
                            <div className="table-responsive">
                                <table className="table align-middle">
                                    <thead>
                                        <tr>
                                            <th>Buku</th>
                                            <th>Harga</th>
                                            <th>Jumlah</th>
                                            <th>Subtotal</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {items.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <strong>{item.title}</strong>
                                                    <div className="text-muted small">
                                                        {item.author}
                                                    </div>
                                                    <div className="text-muted small">
                                                        Stok: {item.stock}
                                                    </div>
                                                </td>

                                                <td>
                                                    Rp
                                                    {Number(item.price).toLocaleString('id-ID')}
                                                </td>

                                                <td style={{ minWidth: '110px' }}>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        min="1"
                                                        max={item.stock}
                                                        value={item.quantity}
                                                        onChange={(event) =>
                                                            updateQuantity(
                                                                item.id,
                                                                event.target.value
                                                            )
                                                        }
                                                    />
                                                </td>

                                                <td>
                                                    Rp
                                                    {(
                                                        Number(item.price) *
                                                        Number(item.quantity)
                                                    ).toLocaleString('id-ID')}
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            removeFromCart(item.id)
                                                        }
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">Ringkasan</h5>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Total Item</span>
                                        <span>
                                            {items.reduce(
                                                (total, item) =>
                                                    total + Number(item.quantity),
                                                0
                                            )}
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                                        <span>Total</span>
                                        <span>
                                            Rp
                                            {Number(totalPrice).toLocaleString('id-ID')}
                                        </span>
                                    </div>

                                    {!isAuthenticated && (
                                        <p className="text-muted small">
                                            Silakan login terlebih dahulu untuk
                                            melakukan checkout.
                                        </p>
                                    )}

                                    <button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        onClick={handleCheckout}
                                        disabled={checkingOut}
                                    >
                                        {checkingOut
                                            ? 'Memproses...'
                                            : 'Checkout'}
                                    </button>

                                    <Link
                                        to="/books"
                                        className="btn btn-outline-secondary w-100 mt-2"
                                    >
                                        Lanjut Belanja
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <FooterContent />
        </>
    );
}
