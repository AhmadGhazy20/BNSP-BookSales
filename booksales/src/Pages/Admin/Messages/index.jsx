import { useCallback, useEffect, useState } from 'react';
import {
    deleteMessage,
    getMessages,
    markMessageAsRead,
} from '../../../_services/messages';

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const response = await getMessages();
            setMessages(response.data.data || []);
        } catch (error) {
            setError('Gagal mengambil data pesan.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleMarkAsRead = async (id) => {
        try {
            await markMessageAsRead(id);
            setMessages((previousMessages) =>
                previousMessages.map((message) =>
                    message.id === id
                        ? { ...message, is_read: true }
                        : message
                )
            );
        } catch (error) {
            setError('Gagal menandai pesan sebagai sudah dibaca.');
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Hapus pesan ini?')) {
            return;
        }

        try {
            await deleteMessage(id);
            setMessages((previousMessages) =>
                previousMessages.filter((message) => message.id !== id)
            );
        } catch (error) {
            setError('Gagal menghapus pesan.');
            console.error(error);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-1">Pesan Masuk</h4>
                    <p className="text-muted mb-0">
                        Daftar pesan dari pengunjung dan customer.
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={fetchMessages}
                    disabled={loading}
                >
                    Muat Ulang
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
                <p className="text-muted">Memuat pesan...</p>
            ) : messages.length === 0 ? (
                <div className="alert alert-info">
                    Belum ada pesan masuk.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Pengirim</th>
                                <th>Subjek</th>
                                <th>Pesan</th>
                                <th>Tanggal</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {messages.map((message) => (
                                <tr key={message.id}>
                                    <td>
                                        <strong>{message.name}</strong>
                                        <div className="text-muted small">
                                            {message.email}
                                        </div>
                                    </td>

                                    <td>
                                        {message.subject || '-'}
                                    </td>

                                    <td style={{ maxWidth: '320px' }}>
                                        <div
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                            }}
                                        >
                                            {message.message}
                                        </div>
                                    </td>

                                    <td className="text-nowrap">
                                        {new Date(
                                            message.created_at
                                        ).toLocaleString('id-ID')}
                                    </td>

                                    <td>
                                        <span
                                            className={`badge ${
                                                message.is_read
                                                    ? 'bg-success'
                                                    : 'bg-warning text-dark'
                                            }`}
                                        >
                                            {message.is_read
                                                ? 'Sudah dibaca'
                                                : 'Belum dibaca'}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="d-flex gap-2">
                                            {!message.is_read && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-success"
                                                    onClick={() =>
                                                        handleMarkAsRead(
                                                            message.id
                                                        )
                                                    }
                                                >
                                                    Tandai Dibaca
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() =>
                                                    handleDelete(message.id)
                                                }
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
