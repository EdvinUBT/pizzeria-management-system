import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaUserTie, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const Punonjesit = () => {
    const [punonjesit, setPunonjesit] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        roli: '',
        aktiv: '',
        sort_by: '',
        sort_order: 'desc'
    });
    const [formData, setFormData] = useState({
        emri: '',
        mbiemri: '',
        roli: '',
        telefoni: '',
        email: '',
        aktiv: true
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchPunonjesit();
        }, 300);
        return () => clearTimeout(timeout);
    }, [filters]);

    const fetchPunonjesit = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== undefined) params.append(key, value);
            });
            const response = await API.get(`/punonjesit/search?${params.toString()}`);
            setPunonjesit(response.data.te_dhena);
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
        setFilters({ search: '', roli: '', aktiv: '', sort_by: '', sort_order: 'desc' });
    };

    const activeFilterCount = Object.entries(filters).filter(([key, value]) => value !== '' && key !== 'sort_order').length;

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editMode) {
                await API.put(`/punonjesit/${currentId}`, formData);
                setSuccess('Punonjesi u perditesua me sukses!');
            } else {
                await API.post('/punonjesit', formData);
                setSuccess('Punonjesi u krijua me sukses!');
            }
            fetchPunonjesit();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.mesazhi || err.response?.data?.gabimet?.join(', ') || 'Gabim!');
        }
    };

    const handleEdit = (punonjes) => {
        setFormData({
            emri: punonjes.emri,
            mbiemri: punonjes.mbiemri,
            roli: punonjes.roli,
            telefoni: punonjes.telefoni || '',
            email: punonjes.email || '',
            aktiv: punonjes.aktiv
        });
        setCurrentId(punonjes.punonjes_id);
        setEditMode(true);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni te sigurt qe doni te fshini kete punonjes?')) {
            try {
                await API.delete(`/punonjesit/${id}`);
                setSuccess('Punonjesi u fshi me sukses!');
                fetchPunonjesit();
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim gjate fshirjes!');
            }
        }
    };

    const resetForm = () => {
        setFormData({ emri: '', mbiemri: '', roli: '', telefoni: '', email: '', aktiv: true });
        setEditMode(false);
        setCurrentId(null);
        setShowForm(false);
    };

    const getRolBadge = (roli) => {
        const classes = {
            'admin': 'bg-danger',
            'menaxher': 'bg-primary',
            'kuzhinier': 'bg-warning text-dark',
            'kamarier': 'bg-info',
            'shofer': 'bg-success'
        };
        return classes[roli] || 'bg-secondary';
    };

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><FaUserTie className="me-2 text-danger" />Punonjesit</h2>
                <button className="btn btn-danger" onClick={() => { if (showForm) { resetForm(); } else { setShowForm(true); setError(''); setSuccess(''); } }}>
                    <FaPlus className="me-1" /> {showForm ? 'Mbyll Formen' : 'Shto Punonjes'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {showForm && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5>{editMode ? 'Perditeso Punonjesin' : 'Shto Punonjes te Ri'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Emri</label>
                                    <input type="text" className="form-control" name="emri" value={formData.emri} onChange={handleChange} required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Mbiemri</label>
                                    <input type="text" className="form-control" name="mbiemri" value={formData.mbiemri} onChange={handleChange} required />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Roli</label>
                                    <select className="form-select" name="roli" value={formData.roli} onChange={handleChange} required>
                                        <option value="">Zgjidh rolin</option>
                                        <option value="menaxher">Menaxher</option>
                                        <option value="kuzhinier">Kuzhinier</option>
                                        <option value="kamarier">Kamarier</option>
                                        <option value="shofer">Shofer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Telefoni</label>
                                    <input type="text" className="form-control" name="telefoni" value={formData.telefoni} onChange={handleChange} />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-check mb-3">
                                <input type="checkbox" className="form-check-input" name="aktiv" checked={formData.aktiv} onChange={handleChange} />
                                <label className="form-check-label">Aktiv</label>
                            </div>
                            <button type="submit" className="btn btn-danger me-2">{editMode ? 'Perditeso' : 'Ruaj'}</button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>Anulo</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Kerkim i Avancuar */}
            <div className="card shadow-sm mb-3">
                <div className="card-body pb-2">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text"><FaSearch /></span>
                                <input type="text" className="form-control" placeholder="Kerko sipas emrit, mbiemrit, emailit..." name="search" value={filters.search} onChange={handleFilterChange} />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <select className="form-select" name="roli" value={filters.roli} onChange={handleFilterChange}>
                                <option value="">Te gjitha rolet</option>
                                <option value="menaxher">Menaxher</option>
                                <option value="kuzhinier">Kuzhinier</option>
                                <option value="kamarier">Kamarier</option>
                                <option value="shofer">Shofer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select className="form-select" name="sort_by" value={filters.sort_by} onChange={handleFilterChange}>
                                <option value="">Rendit sipas...</option>
                                <option value="emri">Emri</option>
                                <option value="mbiemri">Mbiemri</option>
                                <option value="roli">Roli</option>
                                <option value="email">Email</option>
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
                                <label className="form-label small">Statusi</label>
                                <select className="form-select form-select-sm" name="aktiv" value={filters.aktiv} onChange={handleFilterChange}>
                                    <option value="">Te gjithe</option>
                                    <option value="1">Aktiv</option>
                                    <option value="0">Joaktiv</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">{punonjesit.length} punonjes te gjetur</small>
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
                                    <th>Roli</th>
                                    <th>Telefoni</th>
                                    <th>Email</th>
                                    <th>Statusi</th>
                                    <th>Veprimet</th>
                                </tr>
                            </thead>
                            <tbody>
                                {punonjesit.length > 0 ? (
                                    punonjesit.map((p) => (
                                        <tr key={p.punonjes_id}>
                                            <td>{p.punonjes_id}</td>
                                            <td>{p.emri}</td>
                                            <td>{p.mbiemri}</td>
                                            <td><span className={`badge ${getRolBadge(p.roli)}`}>{p.roli}</span></td>
                                            <td>{p.telefoni || '-'}</td>
                                            <td>{p.email || '-'}</td>
                                            <td>
                                                <span className={`badge ${p.aktiv ? 'bg-success' : 'bg-secondary'}`}>
                                                    {p.aktiv ? 'Aktiv' : 'Joaktiv'}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(p)}><FaEdit /></button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.punonjes_id)}><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="8" className="text-center text-muted">Nuk ka punonjes te gjetur</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Punonjesit;