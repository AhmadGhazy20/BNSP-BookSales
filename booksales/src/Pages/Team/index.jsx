import HeaderContent from '../../components/shared/Header';
import FooterContent from '../../components/shared/Footer';

export default function Team() {
    const teamMembers = [
        {
            name: 'Ahmad Ghazy',
            role: 'Frontend Developer',
            photo: 'https://randomuser.me/api/portraits/men/32.jpg',
            alt: 'Foto Ahmad Ghazy',
        },
        {
            name: 'Siti Aminah',
            role: 'UI/UX Designer',
            photo: 'https://randomuser.me/api/portraits/women/44.jpg',
            alt: 'Foto Siti Aminah',
        },
        {
            name: 'Budi Santoso',
            role: 'Project Manager',
            photo: 'https://randomuser.me/api/portraits/men/75.jpg',
            alt: 'Foto Budi Santoso',
        },
    ];

    return (
        <>
            <HeaderContent />

            <div className="container my-5 py-5">
                <h2 className="text-center mb-5">Tim Kami</h2>

                <div className="row text-center">
                    {teamMembers.map((member, index) => (
                        <div className="col-md-4 mb-4" key={index}>
                            <img
                                src={member.photo}
                                className="rounded-circle mb-3 shadow"
                                alt={member.alt}
                                width="150"
                                height="150"
                                style={{ objectFit: 'cover' }}
                            />

                            <h4>{member.name}</h4>
                            <p className="text-muted">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>

            <FooterContent />
        </>
    );
}
