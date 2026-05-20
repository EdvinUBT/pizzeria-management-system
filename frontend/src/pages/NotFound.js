import { Link } from 'react-router-dom';
import { FaPizzaSlice, FaHome } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="text-center">
                <FaPizzaSlice size={80} className="text-danger mb-4" />
                <h1 className="display-1 fw-bold text-danger">404</h1>
                <h3 className="mb-3">Faqja nuk u gjet!</h3>
                <p className="text-muted mb-4">Duket sikur kjo faqe u "dogj ne furre" 🍕</p>
                <Link to="/dashboard" className="btn btn-danger btn-lg">
                    <FaHome className="me-2" />
                    Kthehu ne Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;