import { useState, useEffect } from 'react';
import API from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaTag, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import ExportImport from '../components/ExportImport';

const Kuponat = () => {
    const [kuponat, setKuponat] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        aktiv: '',
        zbritja_min: '',
        zbritja_max: '',
        data_nga: '',
        data_deri: '',
        i_skaduar: '',
        sort_by: '',
        sort_order: 'desc'
    });
    const [formData, setFormData] = useState({
        kodi: '',
        zbritja_perqind: '',
        zbritja_max: '',
        porosi_min: '',
        data_fillimit: '',
        data_skadimit: '',
        perdorimet_max: 1,
        aktiv: true
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchKuponat();
        }, 300);
        return () => clearTimeout(timeout);
    }, [filters]);

    const fetchKuponat = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== '' && value !== undefined) params.append(key, value);
            });
            const response = await API.get(`/kuponat/search?${params.toString()}`);
            setKuponat(response.data.te_dhena);
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
        setFilters({ search: '', aktiv: '', zbritja_min: '', zbritja_max: '', data_nga: '', data_deri: '', i_skaduar: '', sort_by: '', sort_order: 'desc' });
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
                await API.put(`/kuponat/${currentId}`, formData);
                setSuccess('Kuponi u perditesua me sukses!');
            } else {
                await API.post('/kuponat', formData);
                setSuccess('Kuponi u krijua me sukses!');
            }
            fetchKuponat();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.mesazhi || err.response?.data?.gabimet?.join(', ') || 'Gabim!');
        }
    };

    const handleEdit = (kupon) => {
        setFormData({
            kodi: kupon.kodi,
            zbritja_perqind: kupon.zbritja_perqind,
            zbritja_max: kupon.zbritja_max || '',
            porosi_min: kupon.porosi_min || '',
            data_fillimit: kupon.data_fillimit ? kupon.data_fillimit.split('T')[0] : '',
            data_skadimit: kupon.data_skadimit ? kupon.data_skadimit.split('T')[0] : '',
            perdorimet_max: kupon.perdorimet_max,
            aktiv: kupon.aktiv
        });
        setCurrentId(kupon.kupon_id);
        setEditMode(true);
        setShowForm(true);
        setError('');
        setSuccess('');
    };

    const handleDelete = async (id) => {
        if (window.confirm('A jeni te sigurt qe doni te fshini kete kupon?')) {
            try {
                await API.delete(`/kuponat/${id}`);
                setSuccess('Kuponi u fshi me sukses!');
                fetchKuponat();
            } catch (err) {
                setError(err.response?.data?.mesazhi || 'Gabim!');
            }
        }
    };

    const resetForm = () => {
        setFormData({ kodi: '', zbritja_perqind: '', zbritja_max: '', porosi_min: '', data_fillimit: '', data_skadimit: '', perdorimet_max: 1, aktiv: true });
        setEditMode(false);
        setCurrentId(null);
        setShowForm(false);
    };

    const isExpired = (date) => {
        return new Date(date) < new Date();
    };

    return (
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><FaTag className="me-2 text-danger" />Kuponat</h2>
                <button className="btn btn-danger" onClick={() => { if (showForm) { resetForm(); } else { setShowForm(true); setError(''); setSuccess(''); } }}>
                    <FaPlus className="me-1" /> {showForm ? 'Mbyll Formen' : 'Kupon i Ri'}
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {showForm && (
                <div className="card shadow-sm mb-4">
                    <div className="card-body">
                        <h5>{editMode ? 'Perditeso Kuponin' : 'Krijo Kupon te Ri'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Kodi i Kuponit</label>
                                    <input type="text" className="form-control" name="kodi" value={formData.kodi} onChange={handleChange} placeholder="p.sh. PIZZA20" required />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Zbritja (%)</label>
                                    <input type="number" step="0.01" className="form-control" name="zbritja_perqind" value={formData.zbritja_perqind} onChange={handleChange} required />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Zbritja Max (€)</label>
                                    <input type="number" step="0.01" className="form-control" name="zbritja_max" value={formData.zbritja_max} onChange={handleChange} />
                                </div>
                                <div className="col-md-2 mb-3">
                                    <label className="form-label">Porosi Min (€)</label>
                                    <input type="number" step="0.01" className="form-control" name="porosi_min" value={formData.porosi_min} onChange={handleChange} />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Perdorime Max</label>
                                    <input type="number" className="form-control" name="perdorimet_max" value={formData.perdorimet_max} onChange={handleChange} />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Data Fillimit</label>
                                    <input type="date" className="form-control" name="data_fillimit" value={formData.data_fillimit} onChange={handleChange} required />
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label className="form-label">Data Skadimit</label>
                                    <input type="date" className="form-control" name="data_skadimit" value={formData.data_skadimit} onChange={handleChange} required />
                                </div>
                                <div className="col-md-2 mb-3 d-flex align-items-end">
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-input" name="aktiv" checked={formData.aktiv} onChange={handleChange} />
                                        <label className="form-check-label">Aktiv</label>
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-danger me-2">{editMode ? 'Perditeso' : 'Ruaj'}</button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>Anulo</button>
                        </form>
                    </div>
                </div>
            )}

            <ExportImport entity="kuponat" entityLabel="Kuponat" onImportSuccess={fetchKuponat} />

            {/* Kerkim i Avancuar */}
            <div className="card shadow-sm mb-3">
                <div className="card-body pb-2">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            <div className="input-group">
                                <span className="input-group-text"><FaSearch /></span>
                                <input type="text" className="form-control" placeholder="Kerko sipas kodit..." name="search" value={filters.search} onChange={handleFilterChange} />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <select className="form-select" name="i_skaduar" value={filters.i_skaduar} onChange={handleFilterChange}>
                                <option value="">Te gjitha</option>
                                <option value="false">Aktive</option>
                                <option value="true">Te skaduar</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <select className="form-select" name="sort_by" value={filters.sort_by} onChange={handleFilterChange}>
                                <option value="">Rendit sipas...</option>
                                <option value="kodi">Kodi</option>
                                <option value="zbritja">Zbritja</option>
                                <option value="data_fillimit">Data Fillimit</option>
                                <option value="data_skadimit">Data Skadimit</option>
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
                            <div className="col-md-2 mb-2">
                                <label className="form-label small">Statusi</label>
                                <select className="form-select form-select-sm" name="aktiv" value={filters.aktiv} onChange={handleFilterChange}>
                                    <option value="">Te gjitha</option>
                                    <option value="1">Aktiv</option>
                                    <option value="0">Joaktiv</option>
                                </select>
                            </div>
                            <div className="col-md-2 mb-2">
                                <label className="form-label small">Zbritja Min (%)</label>
                                <input type="number" step="0.01" className="form-control form-control-sm" name="zbritja_min" value={filters.zbritja_min} onChange={handleFilterChange} />
                            </div>
                            <div className="col-md-2 mb-2">
                                <label className="form-label small">Zbritja Max (%)</label>
                                <input type="number" step="0.01" className="form-control form-control-sm" name="zbritja_max" value={filters.zbritja_max} onChange={handleFilterChange} />
                            </div>
                            <div className="col-md-2 mb-2">
                                <label className="form-label small">Data Nga</label>
                                <input type="date" className="form-control form-control-sm" name="data_nga" value={filters.data_nga} onChange={handleFilterChange} />
                            </div>
                            <div className="col-md-2 mb-2">
                                <label className="form-label small">Data Deri</label>
                                <input type="date" className="form-control form-control-sm" name="data_deri" value={filters.data_deri} onChange={handleFilterChange} />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted">{kuponat.length} kupona te gjetur</small>
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
                                    <th>Kodi</th>
                                    <th>Zbritja</th>
                                    <th>Zbritja Max</th>
                                    <th>Porosi Min</th>
                                    <th>Perdorimet</th>
                                    <th>Vlefshmeria</th>
                                    <th>Statusi</th>
                                    <th>Veprimet</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kuponat.length > 0 ? (
                                    kuponat.map((k) => (
                                        <tr key={k.kupon_id}>
                                            <td>{k.kupon_id}</td>
                                            <td><span className="badge bg-dark fs-6">{k.kodi}</span></td>
                                            <td>{k.zbritja_perqind}%</td>
                                            <td>{k.zbritja_max ? `${k.zbritja_max} €` : '-'}</td>
                                            <td>{k.porosi_min ? `${k.porosi_min} €` : '-'}</td>
                                            <td>{k.perdorimet_aktuale} / {k.perdorimet_max}</td>
                                            <td>
                                                {new Date(k.data_fillimit).toLocaleDateString('sq-AL')} - {new Date(k.data_skadimit).toLocaleDateString('sq-AL')}
                                            </td>
                                            <td>
                                                {isExpired(k.data_skadimit) ? (
                                                    <span className="badge bg-danger">Skaduar</span>
                                                ) : k.aktiv ? (
                                                    <span className="badge bg-success">Aktiv</span>
                                                ) : (
                                                    <span className="badge bg-secondary">Joaktiv</span>
                                                )}
                                            </td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(k)}><FaEdit /></button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(k.kupon_id)}><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="9" className="text-center text-muted">Nuk ka kupona te gjetur</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Kuponat;