import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import ExportImport from '../components/ExportImport';

const Klientet = () => {
    const [klientet, setKlientet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        data_nga: '',
        data_deri: '',
        sort_by: '',
        sort_order: 'desc'
    });
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
        const timeout = setTimeout(() => {
            fetchKlientet();
        }, 300);
        return () => clearTimeout(timeout);
    }, [filters]);

    const fetchKlientet = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== undefined) params.append(key, value);
            });
            const response = await API.get(`/klientet/search?${params.toString()}`);
            setKlientet(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilters({ search: '', data_nga: '', data_deri: '', sort_by: '', sort_order: 'desc' });
    };

    const activeFilterCount = Object.entries(filters).filter(([key, value]) => value !== '' && key !== 'sort_order').length;

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

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><FaUsers className="me-2 text-danger" />Klientet</h2>
                <button className="btn btn-danger" onClick={() => { if (showForm) { resetForm(); } else { setShowForm(true); setError(''); setSuccess(''); } }}>
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

            <ExportImport entity="klientet" entityLabel="Klientet" onImportSuccess={fetchKlientet} />

            {/* Kerkim i Avancuar */}
            <div className="card shadow-sm mb-3">
                <div className="card-body pb-2">
                    <div className="row align-items-center">
                        <div className="col-md-5">
                            <div className="input-group">
                                <span className="input-group-text"><FaSearch /></span>
                                <input type="text" className="form-control" placeholder="Kerko sipas emrit, mbiemrit, emailit ose telefonit..." name="search" value={filters.search} onChange={handleFilterChange} />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select className="form-select" name="sort_by" value={filters.sort_by} onChange={handleFilterChange}>
                                <option value="">Rendit sipas...</option>
                                <option value="emri">Emri</option>
                                <option value="mbiemri">Mbiemri</option>
                                <option value="email">Email</option>
                                <option value="data">Data Regjistrimit</option>
                            </select>
                        </div>
                        <div className="col-md-2 d-flex gap-1">
                            <button className={`btn btn-sm ${filters.sort_order === 'asc' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilters({ ...filters, sort_order: 'asc' })}>↑</button>
                            <button className={`btn btn-sm ${filters.sort_order === 'desc' ? 'btn-dark' : 'btn-outline-dark'}`} onClick={() => setFilters({ ...filters, sort_order: 'desc' })}>↓</button>
                            <button className={`btn btn-sm ${showFilters ? 'btn-warning' : 'btn-outline-warning'}`} onClick={() => setShowFilters(!showFilters)}>
                                <FaFilter /> {activeFilterCount > 0 && <span className="badge bg-danger ms-1">{activeFilterCount}</span>}
                            </button>
                            {activeFilterCount > 0 && (
                                <button className="btn btn-sm btn-outline-secondary" onClick={clearFilters}><FaTimes /></button>
                            )}
                        </div>
                    </div>

                    {showFilters && (
                        <div className="row mt-3 pt-3 border-top">
                            <div className="col-md-3 mb-2">
                                <label className="form-label small">Regjistruar Nga</label>
                                <input type="date" className="form-control form-control-sm" name="data_nga" value={filters.data_nga} onChange={handleFilterChange} />
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small">Regjistruar Deri</label>
                                <input type="date" className="form-control form-control-sm" name="data_deri" value={filters.data_deri} onChange={handleFilterChange} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">{klientet.length} kliente te gjetur</small>
            </div>

            <div className="card shadow-sm">
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-danger" role="status">
                                <span className="visually-hidden">Duke u ngarkuar...</span>
                            </div>
                        </div>
                    ) : (
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
                                {klientet.length > 0 ? (
                                    klientet.map((k) => (
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
                                    <tr><td colSpan="8" className="text-center text-muted">Nuk ka kliente te gjetur</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Klientet;