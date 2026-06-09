import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaPizzaSlice, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const Produktet = () => {
    const [produktet, setProduktet] = useState([]);
    const [kategorite, setKategorite] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        kategori_id: '',
        cmimi_min: '',
        cmimi_max: '',
        aktive: '',
        sort_by: '',
        sort_order: 'desc'
    });
    const [formData, setFormData] = useState({
        kategori_id: '',
        emri_produktit: '',
        pershkrimi: '',
        cmimi_baze: '',
        foto_url: '',
        aktive: true,
        koha_pergatitjes_min: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchKategorite();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchProduktet();
        }, 300);
        return () => clearTimeout(timeout);
    }, [filters]);

    const fetchProduktet = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== undefined) params.append(key, value);
            });
            const response = await API.get(`/produktet/search?${params.toString()}`);
            setProduktet(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchKategorite = async () => {
        try {
            const response = await API.get('/kategorite');
            setKategorite(response.data.te_dhena);
        } catch (error) {
            console.error('Gabim:', error);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilters({ search: '', kategori_id: '', cmimi_min: '', cmimi_max: '', aktive: '', sort_by: '', sort_order: 'desc' });
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
                await API.put(`/produktet/${currentId}`, formData);
                setSuccess('Produkti u perditesua me sukses!');
            } else {
                await API.post('/produktet', formData);
                setSuccess('Produkti u krijua me sukses!');
            }
            fetchProduktet();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.mesazhi || err.response?.data?.gabimet?.join(', ') || 'Gabim!');
        }
    };

    const handleEdit = (produkt) => {
        setFormData({
            kategori_id: produkt.kategori_id,
            emri_produktit: produkt.emri_produktit,
            pershkrimi: produkt.pershkrimi || '',
            cmimi_baze: produkt.cmimi_baze,
            foto_url: produkt.foto_url || '',
            aktive: produkt.aktive,
            koha_pergatitjes_min: produkt.koha_pergatitjes_min || ''
        });
        setCurrentId(produkt.produkt_id);
        setEditMode(true);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni te sigurt qe doni te fshini kete produkt?')) {
            try {
                await API.delete(`/produktet/${id}`);
                setSuccess('Produkti u fshi me sukses!');
                fetchProduktet();
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim gjate fshirjes!');
            }
        }
    };

    const resetForm = () => {
        setFormData({ kategori_id: '', emri_produktit: '', pershkrimi: '', cmimi_baze: '', foto_url: '', aktive: true, koha_pergatitjes_min: '' });
        setEditMode(false);
        setCurrentId(null);
        setShowForm(false);
    };

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><FaPizzaSlice className="me-2 text-danger" />Produktet</h2>
                <button className="btn btn-danger" onClick={() => { if (showForm) { resetForm(); } else { setShowForm(true); setError(''); setSuccess(''); } }}>
                    <FaPlus className="me-1" /> {showForm ? 'Mbyll Formen' : 'Shto Produkt'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {showForm && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5>{editMode ? 'Perditeso Produktin' : 'Shto Produkt te Ri'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Emri i Produktit</label>
                                    <input type="text" className="form-control" name="emri_produktit" value={formData.emri_produktit} onChange={handleChange} required />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Kategoria</label>
                                    <select className="form-select" name="kategori_id" value={formData.kategori_id} onChange={handleChange} required>
                                        <option value="">Zgjidh kategorine</option>
                                        {kategorite.map(k => (
                                            <option key={k.kategori_id} value={k.kategori_id}>{k.emri_kategorise}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Cmimi (€)</label>
                                    <input type="number" step="0.01" className="form-control" name="cmimi_baze" value={formData.cmimi_baze} onChange={handleChange} required />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Pershkrimi</label>
                                    <input type="text" className="form-control" name="pershkrimi" value={formData.pershkrimi} onChange={handleChange} />
                                </div>
                                <div className="col-md-4 mb-3">
                                    <label className="form-label">Foto URL</label>
                                    <input type="text" className="form-control" name="foto_url" value={formData.foto_url} onChange={handleChange} />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Koha Pergatitjes (min)</label>
                                    <input type="number" className="form-control" name="koha_pergatitjes_min" value={formData.koha_pergatitjes_min} onChange={handleChange} />
                                </div>
                                <div className="col-md-2 mb-3 d-flex align-items-end">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" name="aktive" checked={formData.aktive} onChange={handleChange} />
                                        <label className="form-check-label">Aktive</label>
                                    </div>
                                </div>
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
                        <div className="col-md-5">
                            <div className="input-group">
                                <span className="input-group-text"><FaSearch /></span>
                                <input type="text" className="form-control" placeholder="Kerko sipas emrit ose pershkrimit..." name="search" value={filters.search} onChange={handleFilterChange} />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select className="form-select" name="kategori_id" value={filters.kategori_id} onChange={handleFilterChange}>
                                <option value="">Te gjitha kategorite</option>
                                {kategorite.map(k => (
                                    <option key={k.kategori_id} value={k.kategori_id}>{k.emri_kategorise}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select className="form-select" name="sort_by" value={filters.sort_by} onChange={handleFilterChange}>
                                <option value="">Rendit sipas...</option>
                                <option value="emri">Emri</option>
                                <option value="cmimi">Cmimi</option>
                                <option value="kategoria">Kategoria</option>
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
                                <label className="form-label small">Cmimi Min (€)</label>
                                <input type="number" step="0.01" className="form-control form-control-sm" name="cmimi_min" value={filters.cmimi_min} onChange={handleFilterChange} />
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small">Cmimi Max (€)</label>
                                <input type="number" step="0.01" className="form-control form-control-sm" name="cmimi_max" value={filters.cmimi_max} onChange={handleFilterChange} />
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small">Statusi</label>
                                <select className="form-select form-select-sm" name="aktive" value={filters.aktive} onChange={handleFilterChange}>
                                    <option value="">Te gjitha</option>
                                    <option value="1">Aktive</option>
                                    <option value="0">Joaktive</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">{produktet.length} produkte te gjetura</small>
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
                                    <th>Kategoria</th>
                                    <th>Cmimi</th>
                                    <th>Koha</th>
                                    <th>Statusi</th>
                                    <th>Veprimet</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produktet.length > 0 ? (
                                    produktet.map((p) => (
                                        <tr key={p.produkt_id}>
                                            <td>{p.produkt_id}</td>
                                            <td className="d-flex align-items-center">
                                                {p.foto_url && (
                                                    <img src={p.foto_url} alt={p.emri_produktit} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', marginRight: '10px' }} />
                                                )}
                                                {p.emri_produktit}
                                            </td>
                                            <td><span className="badge bg-info">{p.emri_kategorise}</span></td>
                                            <td>{p.cmimi_baze} €</td>
                                            <td>{p.koha_pergatitjes_min} min</td>
                                            <td>
                                                <span className={`badge ${p.aktive ? 'bg-success' : 'bg-secondary'}`}>
                                                    {p.aktive ? 'Aktive' : 'Joaktive'}
                                                </span>
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(p)}><FaEdit /></button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p.produkt_id)}><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center text-muted">Nuk ka produkte te gjetura</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Produktet;