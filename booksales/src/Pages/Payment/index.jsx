import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import HeaderContent from '../../components/shared/Header';
import FooterContent from '../../components/shared/Footer';
import {
    createPayment,
    getPayment,
    simulatePayment,
    syncPayment,
} from '../../_services/payments';

function getErrorMessage(error, fallback) {
    const errorData = error.response?.data;
    const firstValidationError = errorData?.errors
        ? Object.values(errorData.errors)[0]?.[0]
        : null;

    return firstValidationError || errorData?.message || fallback;
}

export default function Payment() {
    const { orderNumber } = useParams();
    const [searchParams] = useSearchParams();
    const transactionStatus = searchParams.get('transaction_status');

    const [order, setOrder] = useState(null);
    const [mode, setMode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchOrder = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const response = await getPayment(orderNumber);
            setOrder(response.data.data);
        } catch (error) {
            setError(
                getErrorMessage(error, 'Gagal mengambil data pembayaran.')
            );
        } finally {
            setLoading(false);
        }
    }, [orderNumber]);

    useEffect(() => {
        const loadPayment = async () => {
            if (transactionStatus) {
                try {
                    const response = await syncPayment(orderNumber);
                    setOrder(response.data.data);
                    setMessage('Status pembayaran berhasil disinkronkan.');
                    setLoading(false);
                    return;
                } catch (error) {
                    console.error(error);
                }
            }

            await fetchOrder();
        };

        loadPayment();
    }, [fetchOrder, orderNumber, transactionStatus]);

    const handlePay = async () => {
        setActionLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await createPayment(orderNumber);
            const data = response.data.data;

            setOrder(data);
            setMode(data.mode);

            if (data.mode === 'midtrans' && data.redirect_url) {
                window.location.assign(data.redirect_url);
                return;
            }

            if (data.mode === 'paid') {
                setMessage('Pesanan sudah dibayar.');
            } else {
                setMessage(
                    'Midtrans belum dikonfigurasi. Gunakan tombol simulasi pembayaran.'
                );
            }
        } catch (error) {
            setError(getErrorMessage(error, 'Gagal membuat pembayaran.'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleSimulate = async () => {
        setActionLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await simulatePayment(orderNumber);
            setOrder(response.data.data);
            setMode('paid');
            setMessage(
                response.data.message || 'Pembayaran simulasi berhasil.'
            );
        } catch (error) {
            setError(getErrorMessage(error, 'Pembayaran simulasi gagal.'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleSync = async () => {
        setActionLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await syncPayment(orderNumber);
            setOrder(response.data.data);
            setMessage('Status pembayaran berhasil diperbarui.');
        } catch (error) {
            setError(getErrorMessage(error, 'Gagal memperbarui status.'));
        } finally {
            setActionLoading(false);
        }
    };

    const paid = order?.payment_status === 'paid';
    const failed = order?.payment_status === 'failed';
    const canSync =
        mode === 'midtrans' || order?.payment_method === 'midtrans';

    return (
        <>
            <HeaderContent />

            <main className="container py-5 mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2 className="mb-1">Pembayaran</h2>
                                <p className="text-muted mb-0">
                                    Nomor pesanan: {orderNumber}
                                </p>
                            </div>

                            {order && (
                                <span
                                    className={`badge fs-6 ${
                                        paid
                                            ? 'bg-success'
                                            : failed
                                              ? 'bg-danger'
                                              : 'bg-warning text-dark'
                                    }`}
                                >
                                    {paid
                                        ? 'Lunas'
                                        : failed
                                          ? 'Gagal'
                                          : 'Menunggu Pembayaran'}
                                </span>
                            )}
                        </div>

                        {loading && (
                            <p className="text-muted">
                                Memuat data pembayaran...
                            </p>
                        )}

                        {error && (
                            <div className="alert alert-danger">{error}</div>
                        )}

                        {message && (
                            <div className="alert alert-info">{message}</div>
                        )}

                        {order && (
                            <>
                                {paid && (
                                    <div className="alert alert-success">
                                        Pembayaran berhasil. Terima kasih sudah
                                        berbelanja.
                                    </div>
                                )}

                                {failed && (
                                    <div className="alert alert-danger">
                                        Pembayaran gagal atau kedaluwarsa.
                                        Silakan coba bayar lagi.
                                    </div>
                                )}

                                <div className="card shadow-sm mb-4">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            Rincian Pesanan
                                        </h5>

                                        <div className="table-responsive">
                                            <table className="table align-middle mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>Buku</th>
                                                        <th>Qty</th>
                                                        <th>Subtotal</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {order.items.map((item) => (
                                                        <tr key={item.id}>
                                                            <td>{item.title}</td>
                                                            <td>{item.quantity}</td>
                                                            <td>
                                                                Rp
                                                                {Number(
                                                                    item.total_amount
                                                                ).toLocaleString(
                                                                    'id-ID'
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <hr />

                                        <div className="d-flex justify-content-between fw-bold fs-5">
                                            <span>Total</span>
                                            <span>
                                                Rp
                                                {Number(
                                                    order.total_amount
                                                ).toLocaleString('id-ID')}
                                            </span>
                                        </div>

                                        {order.payment_reference && (
                                            <p className="text-muted small mb-0 mt-3">
                                                Referensi pembayaran:{' '}
                                                {order.payment_reference}
                                            </p>
                                        )}

                                        {order.paid_at && (
                                            <p className="text-muted small mb-0">
                                                Dibayar pada:{' '}
                                                {new Date(
                                                    order.paid_at
                                                ).toLocaleString('id-ID')}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {!paid && (
                                    <div className="d-flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handlePay}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading
                                                ? 'Memproses...'
                                                : 'Bayar Sekarang'}
                                        </button>

                                        {mode === 'simulation' && (
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                onClick={handleSimulate}
                                                disabled={actionLoading}
                                            >
                                                Simulasikan Pembayaran
                                            </button>
                                        )}

                                        {canSync && (
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary"
                                                onClick={handleSync}
                                                disabled={actionLoading}
                                            >
                                                Sinkronkan Status
                                            </button>
                                        )}
                                    </div>
                                )}

                                <div className="mt-4">
                                    <Link
                                        to="/books"
                                        className="btn btn-outline-secondary"
                                    >
                                        Kembali ke Books
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <FooterContent />
        </>
    );
}
