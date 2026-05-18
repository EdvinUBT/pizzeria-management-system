import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPizzaSlice, FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        emri: '',
        mbiemri: '',
        email: '',
        password: '',
        phone_number: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(formData);
            navigate('/login');
        } catch (err) {
            if (err.response?.data?.gabimet) {
                setError(err.response.data.gabimet.join(', '));
            } else {
                setError(err.response?.data?.mesazhi || 'Gabim gjate regjistrimit!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow" style={{ width: '100%', maxWidth: '420px' }}>
                <div className="card-body p-4">
                    <div className="text-center mb-4">
                        <FaPizzaSlice size={50} className="text-danger mb-2" />
                        <h3 className="fw-bold">Piceria</h3>
                        <p className="text-muted">Krijo një llogari të re</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-6">
                                <label className="form-label">Emri</label>
                                <div className="input-group">
                                    <span className="input-group-text"><FaUser /></span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="emri"
                                        placeholder="Emri"
                                        value={formData.emri}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-6">
                                <label className="form-label">Mbiemri</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="mbiemri"
                                    placeholder="Mbiemri"
                                    value={formData.mbiemri}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <div className="input-group">
                                <span className="input-group-text"><FaEnvelope /></span>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="email@shembull.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Telefoni</label>
                            <div className="input-group">
                                <span className="input-group-text"><FaPhone /></span>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone_number"
                                    placeholder="044 123 456"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Fjalëkalimi</label>
                            <div className="input-group">
                                <span className="input-group-text"><FaLock /></span>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Minimum 6 karaktere"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-danger w-100 mb-3"
                            disabled={loading}
                        >
                            {loading ? 'Duke u regjistruar...' : 'Regjistrohu'}
                        </button>

                        <p className="text-center text-muted">
                            Ke llogari?{' '}
                            <Link to="/login" className="text-danger">
                                Kyçu këtu
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;