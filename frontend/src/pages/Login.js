import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPizzaSlice, FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.mesazhi || 'Gabim gjate login!');
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

            <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: '440px', borderRadius: '20px', overflow: 'hidden' }}>
                {/* Header i kartes */}
                <div style={{
                    background: 'linear-gradient(135deg, #dc3545, #a71d2a)',
                    padding: '35px 30px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '70px', height: '70px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 15px'
                    }}>
                        <FaPizzaSlice size={35} color="white" />
                    </div>
                    <h2 className="text-white fw-bold mb-1">Piceria</h2>
                    <p className="mb-0" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                        Sistemi per menaxhimin e picerise
                    </p>
                </div>

                {/* Forma */}
                <div className="card-body p-4">
                    <h5 className="fw-bold mb-1">Kyçu 👋</h5>
                    <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>Shkruaj te dhenat e llogarise tende</p>

                    {error && (
                        <div className="alert alert-danger py-2" role="alert" style={{ fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label" style={{ fontSize: '0.9rem' }}>Email</label>
                            <div className="input-group">
                                <span className="input-group-text"><FaEnvelope /></span>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="email@shembull.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
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
                                    placeholder="Shkruaj fjalekalimin"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                    Duke u kyçur...
                                </>
                            ) : 'Kyçu'}
                        </button>

                        <p className="text-center text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                            Nuk ke llogari?{' '}
                            <Link to="/register" className="text-danger fw-bold text-decoration-none">
                                Regjistrohu këtu
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center pb-3">
                    <small className="text-muted">&copy; 2026 Piceria | Lab Kurs 1 - UBT</small>
                </div>
            </div>
        </div>
    );
};

export default Login;