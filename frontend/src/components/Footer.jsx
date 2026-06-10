import { FaPizzaSlice, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: '#1a1a2e', color: '#ffffff', padding: '40px 0 20px', marginTop: '50px' }}>
            <div className="container">
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <h5><FaPizzaSlice className="me-2 text-danger" />Piceria</h5>
                        <p style={{ color: '#b0b0b0' }}>Sistem per menaxhimin e picerise. Pizza me e mire ne qytet!</p>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h5>Kontakti</h5>
                        <p className="mb-1" style={{ color: '#b0b0b0' }}><FaPhone className="me-2 text-danger" />+383 44 123 456</p>
                        <p className="mb-1" style={{ color: '#b0b0b0' }}><FaEnvelope className="me-2 text-danger" />info@piceria.com</p>
                        <p className="mb-1" style={{ color: '#b0b0b0' }}><FaMapMarkerAlt className="me-2 text-danger" />Prishtine, Kosove</p>
                    </div>
                    <div className="col-md-4 mb-3">
                        <h5>Orari</h5>
                        <p className="mb-1" style={{ color: '#b0b0b0' }}>E Hene - E Premte: 10:00 - 23:00</p>
                        <p className="mb-1" style={{ color: '#b0b0b0' }}>E Shtune: 11:00 - 24:00</p>
                        <p className="mb-1" style={{ color: '#b0b0b0' }}>E Diele: 12:00 - 22:00</p>
                    </div>
                </div>
                <hr style={{ borderColor: '#444' }} />
                <p className="text-center mb-0" style={{ color: '#888' }}>
                    &copy; 2026 Piceria - Te gjitha te drejtat e rezervuara | Lab Kurs 1 - UBT
                </p>
            </div>
        </footer>
    );
};

export default Footer;