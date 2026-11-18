import { useEffect, useState } from 'react';
import { getUsers } from '../../../_services/users';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            setUsers(response.data.data);
        } catch {
            setError('Gagal mengambil data user.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold">Data User</h4>
                    <p className="text-muted mb-0">
                        Daftar user yang sudah terdaftar
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={fetchUsers}
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
                                <th>Nama</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Pesanan</th>
                                <th>Terdaftar</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span
                                                className={`badge ${
                                                    user.role === 'admin'
                                                        ? 'bg-primary'
                                                        : 'bg-secondary'
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{user.transactions_count}</td>
                                        <td>
                                            {new Date(
                                                user.created_at
                                            ).toLocaleDateString('id-ID')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        Belum ada user terdaftar.
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
