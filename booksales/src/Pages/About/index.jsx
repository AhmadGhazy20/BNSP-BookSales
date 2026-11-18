import HeaderContent from '../../components/shared/Header';
import FooterContent from '../../components/shared/Footer';

export default function About() {
    const values = [
        {
            icon: 'fa-book-open',
            title: 'Koleksi Berkualitas',
            description:
                'Kami memilih buku dari penulis dan penerbit terpercaya untuk menemani perjalanan membaca Anda.',
        },
        {
            icon: 'fa-truck-fast',
            title: 'Mudah dan Cepat',
            description:
                'Cari buku, masukkan ke keranjang, dan selesaikan pesanan dalam beberapa langkah sederhana.',
        },
        {
            icon: 'fa-handshake',
            title: 'Layanan Ramah',
            description:
                'Tim kami siap membantu melalui halaman kontak jika Anda membutuhkan rekomendasi atau bantuan.',
        },
    ];

    return (
        <>
            <HeaderContent />

            <main className="container py-5 mt-5">
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 text-center">
                        <h2 className="mb-4">Tentang Kami</h2>
                        <p className="lead">
                            BookSales adalah toko buku online yang menghadirkan
                            koleksi pilihan untuk pembaca di seluruh Indonesia.
                        </p>
                        <p className="text-muted">
                            Kami percaya bahwa buku adalah jendela dunia. Karena
                            itu, kami berkomitmen menyediakan pengalaman
                            berbelanja buku yang mudah, nyaman, dan terpercaya
                            bagi setiap pembaca.
                        </p>
                    </div>
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-md-6">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body p-4">
                                <h4 className="mb-3">Visi</h4>
                                <p className="mb-0">
                                    Menjadi toko buku online pilihan utama yang
                                    mendorong budaya membaca dan literasi di
                                    Indonesia.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card h-100 shadow-sm">
                            <div className="card-body p-4">
                                <h4 className="mb-3">Misi</h4>
                                <p className="mb-0">
                                    Menyediakan buku berkualitas dengan harga
                                    yang wajar, layanan yang ramah, dan proses
                                    pemesanan yang cepat serta mudah.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 className="text-center mb-4">Mengapa Memilih Kami?</h3>

                <div className="row g-4">
                    {values.map((value) => (
                        <div className="col-md-4" key={value.title}>
                            <div className="card h-100 shadow-sm text-center">
                                <div className="card-body p-4">
                                    <i
                                        className={`fa-solid ${value.icon} fs-1 text-primary mb-3`}
                                    ></i>
                                    <h5>{value.title}</h5>
                                    <p className="text-muted mb-0">
                                        {value.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <FooterContent />
        </>
    );
}
