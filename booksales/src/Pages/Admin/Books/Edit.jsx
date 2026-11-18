import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { getBookById, updateBook } from '../../../_services/books';
import { getAuthors } from '../../../_services/authors';
import { getGenres } from '../../../_services/genres';

export default function EditBook() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        stock: '',
        cover: '',
        author_id: '',
        genre_id: '',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookResponse, authorsResponse, genresResponse] =
                    await Promise.all([
                        getBookById(id),
                        getAuthors(),
                        getGenres(),
                    ]);

                const book = bookResponse.data.data;

                setFormData({
                    title: book.title || '',
                    description: book.description || '',
                    price: book.price || '',
                    stock: book.stock ?? '',
                    cover: book.cover || '',
                    author_id: book.author_id || '',
                    genre_id: book.genre_id || '',
                });

                setAuthors(authorsResponse.data.data);
                setGenres(genresResponse.data.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Gagal mengambil data buku.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            await updateBook(id, {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                author_id: formData.author_id || null,
                genre_id: formData.genre_id || null,
            });

            alert('Buku berhasil diperbarui!');
            navigate('/admin/books');
        } catch (err) {
            const validationErrors = err.response?.data?.errors;
            const firstError = validationErrors
                ? Object.values(validationErrors)[0][0]
                : null;

            setError(
                firstError ||
                err.response?.data?.message ||
                'Gagal memperbarui buku.'
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading data...</p>;

    return (
        <div>
            <div className="mb-4">
                <h4 className="fw-bold">Edit Buku</h4>
                <p className="text-muted">Ubah data buku.</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Judul Buku</label>
                    <input
                        type="text"
                        name="title"
                        className="form-control"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Deskripsi</label>
                    <textarea
                        name="description"
                        className="form-control"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Harga</label>
                        <input
                            type="number"
                            name="price"
                            className="form-control"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Stok</label>
                        <input
                            type="number"
                            name="stock"
                            className="form-control"
                            min="0"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Author</label>
                        <select
                            name="author_id"
                            className="form-select"
                            value={formData.author_id}
                            onChange={handleChange}
                        >
                            <option value="">Pilih Author</option>
                            {authors.map((author) => (
                                <option key={author.id} value={author.id}>
                                    {author.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label className="form-label">Genre</label>
                        <select
                            name="genre_id"
                            className="form-select"
                            value={formData.genre_id}
                            onChange={handleChange}
                        >
                            <option value="">Pilih Genre</option>
                            {genres.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Cover URL</label>
                    <input
                        type="text"
                        name="cover"
                        className="form-control"
                        value={formData.cover}
                        onChange={handleChange}
                    />
                </div>

                <div className="d-flex gap-2">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving}
                    >
                        {saving ? 'Menyimpan...' : 'Update Buku'}
                    </button>

                    <Link to="/admin/books" className="btn btn-secondary">
                        Kembali
                    </Link>
                </div>
            </form>
        </div>
    );
}
