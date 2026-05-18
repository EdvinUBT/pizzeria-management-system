import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaSearch } from 'react-icons/fa';

const Klientet = () => {
    const [klientet, setKlientet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [search, setSearch] = useState('');
    const [formData, setFormData] = useState({
        emri: '',
        mbiemri: '',
        email: '',
        telefoni: '',
        adresa: '',
        fjalekalimi: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchKlientet();
    }, []);

    const fetchKlientet = async () => {
        try {
            const response = await API.get('/klientet');
            setKlientet(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editMode) {
                const { fjalekalimi, ...updateData } = formData;
                await API.put(`/klientet/${currentId}`, updateData);
                setSuccess('Klienti u perditesua me sukses!');
            } else {
                await API.post('/klientet', formData);
                setSuccess('Klienti u krijua me sukses!');
            }
            fetchKlientet();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.mesazhi || err.response?.data?.gabimet?.join(', ') || 'Gabim!');
        }
    };

    const handleEdit = (klient) => {
        setFormData({
            emri: klient.emri,
            mbiemri: klient.mbiemri,
            email: klient.email,
            telefoni: klient.telefoni || '',
            adresa: klient.adresa || '',
            fjalekalimi: ''
        });
        setCurrentId(klient.klient_id);
        setEditMode(true);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni te sigurt qe doni te fshini kete klient?')) {
            try {
                await API.delete(`/klientet/${id}`);
                setSuccess('Klienti u fshi me sukses!');
                fetchKlientet();
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim gjate fshirjes!');
            }
        }
    };

    const resetForm = () => {
        setFormData({ emri: '', mbiemri: '', email: '', telefoni: '', adresa: '', fjalekalimi: '' });
        setEditMode(false);
        setCurrentId(null);
        setShowForm(false);
    };

    const filteredKlientet = klientet.filter(k => {
        return k.emri.toLowerCase().includes(search.toLowerCase()) ||
            k.mbiemri.toLowerCase().includes(search.toLowerCase()) ||
            k.email.toLowerCase().includes(search.toLowerCase());
    });

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Duke u ngarkuar...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><FaUsers className="me-2 text-danger" />Klientet</h2>
                <button className="btn btn-danger" onClick={() => { setShowForm(!showForm); resetForm(); }}>
                    <FaPlus className="me-1" /> {showForm ? 'Mbyll Formen' : 'Shto Klient'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {showForm && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5>{editMode ? 'Perditeso Klientin' : 'Shto Klient te Ri'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Emri</label>
                                    <input type="text" className="form-control" name="emri" value={formData.emri} onChange={handleChange} required />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Mbiemri</label>
                                    <input type="text" className="form-control" name="mbiemri" value={formData.mbiemri} onChange={handleChange} required />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Telefoni</label>
                                    <input type="text" className="form-control" name="telefoni" value={formData.telefoni} onChange={handleChange} />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Adresa</label>
                                    <input type="text" className="form-control" name="adresa" value={formData.adresa} onChange={handleChange} />
                                </div>
                                {!editMode && (
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label">Fjalekalimi</label>
                                        <input type="password" className="form-control" name="fjalekalimi" value={formData.fjalekalimi} onChange={handleChange} required />
                                    </div>
                                )}
                            </div>
                            <button type="submit" className="btn btn-danger me-2">{editMode ? 'Perditeso' : 'Ruaj'}</button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>Anulo</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="row mb-3">
                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text"><FaSearch /></span>
                        <input type="text" className="form-control" placeholder="Kerko klient..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Emri</th>
                                <th>Mbiemri</th>
                                <th>Email</th>
                                <th>Telefoni</th>
                                <th>Adresa</th>
                                <th>Data Regjistrimit</th>
                                <th>Veprimet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredKlientet.length > 0 ? (
                                filteredKlientet.map((k) => (
                                    <tr key={k.klient_id}>
                                        <td>{k.klient_id}</td>
                                        <td>{k.emri}</td>
                                        <td>{k.mbiemri}</td>
                                        <td>{k.email}</td>
                                        <td>{k.telefoni || '-'}</td>
                                        <td>{k.adresa || '-'}</td>
                                        <td>{new Date(k.data_regjistrimit).toLocaleDateString('sq-AL')}</td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(k)}><FaEdit /></button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(k.klient_id)}><FaTrash /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" className="text-center text-muted">Nuk ka kliente ende</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Klientet;