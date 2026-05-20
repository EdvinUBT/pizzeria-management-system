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
        <div className="vh-100 d-flex align-items-center justify-content-center" style={{
            background: 'linear-gradient(135deg, #f0f2f5 0%, #e8ecef 50%, #dfe4ea 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Dekorime vizatuara */}
            <div style={{ position: 'absolute', top: '-50px', left: '-50px', opacity: 0.1 }}>
                <FaPizzaSlice size={200} color="#2d3436" style={{ transform: 'rotate(-15deg)' }} />
            </div>
            <div style={{ position: 'absolute', bottom: '-30px', right: '-30px', opacity: 0.1 }}>
                <FaPizzaSlice size={180} color="#2d3436" style={{ transform: 'rotate(30deg)' }} />
            </div>
            <div style={{ position: 'absolute', top: '20%', right: '10%', opacity: 0.06 }}>
                <FaPizzaSlice size={120} color="#2d3436" style={{ transform: 'rotate(45deg)' }} />
            </div>
            <div style={{ position: 'absolute', bottom: '30%', left: '8%', opacity: 0.06 }}>
                <FaPizzaSlice size={100} color="#2d3436" style={{ transform: 'rotate(-30deg)' }} />
            </div>

            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '480px', borderRadius: '20px', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #dc3545, #a71d2a)',
                    padding: '30px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '60px', height: '60px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 12px'
                    }}>
                        <FaPizzaSlice size={30} color="white" />
                    </div>
                    <h3 className="text-white fw-bold mb-1">Piceria</h3>
                    <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>
                        Krijo nje llogari te re
                    </p>
                </div>

                {/* Forma */}
                <div className="card-body p-4">
                    {error && (
                        <div className="alert alert-danger py-2" style={{ fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-6 mb-3">
                                <label className="form-label" style={{ fontSize: '0.9rem' }}>Emri</label>
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
                            <div className="col-6 mb-3">
                                <label className="form-label" style={{ fontSize: '0.9rem' }}>Mbiemri</label>
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
                            <label className="form-label" style={{ fontSize: '0.9rem' }}>Email</label>
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
                            <label className="form-label" style={{ fontSize: '0.9rem' }}>Telefoni</label>
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

                        <div className="mb-4">
                            <label className="form-label" style={{ fontSize: '0.9rem' }}>Fjalëkalimi</label>
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
                            className="btn btn-danger w-100 py-2 mb-3"
                            style={{ fontSize: '1.05rem', borderRadius: '10px' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Duke u regjistruar...
                                </>
                            ) : 'Regjistrohu'}
                        </button>

                        <p className="text-center text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                            Ke llogari?{' '}
                            <Link to="/login" className="text-danger fw-bold text-decoration-none">
                                Kyçu këtu
                            </Link>
                        </p>
                    </form>
                </div>

                <div className="text-center pb-3">
                    <small className="text-muted">&copy; 2026 Piceria | Lab Kurs 1 - UBT</small>
                </div>
            </div>
        </div>
    );
};

export default Register;