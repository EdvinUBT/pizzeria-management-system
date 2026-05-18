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
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow" style={{ width: '100%', maxWidth: '420px' }}>
                <div className="card-body p-4">
                    <div className="text-center mb-4">
                        <FaPizzaSlice size={50} className="text-danger mb-2" />
                        <h3 className="fw-bold">Piceria</h3>
                        <p className="text-muted">Kyçu në llogarinë tënde</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
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

                        <div className="mb-3">
                            <label className="form-label">Fjalëkalimi</label>
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
                            className="btn btn-danger w-100 mb-3"
                            disabled={loading}
                        >
                            {loading ? 'Duke u kyçur...' : 'Kyçu'}
                        </button>

                        <p className="text-center text-muted">
                            Nuk ke llogari?{' '}
                            <Link to="/register" className="text-danger">
                                Regjistrohu këtu
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;