import { useEffect, useState } from 'react';
import { getTransactions } from '../../../_services/transactions';

export default function Orders() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const paymentLabel = (status) => {
        if (status === 'paid') {
            return 'Lunas';
        }

        if (status === 'failed') {
            return 'Gagal';
        }

        return 'Pending';
    };

    const paymentClass = (status) => {
        if (status === 'paid') {
            return 'bg-success';
        }

        if (status === 'failed') {
            return 'bg-danger';
        }

        return 'bg-warning text-dark';
    };

    const fetchTransactions = async () => {
        try {
            const response = await getTransactions();
            setTransactions(response.data.data);
        } catch {
            setError('Gagal mengambil data pesanan.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold">Data Pesanan</h4>
                    <p className="text-muted mb-0">
                        Daftar pesanan buku dari seluruh user
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={fetchTransactions}
                >
                    <i className="fa-solid fa-rotate me-2"></i>
                    Muat Ulang
                </button>
            </div>

            {loading && <p>Loading data...</p>}

            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th width="60">No</th>
                                <th>No. Order</th>
                                <th>User</th>
                                <th>Buku</th>
                                <th>Qty</th>
                                <th>Total</th>
                                <th>Status Bayar</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.length > 0 ? (
                                transactions.map((transaction, index) => (
                                    <tr key={transaction.id}>
                                        <td>{index + 1}</td>
                                        <td>{transaction.order_number}</td>
                                        <td>
                                            <div>
                                                {transaction.user?.name || '-'}
                                            </div>
                                            <small className="text-muted">
                                                {transaction.user?.email || ''}
                                            </small>
                                        </td>
                                        <td>{transaction.book?.title || '-'}</td>
                                        <td>{transaction.quantity}</td>
                                        <td>
                                            Rp
                                            {Number(
                                                transaction.total_amount
                                            ).toLocaleString('id-ID')}
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${paymentClass(
                                                    transaction.payment_status
                                                )}`}
                                            >
                                                {paymentLabel(
                                                    transaction.payment_status
                                                )}
                                            </span>
                                            {transaction.payment_method && (
                                                <div className="text-muted small">
                                                    {transaction.payment_method}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {new Date(
                                                transaction.created_at
                                            ).toLocaleString('id-ID')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        Belum ada pesanan.
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
